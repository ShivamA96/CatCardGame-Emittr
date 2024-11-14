import { CardType } from "./types";

const BASE_URL = "http://localhost:8080"; // Use the exposed backend URL

export const gameService = {
  startGame: async (username: string): Promise<{ game_id: string }> => {
    const response = await fetch(
      `${BASE_URL}/start?username=${encodeURIComponent(username)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to start game");
    return response.json();
  },

  drawCard: async (gameId: string): Promise<{ card: CardType }> => {
    const response = await fetch(`${BASE_URL}/draw?game_id=${gameId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  },

  submitScore: async (username: string, score: number): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}/leaderboard?username=${encodeURIComponent(
        username
      )}&score=${score}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to submit score");
  },

  getLeaderboard: async (
    limit: number = 10
  ): Promise<{ scores: Array<{ username: string; score: number }> }> => {
    const response = await fetch(`${BASE_URL}/leaderboard?limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    return response.json();
  },
};
