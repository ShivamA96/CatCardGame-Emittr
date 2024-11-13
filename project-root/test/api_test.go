package test

import (
	"net/http"
	"net/http/httptest"
	"project-root/config"
	"project-root/internal/server"
	"testing"
)

// cfg := config.LoadConfig()


func TestStartGame(t *testing.T) {
    router := server.NewServer(config.LoadConfig())
    req, _ := http.NewRequest("POST", "/start", nil)
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    if w.Code != http.StatusOK {
        t.Errorf("Expected 200, got %d", w.Code)
    }
}
