package router

import (
	"github.com/naufallariff/Industrix-Todo/backend/internal/api/handler"
	"github.com/naufallariff/Industrix-Todo/backend/internal/repository"
	"github.com/naufallariff/Industrix-Todo/backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SetupRoutes initializes all API handlers and registers their routes.
func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// Initialize repositories
	todoRepo := repository.NewTodoRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)

	// Initialize services
	todoService := service.NewTodoService(todoRepo)
	categoryService := service.NewCategoryService(categoryRepo)

	// Initialize handlers
	todoHandler := handler.NewTodoHandler(todoService)
	categoryHandler := handler.NewCategoryHandler(categoryService)

	// API group with versioning
	v1 := r.Group("/api/v1")
	{
		// Todos endpoints
		todos := v1.Group("/todos")
		todos.GET("/", todoHandler.GetTodos)
		todos.POST("/", todoHandler.CreateTodo)
		todos.GET("/:id", todoHandler.GetTodoByID)
		todos.PUT("/:id", todoHandler.UpdateTodo)
		todos.PATCH("/:id/complete", todoHandler.ToggleCompleted)
		todos.DELETE("/:id", todoHandler.DeleteTodo)

		// Categories endpoints
		categories := v1.Group("/categories")
		categories.GET("/", categoryHandler.GetAllCategories)
		categories.POST("/", categoryHandler.CreateCategory)
		categories.PUT("/:id", categoryHandler.UpdateCategory)
		categories.DELETE("/:id", categoryHandler.DeleteCategory)
	}
}
