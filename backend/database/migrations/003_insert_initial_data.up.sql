INSERT INTO categories (name, color, deleted_at) VALUES
('Work', '#3B82F6', NULL),
('Personal', '#EF4444', NULL),
('Shopping', '#10B981', NULL),
('Health & Fitness', '#F59E0B', NULL);

INSERT INTO todos (title, description, completed, category_id, priority, due_date, deleted_at) VALUES
('Complete coding challenge', 'Build a full-stack todo application for Industrix', FALSE, 1, 'high', '2024-08-03T23:59:59Z', NULL),
('Grocery shopping', 'Milk, eggs, and bread', FALSE, 3, 'low', '2025-10-10T15:00:00Z', NULL),
('Read "The Lord of the Rings"', 'Read chapter 3 today', TRUE, 2, 'medium', NULL, NULL),
('Finish documentation', 'Write a detailed README with setup instructions and technical decisions', FALSE, 1, 'high', '2024-08-02T18:00:00Z', NULL),
('Go for a run', '30-minute jog in the park', FALSE, 4, 'low', '2025-09-23T07:00:00Z', NULL);