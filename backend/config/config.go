package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configurations.
type Config struct {
	DatabaseURL string
}

// LoadConfig loads configuration from .env file.
func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		return nil, fmt.Errorf("failed to load .env file: %w", err)
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("DATABASE_URL not found in .env file")
	}

	return &Config{
		DatabaseURL: dbURL,
	}, nil
}
