// LeaderboardPage.tsx
import React from "react";
import Leaderboard from "./Leaderboard";

const LeaderboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Leaderboard />
      </div>
    </div>
  );
};

export default LeaderboardPage;
