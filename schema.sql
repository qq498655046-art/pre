CREATE TABLE IF NOT EXISTS prototype_comments (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'resolved')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prototype_comments_page_created
ON prototype_comments (page_id, created_at DESC);
