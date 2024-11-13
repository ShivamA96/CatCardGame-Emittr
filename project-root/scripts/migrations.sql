-- migrations.sql

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the score column for faster retrieval of top scores
CREATE INDEX idx_leaderboard_score ON leaderboard (score);