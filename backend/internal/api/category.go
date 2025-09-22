package api

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type Category struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

func CategoryRoutes() chi.Router {
	r := chi.NewRouter()
	r.Get("/", listCategories)
	r.Post("/", createCategory)
	return r
}

func listCategories(w http.ResponseWriter, r *http.Request) {
	cats := []Category{{ID: 1, Name: "Work", Color: "#3B82F6"}}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cats)
}

func createCategory(w http.ResponseWriter, r *http.Request) {
	var c Category
	json.NewDecoder(r.Body).Decode(&c)
	c.ID = 2
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(c)
}
