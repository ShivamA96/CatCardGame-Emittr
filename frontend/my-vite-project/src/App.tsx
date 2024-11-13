import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../@/components/ui/alert";
import { Button } from "../@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import { Input } from "../@/components/ui/input";
import { gameService } from "./gameservice";
import { GameState } from "./types";
import GameCard from "./GameCard";
import Leaderboard from "./Leaderboard";
import CardDeck from "./CardDeck";
import StatsDisplay from "./StatsDisplay";

const ExplodingKittensGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    username: "",
    defuseCount: 0,
    gameOver: false,
    message: "Enter your username to start!",
    isWinner: false,
    isStarted: false,
    cardsRemaining: 5,
    gamesWon: 0,
    lastDrawnCard: null,
    isDrawing: false,
  });

  useEffect(() => {
    const storedGamesWon = localStorage.getItem(
      `gamesWon_${gameState.username}`
    );
    if (storedGamesWon && gameState.username) {
      setGameState((prev) => ({
        ...prev,
        gamesWon: parseInt(storedGamesWon, 10),
      }));
    }
  }, [gameState.username]);

  const startGame = async () => {
    if (!gameState.username) {
      setGameState((prev) => ({
        ...prev,
        message: "Please enter a username first!",
      }));
      return;
    }

    try {
      const { game_id } = await gameService.startGame(gameState.username);
      setGameState((prev) => ({
        ...prev,
        gameId: game_id,
        isStarted: true,
        message: "Game started! Draw a card to begin.",
        gameOver: false,
        defuseCount: 0,
        cardsRemaining: 5,
        lastDrawnCard: null,
        isDrawing: false,
      }));
    } catch (error) {
      console.log("Failed to start game:", error);
      setGameState((prev) => ({
        ...prev,
        message: "Failed to start game. Please try again.",
      }));
    }
  };

  const drawCard = async () => {
    if (!gameState.gameId || gameState.isDrawing) return;

    setGameState((prev) => ({ ...prev, isDrawing: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Animation delay
      const { card } = await gameService.drawCard(gameState.gameId);

      let newMessage = "";
      let isGameOver = false;
      let isWinner = false;
      let newDefuseCount = gameState.defuseCount;
      let newGamesWon = gameState.gamesWon;

      switch (card) {
        case "Cat":
          newMessage = "You drew a Cat card! Safe for now.";
          break;
        case "Exploding Kitten":
          if (newDefuseCount > 0) {
            newDefuseCount--;
            newMessage = "You used a Defuse card to survive!";
          } else {
            isGameOver = true;
            newMessage = "BOOM! Game Over!";
            await gameService.submitScore(
              gameState.username,
              gameState.defuseCount
            );
          }
          break;
        case "Defuse":
          newDefuseCount++;
          newMessage = "You got a Defuse card!";
          break;
        case "Shuffle":
          newMessage = "Deck shuffled!";
          break;
      }

      // Check if player won (drew all cards without exploding)
      if (gameState.cardsRemaining <= 1 && !isGameOver) {
        isGameOver = true;
        isWinner = true;
        newMessage = "Congratulations! You won!";
        newGamesWon++;
        localStorage.setItem(
          `gamesWon_${gameState.username}`,
          newGamesWon.toString()
        );
        await gameService.submitScore(gameState.username, newGamesWon * 100);
      }

      setGameState((prev) => ({
        ...prev,
        defuseCount: newDefuseCount,
        message: newMessage,
        gameOver: isGameOver,
        isWinner,
        cardsRemaining: prev.cardsRemaining - 1,
        lastDrawnCard: card,
        isDrawing: false,
        gamesWon: newGamesWon,
      }));
    } catch (err) {
      console.log("Failed to draw card:", err);
      setGameState((prev) => ({
        ...prev,
        message: "Failed to draw card. Please try again.",
        isDrawing: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Exploding Kittens Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!gameState.isStarted ? (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={gameState.username}
                    onChange={(e) =>
                      setGameState((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                  <Button
                    onClick={startGame}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Start Game
                  </Button>
                </div>
              ) : (
                <>
                  <Alert
                    className={
                      gameState.gameOver ? "bg-red-100" : "bg-blue-100"
                    }
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Game Status</AlertTitle>
                    <AlertDescription>{gameState.message}</AlertDescription>
                  </Alert>

                  <StatsDisplay
                    username={gameState.username}
                    defuseCount={gameState.defuseCount}
                    gamesWon={gameState.gamesWon}
                    cardsRemaining={gameState.cardsRemaining}
                  />

                  <div className="flex justify-center items-center space-x-4">
                    <CardDeck
                      cardsRemaining={gameState.cardsRemaining}
                      isDrawing={gameState.isDrawing}
                      lastDrawnCard={gameState.lastDrawnCard}
                      gameOver={gameState.gameOver}
                      isWinner={gameState.isWinner}
                    />

                    {gameState.lastDrawnCard && (
                      <GameCard cardType={gameState.lastDrawnCard} />
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={drawCard}
                      disabled={gameState.gameOver || gameState.isDrawing}
                      className="w-48 bg-green-500 hover:bg-green-600 text-white"
                    >
                      {gameState.isDrawing ? "Drawing..." : "Draw Card"}
                    </Button>
                  </div>

                  {gameState.gameOver && (
                    <Button
                      onClick={startGame}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Play Again
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default ExplodingKittensGame;
