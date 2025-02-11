package interfaces

import (
	"server/pkg"
	"time"
)

type RedisRepository interface {
	StoreOTP(email, otp string, expiry time.Duration) error
	GetOTP(email string) (string, error)
	InvalidateOTP(email string) error
	StoreResetToken(email, token string, expiry time.Duration) error
	GetResetToken(email string) (string, error)
	InvalidateResetToken(email string) error
	StoreRefreshToken(UserID, refreshToken string, expiry time.Duration) error
	GetRefreshToken(UserID string) (string, error)
	InvalidateRefreshToken(UserID string) error
	StoreAssetCache(assetID string, assetType string, data *pkg.AssetCache, expiry time.Duration) error
	GetAssetCache(assetID string, assetType string) (*pkg.AssetCache, error)
	InvalidateAssetCache(assetID string, assetType string) error
}