DROP TABLE IF EXISTS bins;
DROP TABLE IF EXISTS requests;

CREATE TABLE bins (
  id UUID PRIMARY KEY,
  bin_path TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE requests (
  id UUID PRIMARY KEY,
  bin_id UUID REFERENCES bins(id) NOT NULL,
  mongo_id TEXT,
  received_at TIMESTAMP NOT NULL,
  http_method TEXT,
  http_path TEXT
);