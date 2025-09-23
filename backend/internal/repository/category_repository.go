package repository

import (
	"github.com/naufallariff/Industrix-Todo/backend/internal/domain"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	FindAll() ([]domain.Category, error)
	FindByID(id uint) (*domain.Category, error)
	Create(category *domain.Category) error
	Update(category *domain.Category) error
	Delete(id uint) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) FindAll() ([]domain.Category, error) {
	var categories []domain.Category
	if err := r.db.Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *categoryRepository) FindByID(id uint) (*domain.Category, error) {
	var category domain.Category
	if err := r.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) Update(category *domain.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Category{}, id).Error
}
