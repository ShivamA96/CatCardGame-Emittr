package server

import (
	"net/http"
	"project-root/config"
	"project-root/internal/game"
	"project-root/internal/leaderboard"
	"project-root/internal/storage"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Server struct {
    router      *gin.Engine
    redisClient *storage.RedisClient
    leaderboard *leaderboard.Leaderboard
}

func NewServer(cfg config.Config) *Server {
    redisClient := storage.NewRedisClient(cfg.Redis)
    server := &Server{
        router:      gin.Default(),
        redisClient: redisClient,
    }
    server.router = server.setupRouter()
    return server
}

func (s *Server) SetLeaderboard(lb *leaderboard.Leaderboard) {
    s.leaderboard = lb
}

func (s *Server) Run() error {
    return s.router.Run()
}

func (s *Server) setupRouter() *gin.Engine {
    r := gin.Default()

    // Configure CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, // Update with your frontend URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
        AllowCredentials: true,
    }))

    r.POST("/start", func(c *gin.Context) {
        // Generate a unique game ID
        gameID := uuid.New().String()
        username := c.Query("username")
        g := game.NewGame(gameID, username)
        // Save game to Redis here
        s.redisClient.SaveGame(gameID, g)
        c.JSON(http.StatusOK, gin.H{"game_id": gameID})
    })

    r.POST("/draw", func(c *gin.Context) {
        gameID := c.Query("game_id")
        var g game.Game
        // Load game from Redis here
        err := s.redisClient.LoadGame(gameID, &g)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load game"})
            return
        }
        card, err := g.DrawCard()
        
        println(card);

        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        s.redisClient.SaveGame(gameID, g)
        c.JSON(http.StatusOK, gin.H{"card": card})
    })

    r.POST("/leaderboard", func(c *gin.Context) {
        username := c.Query("username")
        scoreStr := c.Query("score")
        score, err := strconv.Atoi(scoreStr)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score"})
            return
        }
        // Save score to leaderboard
        err = s.leaderboard.AddScore(username, score)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"status": "score added"})
    })

    r.GET("/leaderboard", func(c *gin.Context) {
        limitStr := c.Query("limit")
        limit, err := strconv.Atoi(limitStr)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
            return
        }
        // Get top scores from leaderboard
        scores, err := s.leaderboard.GetTopScores(limit)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"scores": scores})
    })

    return r
}

// ServeHTTP delegates to the router's ServeHTTP method
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    s.router.ServeHTTP(w, r)
}