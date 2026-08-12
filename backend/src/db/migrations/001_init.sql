-- Example table to verify the DB connection end-to-end.
-- Replace with real schema once the app's data model is defined.
CREATE TABLE IF NOT EXISTS ping (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
