-- Hapus indeks yang dibuat oleh 002_add_indexes.up.sql
DROP INDEX IF EXISTS idx_todos_title;
DROP INDEX IF EXISTS idx_todos_completed;
DROP INDEX IF EXISTS idx_todos_category_id;
DROP INDEX IF EXISTS idx_todos_priority;

-- Hapus indeks parsial (jika sudah sempat Anda coba buat)
DROP INDEX IF EXISTS idx_categories_name_unique_active;