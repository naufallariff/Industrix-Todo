-- Index for searching todos by title using Full-Text Search
CREATE INDEX idx_todos_title ON todos USING GIN (to_tsvector('english', title));

-- Index for filtering by completion status
CREATE INDEX idx_todos_completed ON todos (completed);

-- Index for filtering by category (category_id is now UUID, but the index is still valid)
CREATE INDEX idx_todos_category_id ON todos (category_id);

-- Index for filtering or sorting by priority
CREATE INDEX idx_todos_priority ON todos (priority);