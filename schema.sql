DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS bins;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE bins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bin_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bin_id UUID REFERENCES bins(id) NOT NULL,
  mongo_id TEXT,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  http_method TEXT,
  http_path TEXT
);