-- Security hardening: audit events are append-only.
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs are append-only; UPDATE and DELETE are forbidden';
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_immutable ON public.audit_logs;
CREATE TRIGGER audit_logs_immutable
BEFORE UPDATE OR DELETE ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.prevent_audit_log_mutation();
