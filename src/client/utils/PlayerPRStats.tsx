import React, { useEffect, useState } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface Round {
  roundNumber: number;
  player1RoundScore: number;
  player2RoundScore: number;
  player1TotalBefore: number;
  player2TotalBefore: number;
  player1RoundBagsIn?: number;
  player1RoundBagsOn?: number;
  player2RoundBagsIn?: number;
  player2RoundBagsOn?: number;
  timestamp: string;
}

interface GameDataItem {
  date: string;
  totalRounds: number;
  board: string;
  winner: string;
  player1: Player;
  player2: Player;
  rounds: Round[];
}

interface PlayerStats {
  name: string;
  ppr: number; // Points Per Round
  dpr: number; // Bags In Per Round (DPR = "Disc Per Round" or "Discs Per Round")
}

export default function PlayerPRStats() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get current user from localStorage
      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        setError("No user profile found in localStorage");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userProfile);
      const currentUserName = user.name;

      // Get game history from localStorage
      const gameHistory = localStorage.getItem("gameHistory");
      if (!gameHistory) {
        setError("No game history found in localStorage");
        setLoading(false);
        return;
      }

      const games: GameDataItem[] = JSON.parse(gameHistory);

      // Filter games where the current user participated
      const userGames = games.filter(
        game => game.player1.name === currentUserName || game.player2.name === currentUserName
      );

      if (userGames.length === 0) {
        setError("No games found for the current user");
        setLoading(false);
        return;
      }

      // Calculate stats
      let totalPoints = 0;
      let totalBagsIn = 0;
      let totalRounds = 0;

      userGames.forEach(game => {
        // Determine if user is player1 or player2
        const isPlayer1 = game.player1.name === currentUserName;
        const userPlayer = isPlayer1 ? game.player1 : game.player2;
        const opponentPlayer = isPlayer1 ? game.player2 : game.player1;

        // Add total points
        totalPoints += userPlayer.score;

        // Process rounds to count bags in
        game.rounds.forEach(round => {
          // Calculate round points for the user
          const userRoundPoints = isPlayer1 
            ? round.player1RoundScore 
            : round.player2RoundScore;
          
          // Calculate round points for the opponent (for cancellation scoring)
          const opponentRoundPoints = isPlayer1 
            ? round.player2RoundScore 
            : round.player1RoundScore;

          // In cancellation scoring, points are net difference
          const netRoundPoints = userRoundPoints > opponentRoundPoints 
            ? userRoundPoints - opponentRoundPoints 
            : 0;
          
          totalPoints += netRoundPoints;
        });

        // Count bags in from rounds data if available
        game.rounds.forEach(round => {
          const userBagsIn = isPlayer1 
            ? round.player1RoundBagsIn || 0 
            : round.player2RoundBagsIn || 0;
          totalBagsIn += userBagsIn;
        });

        // Add total rounds
        totalRounds += game.totalRounds;
      });

      // Calculate PPR (Points Per Round) and DPR (Discs Per Round)
      const ppr = totalRounds > 0 ? totalPoints / totalRounds : 0;
      const dpr = totalRounds > 0 ? totalBagsIn / totalRounds : 0;

      setStats({
        name: currentUserName,
        ppr: parseFloat(ppr.toFixed(2)),
        dpr: parseFloat(dpr.toFixed(2))
      });
    } catch (err) {
      setError("Error calculating stats: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats available</div>;

  return (
    <div>
      <h2>Player Performance Stats</h2>
      <p>
        User: {stats.name} PPR: {stats.ppr} DPR: {stats.dpr}
      </p>
    </div>
  );
}