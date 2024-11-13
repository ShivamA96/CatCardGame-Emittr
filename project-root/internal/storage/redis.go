package storage

import (
	"context"
	"encoding/json"
	"log"
	"project-root/config"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

type RedisClient struct {
    Client *redis.Client
}

func NewRedisClient(cfg config.RedisConfig) *RedisClient {
    rdb := redis.NewClient(&redis.Options{
        Addr: cfg.Addr,
    })
    _, err := rdb.Ping(ctx).Result()
    if err != nil {
        log.Fatalf("Failed to connect to Redis: %v", err)
    }
    return &RedisClient{Client: rdb}
}

func (r *RedisClient) SaveGame(gameID string, data interface{}) error {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return err
    }
    return r.Client.Set(ctx, gameID, jsonData, 0).Err()
}

func (r *RedisClient) LoadGame(gameID string, data interface{}) error {
    jsonData, err := r.Client.Get(ctx, gameID).Result()
    if err != nil {
        return err
    }
    return json.Unmarshal([]byte(jsonData), data)
}