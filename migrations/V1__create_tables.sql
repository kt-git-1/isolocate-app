CREATE TABLE IF NOT EXISTS analysis_run (
  id UUID PRIMARY KEY,
  user_id UUID,
  status TEXT NOT NULL,
  input_json JSONB NOT NULL,
  params_json JSONB,
  reference_dataset_id UUID NOT NULL,
  result_json JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS reference_dataset (
  id UUID PRIMARY KEY,
  name TEXT,
  version TEXT,
  description TEXT,
  data_path TEXT,
  checksum TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
