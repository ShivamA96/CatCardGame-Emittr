// CardDeck.tsx
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardType } from "./types";
import GameCard from "./GameCard";

interface CardDeckProps {
  cardsRemaining: number;
  isDrawing: boolean;
  lastDrawnCard: CardType | null;
  gameOver: boolean;
  isWinner: boolean;
}

const CardDeck: React.FC<CardDeckProps> = ({
  cardsRemaining,
  isDrawing,
  lastDrawnCard,
  gameOver,
  isWinner,
}) => {
  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      {/* Deck of remaining cards */}
      <div className="relative">
        {[...Array(Math.min(5, cardsRemaining))].map((_, index) => (
          <motion.div
            key={`deck-card-${index}`}
            className="absolute bg-white rounded-lg shadow-lg w-32 h-48 border-2 border-gray-200"
            initial={false}
            animate={{
              x: index * 2,
              y: -index * 2,
              rotateZ: index * 2,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🎴</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drawing animation */}
      <AnimatePresence>
        {isDrawing && (
          <motion.div
            className="absolute"
            initial={{ x: 0, y: 0, rotateY: 0, scale: 1 }}
            animate={{ x: 200, y: -50, rotateY: 180, scale: 1.2 }}
            exit={{ x: 400, y: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-32 h-48 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center">
              <span className="text-4xl">🎴</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last drawn card */}
      <AnimatePresence>
        {lastDrawnCard && !isDrawing && (
          <motion.div
            className="absolute right-0"
            initial={{ x: 200, y: -50, scale: 1.2, opacity: 0 }}
            animate={{ x: 200, y: -50, scale: 1, opacity: 1 }}
            exit={{ x: 400, y: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameCard cardType={lastDrawnCard} className="w-32 h-48" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`text-4xl font-bold ${
                isWinner ? "text-green-500" : "text-red-500"
              }`}
            >
              {isWinner ? "🎉 YOU WIN! 🎉" : "💥 GAME OVER 💥"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardDeck;
