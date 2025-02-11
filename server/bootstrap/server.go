package bootstrap

import (
	"server/config"
	"server/types"
	"server/middleware"
	"github.com/gin-gonic/gin"
)
func CreateServer(appConfig *types.AppConfig) *gin.Engine {
	server := gin.Default()

	// Cors setup
	server.Use(config.SetupCORS([]string{appConfig.FrontendURL , "http://localhost:3000"}, appConfig.BackendURL))

	// Global middelwares
	server.Use(gin.Recovery())
	server.Use(gin.Logger())
	server.Use(middlewares.ErrorHandlingMiddleware())
	server.Use(middlewares.LoggingMiddleware())
	server.Use(middlewares.RateLimiter(20, 10))
	server.MaxMultipartMemory = 8 << 20 // 8 MiB
	return server
} 