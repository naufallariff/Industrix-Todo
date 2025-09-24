-- Berikan semua hak akses pada tabel 'categories' kepada user 'industrixtodo'
GRANT ALL PRIVILEGES ON categories TO industrixtodo;
-- Berikan hak akses untuk sequence (jika ada)
-- GRANT ALL PRIVILEGES ON SEQUENCE categories_id_seq TO industrixtodo;

-- Berikan semua hak akses pada tabel 'todos' kepada user 'industrixtodo'
GRANT ALL PRIVILEGES ON todos TO industrixtodo;
-- Berikan hak akses untuk sequence (jika ada)
-- GRANT ALL PRIVILEGES ON SEQUENCE todos_id_seq TO industrixtodo;

-- opsional: memberikan hak akses untuk semua tabel yang akan datang
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO industrixtodo;

-- opsional: memberikan hak akses untuk semua sequence yang akan datang
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO industrixtodo;