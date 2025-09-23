package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/naufallariff/Industrix-Todo/backend/internal/domain"
	"github.com/naufallariff/Industrix-Todo/backend/internal/service"
	"github.com/naufallariff/Industrix-Todo/backend/internal/util"
)

type CategoryHandler struct {
	service service.CategoryService
}

func NewCategoryHandler(s service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: s}
}

func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
	categories, err := h.service.FindAllCategories()
	if err != nil {
		util.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve categories", err.Error())
		return
	}
	c.JSON(http.StatusOK, categories)
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req domain.NewCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	category, err := h.service.CreateCategory(req)
	if err != nil {
		util.ErrorResponse(c, http.StatusInternalServerError, "Failed to create category", err.Error())
		return
	}
	c.JSON(http.StatusCreated, category)
}

func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		util.ErrorResponse(c, http.StatusBadRequest, "Invalid category ID", err.Error())
		return
	}

	var req domain.NewCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		util.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	category, err := h.service.UpdateCategory(uint(id), req)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			util.ErrorResponse(c, http.StatusNotFound, "Category not found")
			return
		}
		util.ErrorResponse(c, http.StatusInternalServerError, "Failed to update category", err.Error())
		return
	}
	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		util.ErrorResponse(c, http.StatusBadRequest, "Invalid category ID", err.Error())
		return
	}

	if err := h.service.DeleteCategory(uint(id)); err != nil {
		if err == gorm.ErrRecordNotFound {
			util.ErrorResponse(c, http.StatusNotFound, "Category not found")
			return
		}
		util.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete category", err.Error())
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

func (h *CategoryHandler) GetCategoryByID(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 64)
    if err != nil {
        util.ErrorResponse(c, http.StatusBadRequest, "Invalid category ID", err.Error())
        return
    }

    category, err := h.service.FindCategoryByID(uint(id))
    if err != nil {
        if err == gorm.ErrRecordNotFound {
            util.ErrorResponse(c, http.StatusNotFound, "Category not found")
            return
        }
        util.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve category", err.Error())
        return
    }
    c.JSON(http.StatusOK, category)
}