package config

import (
	"log"
	"context"
	"server/types"
	"github.com/go-redis/redis/v8"
)


type RedisConfig struct {
	Client *redis.Client
}

func ConnectRedis(config *types.AppConfig) *RedisConfig {

    client := redis.NewClient(&redis.Options{
        Addr:     config.Redis.Host + ":" + config.Redis.Port,
        //Password: config.Redis.Password, // password not configured in dev 
        DB:       0,
    })

	ctx := context.Background()

	if err := client.Ping(ctx).Err(); err != nil {
		log.Fatalf("Error while connecting to Redis: %v", err)
	}

	log.Println("Connected to Redis successfully")

	return &RedisConfig{
		Client: client,
	}
}