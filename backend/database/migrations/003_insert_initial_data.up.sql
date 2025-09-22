-- Insert initial categories
INSERT INTO categories (name, color) VALUES
('Work', '#3B82F6'),
('Personal', '#EF4444'),
('Shopping', '#10B981'),
('Health & Fitness', '#F59E0B');

-- Insert initial todos
INSERT INTO todos (title, description, completed, category_id, priority, due_date) VALUES
('Complete coding challenge', 'Build a full-stack todo application for Industrix', FALSE, 1, 'high', '2024-08-03T23:59:59Z'),
('Grocery shopping', 'Milk, eggs, and bread', FALSE, 3, 'low', '2025-10-10T15:00:00Z'),
('Read "The Lord of the Rings"', 'Read chapter 3 today', TRUE, 2, 'medium', NULL),
('Finish documentation', 'Write a detailed README with setup instructions and technical decisions', FALSE, 1, 'high', '2024-08-02T18:00:00Z'),
('Go for a run', '30-minute jog in the park', FALSE, 4, 'low', '2025-09-23T07:00:00Z');