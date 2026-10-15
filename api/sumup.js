import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const SESSION_COOKIE = 'bh_sumup_session'
const STATE_COOKIE = 'bh_sumup_state'
const apiBase = 'https://api.sumup.com'

function secretKey() {
  const secret = process.env.SUMUP_SESSION_SECRET || ''
  if (secret.length < 32) throw new Error('SUMUP_SESSION_SECRET must contain at least 32 characters')
  return createHash('sha256').update(secret).digest()
}
function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').map(part => {
    const index = part.indexOf('=')
    return index < 0 ? ['', ''] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]
  }).filter(([key]) => key))
}
function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return name + '=' + encodeURIComponent(value) + '; HttpOnly; SameSite=Lax; Path=/api/sumup; Max-Age=' + maxAge + secure
}
function clearCookie(name) { return cookie(name, '', 0) }
function encryptSession(session) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', secretKey(), iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url')
}
function decryptSession(value) {
  const input = Buffer.from(value, 'base64url')
  if (input.length < 29) throw new Error('Invalid session')
  const decipher = createDecipheriv('aes-256-gcm', secretKey(), input.subarray(0, 12))
  decipher.setAuthTag(input.subarray(12, 28))
  return JSON.parse(Buffer.concat([decipher.update(input.subarray(28)), decipher.final()]).toString('utf8'))
}
function redirectUri() { return process.env.SUMUP_REDIRECT_URI || '' }
function configured() { return Boolean(process.env.SUMUP_CLIENT_ID && process.env.SUMUP_CLIENT_SECRET && process.env.SUMUP_SESSION_SECRET && redirectUri()) }
function replyJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}
async function exchangeToken(values) {
  const response = await fetch(apiBase + '/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(values) })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.access_token) throw new Error('SumUp token exchange failed')
  return data
}
async function currentSession(req, res) {
  const value = cookies(req)[SESSION_COOKIE]
  if (!value) return null
  let session
  try { session = decryptSession(value) } catch { return null }
  if (session.expiresAt > Date.now() + 120000) return session
  if (!session.refreshToken || !configured()) return null
  try {
    const refreshed = await exchangeToken({ grant_type: 'refresh_token', refresh_token: session.refreshToken, client_id: process.env.SUMUP_CLIENT_ID, client_secret: process.env.SUMUP_CLIENT_SECRET })
    session = { ...session, accessToken: refreshed.access_token, refreshToken: refreshed.refresh_token || session.refreshToken, expiresAt: Date.now() + Number(refreshed.expires_in || 3600) * 1000 }
    res.setHeader('Set-Cookie', cookie(SESSION_COOKIE, encryptSession(session), 60 * 60 * 24 * 30))
    return session
  } catch { return null }
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const action = String(req.query?.action || '')
  if (req.method !== 'GET') return replyJson(res, 405, { error: 'Method not allowed' })
  if (action === 'status') {
    const session = configured() ? await currentSession(req, res) : null
    return replyJson(res, 200, { configured: configured(), connected: Boolean(session), merchantCode: session?.merchantCode || null })
  }
  if (action === 'disconnect') {
    res.setHeader('Set-Cookie', clearCookie(SESSION_COOKIE))
    return replyJson(res, 200, { connected: false })
  }
  if (action === 'connect') {
    if (!configured()) return replyJson(res, 503, { error: 'SumUp connection is not configured on the server yet.' })
    const state = randomBytes(24).toString('base64url')
    const signature = createHmac('sha256', secretKey()).update(state).digest('base64url')
    res.setHeader('Set-Cookie', cookie(STATE_COOKIE, state + '.' + signature, 300))
    const authorize = new URL(apiBase + '/authorize')
    authorize.searchParams.set('response_type', 'code')
    authorize.searchParams.set('client_id', process.env.SUMUP_CLIENT_ID)
    authorize.searchParams.set('redirect_uri', redirectUri())
    authorize.searchParams.set('scope', 'transactions.history user.profile_readonly')
    authorize.searchParams.set('state', state)
    res.statusCode = 302; res.setHeader('Location', authorize.toString()); return res.end()
  }
  if (action === 'callback') {
    const values = cookies(req)
    const sent = values[STATE_COOKIE] || ''
    const [state, signature] = sent.split('.')
    const returned = String(req.query?.state || '')
    const expected = state && configured() ? createHmac('sha256', secretKey()).update(state).digest('base64url') : ''
    const valid = state && signature && returned === state && Buffer.from(signature).length === Buffer.from(expected).length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    res.setHeader('Set-Cookie', [clearCookie(STATE_COOKIE), clearCookie(SESSION_COOKIE)])
    if (!configured() || !valid || !req.query?.code) {
      res.statusCode = 302; res.setHeader('Location', '/?sumup=failed'); return res.end()
    }
    try {
      const tokens = await exchangeToken({ grant_type: 'authorization_code', code: String(req.query.code), redirect_uri: redirectUri(), client_id: process.env.SUMUP_CLIENT_ID, client_secret: process.env.SUMUP_CLIENT_SECRET })
      const profileResponse = await fetch(apiBase + '/v0.1/me', { headers: { Authorization: 'Bearer ' + tokens.access_token } })
      const profile = await profileResponse.json().catch(() => ({}))
      if (!profileResponse.ok || !profile.merchant_code) throw new Error('SumUp merchant profile could not be read')
      const session = { accessToken: tokens.access_token, refreshToken: tokens.refresh_token, expiresAt: Date.now() + Number(tokens.expires_in || 3600) * 1000, merchantCode: profile.merchant_code }
      res.setHeader('Set-Cookie', [clearCookie(STATE_COOKIE), cookie(SESSION_COOKIE, encryptSession(session), 60 * 60 * 24 * 30)])
      res.statusCode = 302; res.setHeader('Location', '/?sumup=connected'); return res.end()
    } catch {
      res.setHeader('Set-Cookie', [clearCookie(STATE_COOKIE), clearCookie(SESSION_COOKIE)])
      res.statusCode = 302; res.setHeader('Location', '/?sumup=failed'); return res.end()
    }
  }
  if (action === 'transactions') {
    if (!configured()) return replyJson(res, 503, { error: 'SumUp OAuth is not configured on the server.' })
    const session = await currentSession(req, res)
    if (!session) return replyJson(res, 401, { error: 'Connect SumUp to view transactions.' })
    const url = new URL(apiBase + '/v2.1/merchants/' + encodeURIComponent(session.merchantCode) + '/transactions/history')
    url.searchParams.set('limit', '100'); url.searchParams.set('order', 'descending')
    const response = await fetch(url, { headers: { Authorization: 'Bearer ' + session.accessToken } })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) return replyJson(res, response.status === 401 ? 401 : 502, { error: 'SumUp could not return transaction history. Reconnect and try again.' })
    const items = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : []
    return replyJson(res, 200, { transactions: items })
  }
  return replyJson(res, 404, { error: 'Unknown SumUp action' })
}
