ALTER TABLE prototype_comments
ADD COLUMN project_id TEXT NOT NULL DEFAULT 'rooster-pos-prep';

CREATE INDEX IF NOT EXISTS idx_prototype_comments_project_page_created
ON prototype_comments (project_id, page_id, created_at DESC);
