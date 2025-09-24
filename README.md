# Industrix Todo List Application - Full Stack Engineer Intern Challenge

Aplikasi *To-Do List* Full-Stack yang dibangun menggunakan React, TypeScript, Go, dan PostgreSQL. Aplikasi ini dirancang dengan arsitektur berlapis, fokus pada *clean code*, *type safety*, dan solusi database yang optimal untuk *soft delete*.

## ✨ Fitur Utama

Aplikasi ini mengimplementasikan semua fitur wajib dan beberapa fitur bonus:

### Manajemen Tugas (Todo)
* **CRUD Penuh**: Membuat, melihat, memperbarui, dan menghapus tugas.
* **Toggle Status**: Menandai tugas sebagai selesai/belum selesai.
* **Prioritas**: Mendukung level prioritas Tinggi, Sedang, dan Rendah.

### Manajemen Kategori & List
* **CRUD Kategori**: Membuat dan mengelola kategori kustom.
* **Indeks Unik Parsial**: Solusi database tingkat lanjut yang memungkinkan nama kategori diulang setelah kategori sebelumnya di-*soft delete*.
* **Paginasi**: Menampilkan daftar tugas dengan kontrol paginasi.
* **Pencarian & Filter**: Mencari berdasarkan judul dan memfilter berdasarkan Kategori, Prioritas, dan Status Selesai.
* **UI/UX Modular**: Tampilan frontend dibagi menjadi dua kartu terpisah (Filter dan List) untuk memastikan hanya daftar tugas yang me-render ulang saat filter/pencarian berubah.

## 🛠️ Cara Menjalankan Aplikasi Secara Lokal

Aplikasi ini membutuhkan **Go**, **Node.js/npm**, dan **PostgreSQL** yang terinstal di sistem Anda.

### 1. Setup Database (PostgreSQL)

Pastikan layanan PostgreSQL berjalan.

1.  **Buat Database & User**: Buat database baru (misalnya `industrix_db`) dan user (`industrixtodo`) sesuai dengan konfigurasi di `.env`.

    *File: `backend/.env`*
    ```env
    DATABASE_URL="postgres://industrixtodo:industrixtodo@localhost:5432/industrix_db?sslmode=disable"
    ```

2.  **Jalankan Migrasi**: Masuk ke folder `backend` dan jalankan alat migrasi (misalnya `golang-migrate/migrate`) untuk menerapkan semua skema.
    *Migrasi akan secara otomatis:*
    * Membuat ekstensi `uuid-ossp`.
    * Membuat tabel `categories` dan `todos` dengan **UUID** sebagai Primary Key.
    * Menerapkan **Partial Unique Index** pada `categories.name` untuk mendukung *soft delete*.
    * Mengisi data awal.

### 2. Setup Backend (Go)

1.  Masuk ke folder `backend`.
2.  Instal dependensi Go, termasuk pustaka UUID dan GORM.
    ```bash
    go mod tidy
    ```
3.  Jalankan server API. Server akan berjalan di `http://localhost:4000`.
    ```bash
    go run cmd/server/main.go
    ```

### 3. Setup Frontend (React/TypeScript)

1.  Masuk ke folder `frontend`.
2.  Instal dependensi NPM.
    ```bash
    npm install
    ```
3.  Jalankan aplikasi di mode pengembangan. Frontend akan berjalan di `http://localhost:5173`, menggunakan proxy untuk mengarah ke backend di port 4000.
    ```bash
    npm run dev
    ```

Aplikasi siap diakses di `http://localhost:5173`.

## 📡 Dokumentasi API (RESTful Endpoints)

Semua endpoint di-prefix dengan `/api/v1`. ID kategori dan todo harus berupa **UUID** (String).

### To-Dos (`/api/v1/todos`)

| Metode | Endpoint | Deskripsi | Payload (Contoh) |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Daftar tugas dengan paginasi, pencarian, dan filter. | `?page=1&limit=10&search=sample&category_id={UUID}` |
| `GET` | `/{id}` | Ambil tugas spesifik. | - |
| `POST` | `/` | Buat tugas baru. | `{ "title": "New Task", "priority": "medium", "category_id": "{UUID}" }` |
| `PUT` | `/{id}` | Perbarui tugas. | `{ "title": "Updated Title", "completed": true }` |
| `PATCH` | `/{id}/complete` | Toggle status selesai. | `{ "completed": true }` |
| `DELETE` | `/{id}` | Hapus (Soft Delete) tugas. | - |

### Kategori (`/api/v1/categories`)

| Metode | Endpoint | Deskripsi | Payload (Contoh) |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Daftar semua kategori aktif. | - |
| `POST` | `/` | Buat kategori baru. | `{ "name": "Work", "color": "#FF0000" }` |
| `DELETE` | `/{id}` | Hapus (Soft Delete) kategori. | - |

## 💡 Jawaban Pertanyaan Teknis

### 1. Database Design

| Tabel | Tujuan | Primary Key | Hubungan |
| :--- | :--- | :--- | :--- |
| `categories` | Menyimpan nama dan warna kategori. | `id` (UUID) | Induk (One) |
| `todos` | Menyimpan detail tugas. | `id` (UUID) | Anak (Many) |

* **Relationship**: Satu-ke-Banyak (`categories` 1:N `todos`). Kolom `category_id` di `todos` adalah *Foreign Key* yang merujuk ke `categories.id` dengan aksi `ON DELETE SET NULL`.
* **Choice of Structure**: Struktur ini dinormalisasi dan fleksibel. Pemilihan **UUID** sebagai PK menjamin keunikan global, dan penggunaan kolom `deleted_at` (soft delete) di kedua tabel memungkinkan data tetap ada untuk tujuan audit.

### 2. Pagination dan Filtering di Database

* **Filtering & Sorting**: Filtering dilakukan di lapisan *repository* (`FindWithPaginationAndSearch`) menggunakan GORM `Where()` clauses berdasarkan query parameter (`status`, `priority`, `category_id`, `search`). Pencarian teks (`search`) menggunakan kueri `ILIKE` atau *Full-Text Search* (`to_tsvector` dengan GIN Index).
* **Pagination Efisien**: Menggunakan kombinasi `LIMIT` dan `OFFSET` pada kueri utama, didahului oleh `COUNT(*)` untuk mendapatkan total data, sesuai praktik standar SQL.
* **Indexes**:
    * **Partial Unique Index (`categories`):** Diterapkan pada `categories(name) WHERE deleted_at IS NULL`. Ini adalah solusi wajib untuk mengatasi konflik duplikasi nama ketika kategori di-*soft delete*.
    * **Performance Indexes (`todos`):** Indeks GIN pada `title` (untuk pencarian) dan indeks B-tree pada `completed`, `category_id`, dan `priority` (untuk filter cepat).

### 3. Backend Architecture (Go)

* **Pilihan Arsitektur**: Menggunakan **Layered Architecture (Handler -> Service -> Repository)**.
    * **Handler (Gin)**: Menerima request, validasi format dasar, dan mengelola respons HTTP (JSON).
    * **Service (Logika Bisnis)**: Berisi logika inti, seperti memastikan tugas toogle berfungsi.
    * **Repository (GORM)**: Berinteraksi langsung dengan database dan menangani semua kueri (CRUD, Filter, Pagination).
* **Error Handling**: Menggunakan *custom* `ErrorResponse` utilitas dan *try-catch* di level `Handler` untuk menangkap `gorm.ErrRecordNotFound` (404) dan *unique constraint violation* (di-*catch* sebagai 500 dan di-*handle* oleh FE).

### 4. Frontend Component Structure

* **Hierarchy**: Arsitektur modular di `App.tsx` (sebagai *Controller View*) mengelola semua state global (`todos`, `categories`, `pagination`, `filters`) dan fungsi aksi (`handleDeleteTodo`, `handleAddTodo`).
* **State Management**: Menggunakan *React Hooks* (`useState`, `useCallback`) untuk *local state* dan *lifting state up* (mengoper state dan handler melalui props).
* **Modularitas**: Pemisahan tegas antara `TodoFilters.tsx` (input/kontrol) dan `TodoList.tsx` (display/output) memastikan *re-render* minimal; hanya `TodoList` yang diperbarui saat pencarian/filter berubah.