package domain

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)
type Todo struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Description sql.NullString `gorm:"type:text" json:"description"`
	Completed   bool           `gorm:"not null;default:false" json:"completed"`
	Priority    string         `gorm:"type:varchar(10);not null;default:'low'" json:"priority"`
	DueDate     sql.NullTime   `gorm:"type:timestamptz" json:"due_date"`
	CategoryID  *uuid.UUID     `gorm:"type:uuid" json:"category_id"`
	Category    *Category      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"category"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}
type NewTodoRequest struct {
	Title       string     `json:"title" binding:"required"`
	Description *string    `json:"description"`
	Priority    *string    `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  *uuid.UUID `json:"category_id"`
}
type UpdateTodoRequest struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	Completed   *bool      `json:"completed"`
	Priority    *string    `json:"priority"`
	DueDate     *time.Time `json:"due_date"`
	CategoryID  *uuid.UUID `json:"category_id"`
}
type NewCategoryRequest struct {
	Name  string `json:"name" binding:"required"`
	Color string `json:"color" binding:"required"`
}
