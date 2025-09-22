package domain

import (
	"database/sql"
	"gorm.io/gorm"
	"time"
)

// Todo represents the 'todos' table in the database.
type Todo struct {
	gorm.Model
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Description sql.NullString `gorm:"type:text" json:"description"`
	Completed   bool           `gorm:"not null;default:false" json:"completed"`
	Priority    string         `gorm:"type:varchar(10);not null;default:'low'" json:"priority"`
	DueDate     sql.NullTime   `gorm:"type:timestamptz" json:"due_date"`
	CategoryID  sql.NullInt64  `gorm:"type:bigint" json:"category_id"`
	Category    *Category      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"category"`
}

// NewTodoRequest represents the input data for creating a new todo.
type NewTodoRequest struct {
	Title       string     `json:"title" binding:"required"`
	Description *string    `json:"description"`
	Priority    *string    `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  *uint      `json:"category_id"`
}

// UpdateTodoRequest represents the input data for updating an existing todo.
type UpdateTodoRequest struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	Completed   *bool      `json:"completed"`
	Priority    *string    `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  *uint      `json:"category_id"`
}

// NewCategoryRequest represents the input data for creating a new category.
type NewCategoryRequest struct {
	Name  string `json:"name" binding:"required"`
	Color string `json:"color" binding:"required"`
}
