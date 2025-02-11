package main

import (
	"log"
	"server/bootstrap"
	"server/config"
	"github.com/gin-gonic/gin"
)

func main() {
	
	appConfig , err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load configuration:", err)
	}

	config.ConnectDB(appConfig)
	config.ConnectRedis(appConfig)
	server := bootstrap.CreateServer(appConfig)
    server.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Welcome to lock sphere api , please use the correct endpoint"})
    })

	// Start Gin server
	serverAddr := ":" + appConfig.Port
	log.Printf("Server starting on %s", serverAddr)
	log.Fatal(server.Run(serverAddr))

}
