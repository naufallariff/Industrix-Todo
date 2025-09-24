package service

import (
	"github.com/google/uuid"
	"github.com/naufallariff/Industrix-Todo/backend/internal/domain"
	"github.com/naufallariff/Industrix-Todo/backend/internal/repository"
)

type CategoryService interface {
	FindAllCategories() ([]domain.Category, error)
	FindCategoryByID(id uuid.UUID) (*domain.Category, error)
	CreateCategory(req domain.NewCategoryRequest) (*domain.Category, error)
	UpdateCategory(id uuid.UUID, req domain.NewCategoryRequest) (*domain.Category, error)
	DeleteCategory(id uuid.UUID) error
}

type categoryService struct {
	repo repository.CategoryRepository
}

func NewCategoryService(repo repository.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) FindAllCategories() ([]domain.Category, error) {
	return s.repo.FindAll()
}

func (s *categoryService) FindCategoryByID(id uuid.UUID) (*domain.Category, error) {
	return s.repo.FindByID(id)
}

func (s *categoryService) CreateCategory(req domain.NewCategoryRequest) (*domain.Category, error) {
	category := &domain.Category{
		Name:  req.Name,
		Color: req.Color,
	}
	if err := s.repo.Create(category); err != nil {
		return nil, err
	}
	return category, nil
}

func (s *categoryService) UpdateCategory(id uuid.UUID, req domain.NewCategoryRequest) (*domain.Category, error) {
	category, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	category.Name = req.Name
	category.Color = req.Color

	if err := s.repo.Update(category); err != nil {
		return nil, err
	}
	return category, nil
}

func (s *categoryService) DeleteCategory(id uuid.UUID) error {
	return s.repo.Delete(id)
}
