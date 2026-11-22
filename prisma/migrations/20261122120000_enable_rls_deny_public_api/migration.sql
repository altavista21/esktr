-- Security hardening 1/8: deny direct Supabase Data API access to application tables.
-- The Next.js server accesses these tables through Prisma using DATABASE_URL.
-- No anon/authenticated policies are intentionally created: access is deny-by-default.
-- Do NOT use FORCE ROW LEVEL SECURITY here; the trusted Prisma database owner role
-- must continue to access data. Never expose DATABASE_URL or service credentials.

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issued_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE
  public.user_profiles,
  public.institutions,
  public.institution_members,
  public.applications,
  public.application_documents,
  public.verifications,
  public.decisions,
  public.issued_documents,
  public.audit_logs
FROM PUBLIC, anon, authenticated;
