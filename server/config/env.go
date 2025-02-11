package config

import (
	"server/types"
	"log"
	"server/lib"
	"time"
	"github.com/joho/godotenv"
)

	func LoadConfig() (*types.AppConfig, error) {
		err := godotenv.Load("./.env")
		if err != nil {
			log.Println("Warning: No .env file found, using default environment variables.")
		}

		config := &types.AppConfig{}

		// General App Configuration
		config.Environment = getEnvOrFatal("APP_ENV", "string").(string)
		config.Port = getEnvOrFatal("APP_PORT", "string").(string)
		config.Debug = getEnvOrFatal("APP_DEBUG", "bool").(bool)
		config.FrontendURL = getEnvOrFatal("FRONTEND_URL", "string").(string)
		config.BackendURL = getEnvOrFatal("BACKEND_URL", "string").(string)

		// Security & Authentication
		config.JWTConfig.Secret = getEnvOrFatal("JWT_SECRET", "string").(string)
		config.JWTConfig.Expiration = getEnvOrFatal("JWT_EXPIRATION", "duration").(time.Duration)
		config.JWTConfig.RefreshSecret = getEnvOrFatal("JWT_REFRESH_SECRET", "string").(string)
		config.JWTConfig.RefreshExpiration = getEnvOrFatal("JWT_REFRESH_EXPIRATION", "duration").(time.Duration)
		config.HashSalt = getEnvOrFatal("HASH_SALT", "int").(int)

		// Database Configuration
		config.Database.Driver = getEnvOrFatal("DB_DRIVER", "string").(string)
		config.Database.Host = getEnvOrFatal("DB_HOST", "string").(string)
		config.Database.Port = getEnvOrFatal("DB_PORT", "string").(string)
		config.Database.User = getEnvOrFatal("DB_USER", "string").(string)
		config.Database.Password = getEnvOrFatal("DB_PASSWORD", "string").(string)
		config.Database.Name = getEnvOrFatal("DB_NAME", "string").(string)
		config.Database.SSLMode = getEnvOrFatal("DB_SSL_MODE", "string").(string)

		// Cookie Configuration
		config.Cookie.Name = getEnvOrFatal("COOKIE_NAME", "string").(string)
		config.Cookie.Domain = getEnvOrFatal("COOKIE_DOMAIN", "string").(string)
		config.Cookie.Secure = getEnvOrFatal("COOKIE_SECURE", "bool").(bool)
		config.Cookie.HTTPOnly = getEnvOrFatal("COOKIE_HTTPONLY", "bool").(bool)
		config.Cookie.Expiration = getEnvOrFatal("COOKIE_EXPIRATION", "duration").(time.Duration)

		// Redis Configuration
		config.Redis.Host = getEnvOrFatal("REDIS_HOST", "string").(string)
		config.Redis.Port = getEnvOrFatal("REDIS_PORT", "string").(string)
		config.Redis.Password = getEnvOrFatal("REDIS_PASSWORD", "string").(string)

		// Email Service Configuration
		config.SMTP.Host = getEnvOrFatal("SMTP_HOST", "string").(string)
		config.SMTP.Port = getEnvOrFatal("SMTP_PORT", "string").(string)
		config.SMTP.User = getEnvOrFatal("SMTP_USER", "string").(string)
		config.SMTP.Password = getEnvOrFatal("SMTP_PASSWORD", "string").(string)
		config.SMTP.FromEmail = getEnvOrFatal("EMAIL_FROM", "string").(string)

		// Cloud Storage
		config.Cloudinary.CloudName = getEnvOrFatal("CLOUDINARY_CLOUD_NAME", "string").(string)
		config.Cloudinary.APIKey = getEnvOrFatal("CLOUDINARY_API_KEY", "string").(string)
		config.Cloudinary.APISecret = getEnvOrFatal("CLOUDINARY_API_SECRET", "string").(string)

		// Default Values
		config.Defaults.ProfilePicture = getEnvOrFatal("DEFAULT_PROFILE_PICTURE", "string").(string)

		// Third-Party Services
		config.Google.ClientID = getEnvOrFatal("GOOGLE_CLIENT_ID", "string").(string)
		config.Google.ClientSecret = getEnvOrFatal("GOOGLE_CLIENT_SECRET", "string").(string)
		config.Google.RedirectURL = getEnvOrFatal("GOOGLE_REDIRECT_URL", "string").(string)

		return config, nil
	}

	func getEnvOrFatal(key, expectedType string) interface{} {
		val, err := lib.GetEnv(key, expectedType)
		if err != nil {
			log.Fatalf("Failed to get environment variable %s: %v", key, err)
		}
		return val
	}