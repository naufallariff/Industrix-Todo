package repository

import (
	"github.com/google/uuid"
	"github.com/naufallariff/Industrix-Todo/backend/internal/domain"
	"gorm.io/gorm"
)

type TodoRepository interface {
	FindWithPaginationAndSearch(page, limit int, search, status, categoryID, priority string) ([]domain.Todo, int64, error)
	FindByID(id uuid.UUID) (*domain.Todo, error)
	Create(todo *domain.Todo) error
	Update(todo *domain.Todo) error
	Delete(id uuid.UUID) error
}

type todoRepository struct {
	db *gorm.DB
}

func NewTodoRepository(db *gorm.DB) TodoRepository {
	return &todoRepository{db: db}
}

func (r *todoRepository) FindWithPaginationAndSearch(page, limit int, search, status, categoryID, priority string) ([]domain.Todo, int64, error) {
	var todos []domain.Todo
	var total int64

	query := r.db.Model(&domain.Todo{})

	if search != "" {
		query = query.Where("title ILIKE ?", "%"+search+"%")
	}
	if status != "" {
		switch status {
		case "completed":
			query = query.Where("completed = ?", true)
		case "incomplete":
			query = query.Where("completed = ?", false)
		}
	}
	if categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}
	if priority != "" {
		query = query.Where("priority = ?", priority)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err := query.Limit(limit).Offset(offset).Preload("Category").Find(&todos).Error
	if err != nil {
		return nil, 0, err
	}

	return todos, total, nil
}

func (r *todoRepository) FindByID(id uuid.UUID) (*domain.Todo, error) {
	var todo domain.Todo
	if err := r.db.Preload("Category").First(&todo, id).Error; err != nil {
		return nil, err
	}
	return &todo, nil
}

func (r *todoRepository) Create(todo *domain.Todo) error {
	return r.db.Create(todo).Error
}

func (r *todoRepository) Update(todo *domain.Todo) error {
	return r.db.Save(todo).Error
}

func (r *todoRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.Todo{}, id).Error
}
