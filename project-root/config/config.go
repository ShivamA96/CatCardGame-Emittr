package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
    Redis   RedisConfig
    Server  ServerConfig
    Postgres PostgresConfig
}

type RedisConfig struct {
    Addr string
}

type ServerConfig struct {
    Port string
}

type PostgresConfig struct {
    ConnString string
}

func LoadConfig() Config {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    return Config{
        Redis: RedisConfig{
            Addr: os.Getenv("REDIS_ADDR"),
        },
        Server: ServerConfig{
            Port: os.Getenv("SERVER_PORT"),
        },
        Postgres: PostgresConfig{
            ConnString: os.Getenv("POSTGRES_CONN_STRING"),
        },
    }
}