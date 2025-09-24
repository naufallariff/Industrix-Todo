-- Insert initial categories with generated UUIDs
INSERT INTO categories (id, name, color) VALUES
('b06497f1-5a4e-4f1e-8e5b-4d4b1f2b6e1a', 'Work', '#3B82F6'),
('d508e7a0-0b6d-4e9e-8a1a-7b3b4d4f8e9c', 'Personal', '#EF4444'),
('a1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'Shopping', '#10B981'),
('f6b7c8d9-e0a1-42b3-a4c5-6d7e8f9a0b1c', 'Health & Fitness', '#F59E0B');

-- Insert initial todos referencing the new UUIDs
INSERT INTO todos (id, title, description, completed, category_id, priority, due_date) VALUES
('e8b0d2d3-f2a8-4c12-8d7b-9c6e5f4a3c2b', 'Complete coding challenge', 'Build a full-stack todo application for Industrix', FALSE, 'b06497f1-5a4e-4f1e-8e5b-4d4b1f2b6e1a', 'high', '2024-08-03T23:59:59Z'),
('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Grocery shopping', 'Milk, eggs, and bread', FALSE, 'a1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', 'low', '2025-10-10T15:00:00Z'),
('9b8a7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 'Read "The Lord of the Rings"', 'Read chapter 3 today', TRUE, 'd508e7a0-0b6d-4e9e-8a1a-7b3b4d4f8e9c', 'medium', NULL),
('1f2e3d4c-5b6a-7f8e-9d0c-a1b2c3d4e5f6', 'Finish documentation', 'Write a detailed README with setup instructions and technical decisions', FALSE, 'b06497f1-5a4e-4f1e-8e5b-4d4b1f2b6e1a', 'high', '2024-08-02T18:00:00Z'),
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'Go for a run', '30-minute jog in the park', FALSE, 'f6b7c8d9-e0a1-42b3-a4c5-6d7e8f9a0b1c', 'low', '2025-09-23T07:00:00Z');