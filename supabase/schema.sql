-- Business Hub v1 schema foundation for Supabase/Postgres.
-- Review and apply only after creating your own Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  category text not null default 'General',
  content text not null default '',
  storage_path text,
  mime_type text,
  file_size bigint,
  version integer not null default 1 check (version > 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  version integer not null,
  title text not null,
  content text not null default '',
  storage_path text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (document_id, version)
);

create table if not exists public.safety_checklist_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  detail text not null default '',
  is_complete boolean not null default false,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists workspace_members_user_idx on public.workspace_members(user_id);
create index if not exists documents_workspace_updated_idx on public.documents(workspace_id, updated_at desc);
create index if not exists safety_items_workspace_idx on public.safety_checklist_items(workspace_id);
create index if not exists audit_events_workspace_created_idx on public.audit_events(workspace_id, created_at desc);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.workspace_members m where m.workspace_id = target_workspace and m.user_id = auth.uid()); $$;

create or replace function public.has_workspace_role(target_workspace uuid, allowed_roles text[])
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.workspace_members m where m.workspace_id = target_workspace and m.user_id = auth.uid() and m.role = any(allowed_roles)); $$;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.safety_checklist_items enable row level security;
alter table public.audit_events enable row level security;

create policy "members can view their workspaces" on public.workspaces for select to authenticated using (public.is_workspace_member(id));
create policy "authenticated users can create a workspace as owner" on public.workspaces for insert to authenticated with check (created_by = auth.uid());
create policy "admins can update workspace details" on public.workspaces for update to authenticated using (public.has_workspace_role(id, array['owner','admin'])) with check (public.has_workspace_role(id, array['owner','admin']));

create policy "members can view workspace membership" on public.workspace_members for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "owners and admins manage members" on public.workspace_members for all to authenticated using (public.has_workspace_role(workspace_id, array['owner','admin'])) with check (public.has_workspace_role(workspace_id, array['owner','admin']));
create policy "workspace creator adds self as owner" on public.workspace_members for insert to authenticated with check (user_id = auth.uid() and role = 'owner' and exists (select 1 from public.workspaces w where w.id = workspace_id and w.created_by = auth.uid()));

create policy "members can read documents" on public.documents for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "editors can create documents" on public.documents for insert to authenticated with check (public.has_workspace_role(workspace_id, array['owner','admin','editor']) and created_by = auth.uid() and updated_by = auth.uid());
create policy "editors can update documents" on public.documents for update to authenticated using (public.has_workspace_role(workspace_id, array['owner','admin','editor'])) with check (public.has_workspace_role(workspace_id, array['owner','admin','editor']) and updated_by = auth.uid());
create policy "admins can delete documents" on public.documents for delete to authenticated using (public.has_workspace_role(workspace_id, array['owner','admin']));

create policy "members can read document versions" on public.document_versions for select to authenticated using (exists (select 1 from public.documents d where d.id = document_id and public.is_workspace_member(d.workspace_id)));
create policy "editors can create document versions" on public.document_versions for insert to authenticated with check (created_by = auth.uid() and exists (select 1 from public.documents d where d.id = document_id and public.has_workspace_role(d.workspace_id, array['owner','admin','editor'])));

create policy "members can read safety checklist" on public.safety_checklist_items for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "editors can manage safety checklist" on public.safety_checklist_items for all to authenticated using (public.has_workspace_role(workspace_id, array['owner','admin','editor'])) with check (public.has_workspace_role(workspace_id, array['owner','admin','editor']));

create policy "members can read audit events" on public.audit_events for select to authenticated using (public.is_workspace_member(workspace_id));
create policy "members can add audit events" on public.audit_events for insert to authenticated with check (actor_id = auth.uid() and public.is_workspace_member(workspace_id));

-- IMPORTANT: configure a PRIVATE Supabase Storage bucket named `business-documents`.
-- Add storage.objects policies that check the first path segment is the workspace UUID
-- and call public.is_workspace_member() / public.has_workspace_role(). Do not make the bucket public.
-- Never expose the service-role key in frontend code. Review all policies before production use.
