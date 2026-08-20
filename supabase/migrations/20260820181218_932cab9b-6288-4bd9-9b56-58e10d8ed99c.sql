
-- roles
CREATE TYPE public.app_role AS ENUM ('admin','analyst','viewer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'analyst')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- monitoring data
CREATE TABLE public.assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ip TEXT NOT NULL,
  mac TEXT NOT NULL,
  vendor TEXT NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  firmware TEXT NOT NULL,
  os TEXT NOT NULL,
  serial TEXT NOT NULL,
  zone TEXT NOT NULL,
  purdue TEXT NOT NULL,
  criticality TEXT NOT NULL,
  risk_score INT NOT NULL DEFAULT 0,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  protocols JSONB NOT NULL DEFAULT '[]'::jsonb,
  vulnerabilities INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Online',
  managed BOOLEAN NOT NULL DEFAULT true,
  is_new BOOLEAN NOT NULL DEFAULT false,
  location TEXT NOT NULL,
  site TEXT NOT NULL
);

CREATE TABLE public.conversations (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  src_id TEXT NOT NULL,
  src_name TEXT NOT NULL,
  src_ip TEXT NOT NULL,
  src_zone TEXT NOT NULL,
  dst_id TEXT NOT NULL,
  dst_name TEXT NOT NULL,
  dst_ip TEXT NOT NULL,
  dst_zone TEXT NOT NULL,
  protocol TEXT NOT NULL,
  src_port INT NOT NULL,
  dst_port INT NOT NULL,
  packets BIGINT NOT NULL,
  bytes BIGINT NOT NULL,
  status TEXT NOT NULL,
  risk TEXT NOT NULL,
  anomaly_score INT NOT NULL DEFAULT 0
);
CREATE INDEX conversations_ts_idx ON public.conversations (timestamp DESC);

CREATE TABLE public.alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  src_name TEXT NOT NULL,
  dst_name TEXT NOT NULL,
  protocol TEXT NOT NULL,
  zone TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  explanation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  asset_id TEXT NOT NULL,
  mitre TEXT NOT NULL,
  anomaly_score INT NOT NULL DEFAULT 0,
  owner TEXT NOT NULL DEFAULT 'Unassigned',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX alerts_ts_idx ON public.alerts (timestamp DESC);

CREATE TABLE public.baselines (
  id TEXT PRIMARY KEY,
  src_name TEXT NOT NULL,
  dst_name TEXT NOT NULL,
  protocol TEXT NOT NULL,
  port INT NOT NULL,
  frequency TEXT NOT NULL,
  volume TEXT NOT NULL,
  typical_time TEXT NOT NULL,
  confidence INT NOT NULL,
  state TEXT NOT NULL,
  anomaly_score INT NOT NULL DEFAULT 0,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE public.zones (
  name TEXT PRIMARY KEY,
  purdue TEXT NOT NULL,
  assets INT NOT NULL DEFAULT 0,
  traffic TEXT NOT NULL,
  risk TEXT NOT NULL,
  alerts INT NOT NULL DEFAULT 0,
  conduits JSONB NOT NULL DEFAULT '[]'::jsonb,
  unauthorized INT NOT NULL DEFAULT 0
);

CREATE TABLE public.sensors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  ip TEXT NOT NULL,
  status TEXT NOT NULL,
  pps INT NOT NULL DEFAULT 0,
  bandwidth TEXT NOT NULL,
  interfaces JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_heartbeat TEXT NOT NULL,
  packet_drops TEXT NOT NULL,
  version TEXT NOT NULL,
  health INT NOT NULL DEFAULT 100
);

CREATE TABLE public.vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cve TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  vendor TEXT NOT NULL,
  product TEXT NOT NULL,
  cvss NUMERIC(3,1) NOT NULL,
  exploitability TEXT NOT NULL,
  criticality TEXT NOT NULL,
  risk_score INT NOT NULL,
  ot_risk TEXT NOT NULL,
  patch_available BOOLEAN NOT NULL DEFAULT false,
  mitigation_available BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Open',
  description TEXT NOT NULL,
  reachable BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE public.threat_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator TEXT NOT NULL,
  type TEXT NOT NULL,
  campaign TEXT NOT NULL,
  confidence INT NOT NULL,
  severity TEXT NOT NULL,
  matches INT NOT NULL DEFAULT 0,
  last_seen TEXT NOT NULL,
  source TEXT NOT NULL
);

CREATE TABLE public.protocol_stats (
  name TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  assets INT NOT NULL DEFAULT 0,
  sessions INT NOT NULL DEFAULT 0,
  volume TEXT NOT NULL,
  volume_mb NUMERIC NOT NULL DEFAULT 0,
  unexpected INT NOT NULL DEFAULT 0,
  alerts INT NOT NULL DEFAULT 0,
  port INT NOT NULL
);

CREATE TABLE public.investigation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT NOT NULL DEFAULT 'INV-2041',
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  severity TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "time" TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  ip TEXT NOT NULL DEFAULT '10.20.30.10',
  result TEXT NOT NULL DEFAULT 'Success',
  user_id UUID
);
CREATE INDEX audit_log_time_idx ON public.audit_log ("time" DESC);

-- grants + RLS
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['assets','conversations','alerts','baselines','zones','sensors','vulnerabilities','threat_intel','protocol_stats','investigation_events','audit_log'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "signed in can read" ON public.%I FOR SELECT TO authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "admins manage" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(),''admin'')) WITH CHECK (public.has_role(auth.uid(),''admin''))', t);
  END LOOP;
END $$;

CREATE POLICY "analysts triage alerts" ON public.alerts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'analyst')) WITH CHECK (public.has_role(auth.uid(),'analyst'));
CREATE POLICY "analysts triage vulns" ON public.vulnerabilities FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'analyst')) WITH CHECK (public.has_role(auth.uid(),'analyst'));
CREATE POLICY "analysts add investigation events" ON public.investigation_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'analyst'));
CREATE POLICY "signed in write audit" ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
