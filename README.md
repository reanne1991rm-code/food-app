# Business Hub — starter v0.1

A responsive React + TypeScript web app starter for managing documents across multiple businesses. The first workspace is **The Small Kitchen**, with starter templates and a food-safety setup checklist.

## What's in this starter

- Responsive dashboard and mobile navigation
- Three separate demo workspaces
- Searchable document library
- Create and edit text/Markdown documents
- Import small text and binary files into browser storage and download them again
- Food Safety Centre checklist for the management pack, daily checks, temperature records, cleaning, allergens, deliveries, corrective actions and staff records
- Browser-local persistence and an offline app-shell service worker
- Initial Supabase/Postgres schema with workspace membership roles, document versions, checklist records, audit events and row-level security policies

## Important prototype limitations

This is a **local-first prototype**, not a deployed or production-ready service. It does not yet have login, real cloud storage, shared team access, cross-device synchronisation, a full Word/PDF editor, or robust offline conflict resolution. Data lives in the browser's local storage, which can be cleared by the browser and has limited capacity. Imported files are limited to 1.5 MB in this prototype. Export important documents regularly. Do not rely on it as the only copy of business or food-safety records.

The Food Safety Centre contains starter templates and a checklist only. A checked item is not evidence that a procedure is legally compliant. Review current Food Standards Agency guidance and ensure the actual system matches the business's menu, equipment, preparation locations and working practices.

## Run locally

Requires a current Node.js LTS release.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

To test a production build:

```bash
npm run build
npm run preview
```

## Publish with GitHub and Vercel

1. Create a new, private GitHub repository named `business-hub`.
2. Unzip/copy these project files into the repository and commit them.
3. Import the repository into Vercel. Framework preset: **Vite**; build command: `npm run build`; output directory: `dist`.
4. Deploy the frontend prototype. The prototype still uses local browser storage until the cloud backend is connected.

## Cloud backend milestone

1. Create a Supabase project.
2. Review `supabase/schema.sql` and apply it in the Supabase SQL editor in a test project first.
3. Create a **private** Storage bucket named `business-documents`; add and test storage object policies so every object is restricted to a workspace the signed-in user belongs to.
4. Add Supabase Auth and invite-based membership flows. Verify owner/admin/editor/viewer permissions with separate test accounts.
5. Add database-backed document versioning and audit events. Never expose the Supabase service-role key in browser code.
6. Implement IndexedDB-backed offline drafts and a sync queue with conflict handling. Do not silently overwrite simultaneous edits.
7. Add automated tests for access-control policies before storing real business records.

## Suggested next milestones

- **v0.2:** Supabase authentication, workspace membership and private cloud file storage.
- **v0.3:** document versions, restore, richer editing and export formats.
- **v0.4:** robust offline queue, sync status and conflict resolution.
- **v0.5:** food-safety daily logs, review history, corrective actions and reminders.

## Architecture notes

- Frontend: React, TypeScript, Vite
- Planned backend: Supabase Auth, Postgres, private Storage
- Local-first foundation: service-worker app shell and local browser persistence (prototype); IndexedDB sync queue is still to be implemented
- Deployment: GitHub + Vercel
"# food-app" 
"# food-app" 
"# food-app" 
"# food-app" 
"# food-app" 
