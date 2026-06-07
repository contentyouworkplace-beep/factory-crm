-- PackCRM Supabase Schema
-- Run this once in your Supabase SQL Editor (https://supabase.com/dashboard/project/wtipusjtoemphyrusnvg/sql)

-- Single table stores all app data as JSONB per entity type
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER app_state_updated_at
  BEFORE UPDATE ON app_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security: open for anon (add auth in Phase 3)
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon"
  ON app_state FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
