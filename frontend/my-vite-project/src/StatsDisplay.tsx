import * as React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { gameService } from "./gameservice";
import GameCard from "./GameCard";
import { CardType } from "./types";

interface StatsDisplayProps {
  username: string;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ username }) => {
  const [defuseCount, setDefuseCount] = React.useState(0);
  const [gamesWon, setGamesWon] = React.useState(0);
  const [cardsRemaining, setCardsRemaining] = React.useState(5);
  const [currentCard, setCurrentCard] = React.useState<CardType | null>(null);
  const [gameId, setGameId] = React.useState<string | null>(null);
  const [gameOver, setGameOver] = React.useState(false);

  const startGame = async () => {
    try {
      const { game_id } = await gameService.startGame(username);
      setGameId(game_id);
      setDefuseCount(0);
      setCardsRemaining(5);
      setCurrentCard(null);
      setGameOver(false);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const drawCard = async () => {
    if (!gameId) return;

    try {
      const { card } = await gameService.drawCard(gameId);
      setCurrentCard(card);

      switch (card) {
        case "Cat":
          setCardsRemaining((prev) => prev - 1);
          break;
        case "Exploding Kitten":
          if (defuseCount > 0) {
            setDefuseCount((prev) => prev - 1);
          } else {
            setGameOver(true);
          }
          break;
        case "Defuse":
          setDefuseCount((prev) => prev + 1);
          setCardsRemaining((prev) => prev - 1);
          break;
        case "Shuffle":
          await startGame();
          break;
      }

      if (cardsRemaining === 1 && card !== "Shuffle") {
        setGamesWon((prev) => prev + 1);
        setGameOver(true);
      }
    } catch (error) {
      console.error("Failed to draw card:", error);
      setGameOver(true);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <motion.div
        className="p-4 bg-white rounded-lg shadow text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="font-semibold text-gray-600">Player</h3>
        <p className="text-lg font-bold text-blue-600">{username}</p>
      </motion.div>

      <motion.div
        className="p-4 bg-white rounded-lg shadow text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="font-semibold text-gray-600">Defuse Cards</h3>
        <p className="text-2xl font-bold text-green-600">{defuseCount}</p>
      </motion.div>

      <motion.div
        className="p-4 bg-white rounded-lg shadow text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="font-semibold text-gray-600">Games Won</h3>
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <p className="text-2xl font-bold text-yellow-600">{gamesWon}</p>
        </div>
      </motion.div>

      <motion.div
        className="p-4 bg-white rounded-lg shadow text-center"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="font-semibold text-gray-600">Cards Left</h3>
        <p className="text-2xl font-bold text-purple-600">{cardsRemaining}</p>
      </motion.div>

      <div className="col-span-2 sm:col-span-4 flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          onClick={startGame}
          disabled={gameId !== null && !gameOver}
        >
          Start Game
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow ml-4"
          onClick={drawCard}
          disabled={gameOver || cardsRemaining === 0}
        >
          Draw Card
        </button>
      </div>

      {currentCard && (
        <div className="col-span-2 sm:col-span-4 flex justify-center mt-4">
          <GameCard cardType={currentCard} />
        </div>
      )}

      {gameOver && (
        <div className="col-span-2 sm:col-span-4 flex justify-center mt-4">
          <p className="text-xl font-bold text-red-600">Game Over</p>
        </div>
      )}
    </div>
  );
};

export default StatsDisplay;
