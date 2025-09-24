package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/naufallariff/Industrix-Todo/backend/internal/domain"
	"github.com/naufallariff/Industrix-Todo/backend/internal/service"
	"github.com/naufallariff/Industrix-Todo/backend/internal/util"
)

type TodoHandler struct {
	service service.TodoService
}

func NewTodoHandler(s service.TodoService) *TodoHandler {
	return &TodoHandler{service: s}
}

func (h *TodoHandler) GetTodos(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	search := c.DefaultQuery("search", "")
	status := c.DefaultQuery("status", "")
	categoryID := c.DefaultQuery("category_id", "")
	priority := c.DefaultQuery("priority", "")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	todos, total, err := h.service.GetTodos(page, limit, search, status, categoryID, priority)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve todos"})
		return
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)
	pagination := gin.H{
		"page":  page,
		"limit": limit,
		"total": total,
		"pages": totalPages,
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       todos,
		"pagination": pagination,
	})
}

func (h *TodoHandler) GetTodoByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid todo ID"})
		return
	}

	todo, err := h.service.GetTodoByID(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			util.ErrorResponse(c, http.StatusNotFound, "Todo not found")
			return
		}
		util.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve todo")
		return
	}
	c.JSON(http.StatusOK, todo)
}

func (h *TodoHandler) CreateTodo(c *gin.Context) {
	var req domain.NewTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo, err := h.service.CreateTodo(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create todo"})
		return
	}
	c.JSON(http.StatusCreated, todo)
}

func (h *TodoHandler) UpdateTodo(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid todo ID"})
		return
	}

	var req domain.UpdateTodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo, err := h.service.UpdateTodo(id, req)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update todo"})
		return
	}
	c.JSON(http.StatusOK, todo)
}

func (h *TodoHandler) ToggleCompleted(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid todo ID"})
		return
	}

	todo, err := h.service.ToggleCompleted(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to toggle todo status"})
		return
	}
	c.JSON(http.StatusOK, todo)
}

func (h *TodoHandler) DeleteTodo(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid todo ID"})
		return
	}

	if err := h.service.DeleteTodo(id); err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "todo not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete todo"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
