export type CardType = "Cat" | "Exploding Kitten" | "Defuse" | "Shuffle";

export interface GameState {
  gameId: string | null;
  username: string;
  defuseCount: number;
  gameOver: boolean;
  message: string;
  isWinner: boolean;
  isStarted: boolean;
  cardsRemaining: number;
  gamesWon: number;
  lastDrawnCard: CardType | null;
  isDrawing: boolean;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
}
