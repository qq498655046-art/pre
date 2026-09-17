CREATE TABLE IF NOT EXISTS prototype_comments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  x_pct REAL NOT NULL,
  y_pct REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'resolved')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prototype_comments_project_page_created
ON prototype_comments (project_id, page_id, created_at DESC);

CREATE TABLE IF NOT EXISTS prototype_comment_replies (
  id TEXT PRIMARY KEY,
  comment_id TEXT NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prototype_comment_replies_comment_created
ON prototype_comment_replies (comment_id, created_at ASC);
