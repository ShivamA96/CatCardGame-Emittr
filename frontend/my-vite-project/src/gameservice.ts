// gameService.ts
import { CardType } from "./types";

const API_BASE_URL = "http://host.docker.internal:8080";

export const gameService = {
  startGame: async (username: string): Promise<{ game_id: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/start?username=${encodeURIComponent(username)}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) throw new Error("Failed to start game");
    return response.json();
  },

  drawCard: async (gameId: string): Promise<{ card: CardType }> => {
    const response = await fetch(`${API_BASE_URL}/draw?game_id=${gameId}`, {
      method: "POST",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  },

  submitScore: async (username: string, score: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/leaderboard?username=${encodeURIComponent(
        username
      )}&score=${score}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) throw new Error("Failed to submit score");
  },

  getLeaderboard: async (
    limit: number = 10
  ): Promise<{ scores: Array<{ username: string; score: number }> }> => {
    const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    return response.json();
  },
};
