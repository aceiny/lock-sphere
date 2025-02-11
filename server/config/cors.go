package config

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupCORS(allowedDomains []string, domain string) gin.HandlerFunc {
    corsConfig := cors.DefaultConfig()

    corsConfig.AllowOrigins = append(allowedDomains, domain)

    corsConfig.AllowCredentials = true
    corsConfig.AddAllowHeaders("Authorization", "Content-Type")
	log.Println("Cors has been configured")
    return cors.New(corsConfig)
}
