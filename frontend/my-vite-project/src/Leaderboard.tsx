// Leaderboard.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../@/components/ui/card";
import { gameService } from "./gameservice";
import { LeaderboardEntry } from "./types";

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await gameService.getLeaderboard(10);
        if (data && data.scores) {
          setScores(data.scores);
        } else {
          setScores([]); // Provide a default value if data.scores is null or undefined
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setScores([]); // Provide a default value in case of an error
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-2">
            {scores.map((entry, index) => (
              <div
                key={`${entry.username}-${index}`}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-medium">
                  {index + 1}. {entry.username}
                </span>
                <span className="text-blue-600 font-bold">{entry.score}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
