// GameCard.tsx
import * as React from "react";
import { Cat, Bomb, Shield, Shuffle } from "lucide-react";
import { motion } from "framer-motion";
import { CardType } from "./types";

interface GameCardProps {
  cardType: CardType;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({ cardType, className = "" }) => {
  const getCardIcon = () => {
    switch (cardType) {
      case "Cat":
        return <Cat className="h-12 w-12 text-orange-500" />;
      case "Exploding Kitten":
        return <Bomb className="h-12 w-12 text-red-500" />;
      case "Defuse":
        return <Shield className="h-12 w-12 text-blue-500" />;
      case "Shuffle":
        return <Shuffle className="h-12 w-12 text-purple-500" />;
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {getCardIcon()}
      <span className="mt-2 font-medium text-center">{cardType}</span>
    </motion.div>
  );
};

export default GameCard;
