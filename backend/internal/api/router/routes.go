package router

import (
	"github.com/naufallariff/Industrix-Todo/backend/internal/api/handler"
	"github.com/naufallariff/Industrix-Todo/backend/internal/repository"
	"github.com/naufallariff/Industrix-Todo/backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	todoRepo := repository.NewTodoRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)

	todoService := service.NewTodoService(todoRepo)
	categoryService := service.NewCategoryService(categoryRepo)

	todoHandler := handler.NewTodoHandler(todoService)
	categoryHandler := handler.NewCategoryHandler(categoryService)

	v1 := r.Group("/api/v1")
	{
		todos := v1.Group("/todos")
		todos.GET("/", todoHandler.GetTodos)
		todos.POST("/", todoHandler.CreateTodo)
		todos.GET("/:id", todoHandler.GetTodoByID)
		todos.PUT("/:id", todoHandler.UpdateTodo)
		todos.PATCH("/:id/complete", todoHandler.ToggleCompleted)
		todos.DELETE("/:id", todoHandler.DeleteTodo)

		categories := v1.Group("/categories")
		categories.GET("/", categoryHandler.GetAllCategories)
		categories.POST("/", categoryHandler.CreateCategory)
		categories.GET("/:id", categoryHandler.GetCategoryByID)
		categories.PUT("/:id", categoryHandler.UpdateCategory)
		categories.DELETE("/:id", categoryHandler.DeleteCategory)
	}
}
