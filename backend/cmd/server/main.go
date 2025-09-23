package main

import (
	"log"

	"github.com/naufallariff/Industrix-Todo/backend/config"
	"github.com/naufallariff/Industrix-Todo/backend/internal/api/router"

	"github.com/gin-contrib/cors" // Import paket CORS
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

	log.Println("Database connection successful.")

	// 3. Setup Gin router
	r := gin.Default()

	// 4. Tambahkan middleware CORS di sini
	r.Use(cors.Default())

	// 5. Setup routes and inject dependencies
	router.SetupRoutes(r, db)

	// 6. Run the server on port 4000
	if err := r.Run(":4000"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
