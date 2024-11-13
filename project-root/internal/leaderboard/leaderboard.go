package leaderboard

import (
	"context"
	"log"

	"github.com/jackc/pgx/v4"
)

type Leaderboard struct {
    conn *pgx.Conn
}

func NewLeaderboard(connString string) *Leaderboard {
    conn, err := pgx.Connect(context.Background(), connString)
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
    }
    return &Leaderboard{conn: conn}
}

func (lb *Leaderboard) AddScore(username string, score int) error {
    _, err := lb.conn.Exec(context.Background(), "INSERT INTO leaderboard (username, score) VALUES ($1, $2)", username, score)
    return err
}

func (lb *Leaderboard) GetTopScores(limit int) ([]map[string]interface{}, error) {
    rows, err := lb.conn.Query(context.Background(), "SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT $1", limit)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var scores []map[string]interface{}
    for rows.Next() {
        var username string
        var score int
        err := rows.Scan(&username, &score)
        if err != nil {
            return nil, err
        }
        scores = append(scores, map[string]interface{}{"username": username, "score": score})
    }
    return scores, nil
}