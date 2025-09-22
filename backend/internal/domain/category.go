package domain

import "gorm.io/gorm"

// Category represents the 'categories' table in the database.
type Category struct {
	gorm.Model
	Name  string `gorm:"type:varchar(255);not null;uniqueIndex" json:"name"`
	Color string `gorm:"type:varchar(7);not null" json:"color"`
}
