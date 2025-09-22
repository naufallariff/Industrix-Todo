package main

import (
	"log"

	"github.com/naufallariff/Industrix-Todo/backend/config"
	"github.com/naufallariff/Industrix-Todo/backend/internal/api/router"
	// "github.com/naufallariff/Industrix-Todo/backend/internal/domain"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 2. Connect to database
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// NOTE: db.AutoMigrate should be handled by separate migration scripts in a production environment.
	// For local development, uncomment this block if you want GORM to create the tables.

	// if err := db.AutoMigrate(&domain.Category{}, &domain.Todo{}); err != nil {
	// 	log.Fatalf("Failed to run migrations: %v", err)
	// }

	log.Println("Database connection successful.")

	// 3. Setup Gin router
	r := gin.Default()

	// 4. Setup routes and inject dependencies
	router.SetupRoutes(r, db)

	// 5. Run the server on port 4000
	if err := r.Run(":4000"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
