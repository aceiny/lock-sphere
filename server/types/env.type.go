package types

import (
	"time"
)

type AppConfig struct {
	// General App Configuration
	Environment string
	Port        string
	Debug       bool
	FrontendURL string
	BackendURL  string

	// Security & Authentication
	JWTConfig struct {
		Secret            string
		Expiration        time.Duration
		RefreshSecret     string
		RefreshExpiration time.Duration
	}
	HashSalt int

	// Database Configuration
	Database struct {
		Driver   string
		Host     string
		Port     string
		User     string
		Password string
		Name     string
		SSLMode  string
	}

	// Cookie Configuration
	Cookie struct {
		Name       string
		Domain     string
		Secure     bool
		HTTPOnly   bool
		Expiration time.Duration
	}

	// Redis Configuration
	Redis struct {
		Host     string
		Port     string
		Password string
	}

	// Email Service Configuration
	SMTP struct {
		Host      string
		Port      string
		User      string
		Password  string
		FromEmail string
	}

	// Cloud Storage
	Cloudinary struct {
		CloudName string
		APIKey    string
		APISecret string
	}

	// Default Values
	Defaults struct {
		ProfilePicture string
	}

	// Third-Party Services
	Google struct {
		ClientID     string
		ClientSecret string
		RedirectURL  string
	}
}
