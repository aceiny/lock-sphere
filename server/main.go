package main

import (
	"log"
	"os"
	"server/config"

	"github.com/gin-gonic/gin"
)

func main() {
	
	config.LoadEnv()
	config.ConnectDB()
    r := gin.Default()

    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Hello, Gin!"})
    })

	// Start Gin server
	port := os.Getenv("APP_PORT")
	log.Printf("Server running on url: %s", os.Getenv("BACKEND_URL"))
	r.Run(":" + port)

}
