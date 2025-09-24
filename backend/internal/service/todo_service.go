package service

import (
	"database/sql"
	"github.com/google/uuid"
	"github.com/naufallariff/Industrix-Todo/backend/internal/domain"
	"github.com/naufallariff/Industrix-Todo/backend/internal/repository"
)

type TodoService interface {
	GetTodos(page, limit int, search, status, categoryID, priority string) ([]domain.Todo, int64, error)
	GetTodoByID(id uuid.UUID) (*domain.Todo, error)
	CreateTodo(req domain.NewTodoRequest) (*domain.Todo, error)
	UpdateTodo(id uuid.UUID, req domain.UpdateTodoRequest) (*domain.Todo, error)
	ToggleCompleted(id uuid.UUID) (*domain.Todo, error)
	DeleteTodo(id uuid.UUID) error
}

type todoService struct {
	repo repository.TodoRepository
}

func NewTodoService(repo repository.TodoRepository) TodoService {
	return &todoService{repo: repo}
}

func (s *todoService) GetTodos(page, limit int, search, status, categoryID, priority string) ([]domain.Todo, int64, error) {
	return s.repo.FindWithPaginationAndSearch(page, limit, search, status, categoryID, priority)
}

func (s *todoService) GetTodoByID(id uuid.UUID) (*domain.Todo, error) {
	return s.repo.FindByID(id)
}

func (s *todoService) CreateTodo(req domain.NewTodoRequest) (*domain.Todo, error) {
	todo := &domain.Todo{
		Title:     req.Title,
		Completed: false,
		Priority:  "low",
	}
	if req.Description != nil {
		todo.Description = sql.NullString{String: *req.Description, Valid: true}
	}
	if req.Priority != nil {
		todo.Priority = *req.Priority
	}
	if req.DueDate != nil {
		todo.DueDate = sql.NullTime{Time: *req.DueDate, Valid: true}
	}
	if req.CategoryID != nil {
		todo.CategoryID = req.CategoryID
	}

	if err := s.repo.Create(todo); err != nil {
		return nil, err
	}
	return todo, nil
}

func (s *todoService) UpdateTodo(id uuid.UUID, req domain.UpdateTodoRequest) (*domain.Todo, error) {
	todo, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if req.Title != nil {
		todo.Title = *req.Title
	}
	if req.Description != nil {
		todo.Description = sql.NullString{String: *req.Description, Valid: true}
	}
	if req.Completed != nil {
		todo.Completed = *req.Completed
	}
	if req.Priority != nil {
		todo.Priority = *req.Priority
	}
	if req.DueDate != nil {
		todo.DueDate = sql.NullTime{Time: *req.DueDate, Valid: true}
	}
	if req.CategoryID != nil {
		todo.CategoryID = req.CategoryID
	}

	if err := s.repo.Update(todo); err != nil {
		return nil, err
	}
	return todo, nil
}

func (s *todoService) ToggleCompleted(id uuid.UUID) (*domain.Todo, error) {
	todo, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	todo.Completed = !todo.Completed
	if err := s.repo.Update(todo); err != nil {
		return nil, err
	}
	return todo, nil
}

func (s *todoService) DeleteTodo(id uuid.UUID) error {
	return s.repo.Delete(id)
}
