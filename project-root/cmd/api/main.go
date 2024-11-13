package main

import (
	"log"
	"project-root/config"
	"project-root/internal/leaderboard"
	"project-root/internal/server"
)

func main() {
    cfg := config.LoadConfig()
    srv := server.NewServer(cfg)
    lb := leaderboard.NewLeaderboard(cfg.Postgres.ConnString)
    srv.SetLeaderboard(lb)
    log.Println("Starting server on port:", cfg.Server.Port)
    if err := srv.Run(); err != nil {
        log.Fatalf("Server failed to start: %v", err)
    }
}