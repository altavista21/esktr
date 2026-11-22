-- Persistent login throttling shared by all serverless instances.
-- Only keyed HMAC digests are stored; raw emails and IP addresses are never persisted.
CREATE TABLE IF NOT EXISTS public.login_rate_limits (
  bucket_hash text PRIMARY KEY,
  attempts integer NOT NULL CHECK (attempts > 0),
  window_started_at timestamptz NOT NULL,
  blocked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.login_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.login_rate_limits FROM PUBLIC, anon, authenticated;
