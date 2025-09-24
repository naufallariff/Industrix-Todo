-- Hapus batasan UNIQUE default pada kolom 'name' dari step 1.
-- Perintah ini menghapus index unik yang dibuat secara implisit.
-- Nama constraint default biasanya adalah 'categories_name_key'.
ALTER TABLE categories DROP CONSTRAINT categories_name_key;

-- Buat Partial Unique Index:
-- Index ini memastikan keunikan 'name' HANYA jika baris belum dihapus (deleted_at IS NULL).
CREATE UNIQUE INDEX idx_categories_name_unique_active 
ON categories (name) 
WHERE deleted_at IS NULL;

-- Index untuk pencarian todos berdasarkan title menggunakan Full-Text Search
CREATE INDEX idx_todos_title ON todos USING GIN (to_tsvector('english', title));

-- Index untuk filter berdasarkan status selesai
CREATE INDEX idx_todos_completed ON todos (completed);

-- Index untuk filter berdasarkan kategori (category_id)
CREATE INDEX idx_todos_category_id ON todos (category_id);

-- Index untuk filter atau pengurutan berdasarkan prioritas
CREATE INDEX idx_todos_priority ON todos (priority);