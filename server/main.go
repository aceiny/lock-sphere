package main

import (
	"my-gin-app/config"     // Load environment variables
	"my-gin-app/database"   // Database connection
	"my-gin-app/routes"     // API routes
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	// Load .env file
	config.LoadEnv()

	// Connect to PostgreSQL
	database.ConnectDB()

	// Initialize Gin router
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r)

	// Start server
	port := "8080"
	log.Printf("🚀 Server running on http://localhost:%s", port)
	r.Run(":" + port)
}
