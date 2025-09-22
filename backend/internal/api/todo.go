package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type TodoItem struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Completed   bool   `json:"completed"`
	Priority    string `json:"priority"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

func TodoRoutes() chi.Router {
	r := chi.NewRouter()
	r.Get("/", listTodos)
	r.Get("/{id}", getTodo)
	r.Post("/", createTodo)
	r.Put("/{id}", updateTodo)
	r.Delete("/{id}", deleteTodo)
	return r
}

func listTodos(w http.ResponseWriter, r *http.Request) {
	// stubbed response (later integrate DB)
	todos := []TodoItem{
		{ID: 1, Title: "Sample task", Completed: false, Priority: "medium", CreatedAt: "2025-01-01T00:00:00Z", UpdatedAt: "2025-01-01T00:00:00Z"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"data": todos, "pagination": map[string]int{"page":1,"per_page":10,"total":1}})
}

func getTodo(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, _ := strconv.Atoi(idStr)
	item := TodoItem{ID: id, Title: "Sample task " + idStr, Completed: false, Priority: "medium", CreatedAt: "2025-01-01T00:00:00Z", UpdatedAt: "2025-01-01T00:00:00Z"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	var in TodoItem
	json.NewDecoder(r.Body).Decode(&in)
	in.ID = 999 // stub id
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(in)
}

func updateTodo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	_ = id
	var in TodoItem
	json.NewDecoder(r.Body).Decode(&in)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(in)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}
