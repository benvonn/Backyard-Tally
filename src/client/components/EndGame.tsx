import React from 'react';

interface Player {
  name: string;
  totalPoints: number;
  roundPoints: number;
  getStats?: (round: number) => any;
}

interface EndGameProps {
  player1: Player;
  player2: Player;
  currentRound: number;
  selectedBoard: string;
  roundHistory: any[];
  onGameEnd: () => void;
}

export default function EndGameButton({ 
  player1, 
  player2, 
  currentRound, 
  selectedBoard,
  roundHistory,
  onGameEnd 
}: EndGameProps) {
    
  const handleGameEnd = async () => {
    const URL = 'https://localhost:7157';
    
    try {
      const gameData = {
        player1Name: player1.name,
        player2Name: player2.name,
        player1Score: player1.totalPoints,
        player2Score: player2.totalPoints,
        boardType: selectedBoard,
        totalRounds: roundHistory.length,
        rounds: roundHistory
      };
      
      console.log("Saving game to database:", gameData);

      const res = await fetch(`${URL}/api/stats/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      console.log("Game saved successfully to database");
      
      // Also save to localStorage for offline access
      const localGameData = {
        date: new Date().toISOString(),
        totalRounds: currentRound,
        board: selectedBoard,
        winner: player1.totalPoints > player2.totalPoints ? player1.name : 
                player2.totalPoints > player1.totalPoints ? player2.name : "Tie",
        player1: { name: player1.name, score: player1.totalPoints },
        player2: { name: player2.name, score: player2.totalPoints }
      };
      
      const existingGames = JSON.parse(localStorage.getItem("gameHistory") || "[]");
      existingGames.push(localGameData);
      localStorage.setItem("gameHistory", JSON.stringify(existingGames));
      
      // Notify parent component
      if (onGameEnd) {
        onGameEnd();
      }
      
      const winner = localGameData.winner;
      alert(`Game Over! ${winner === "Tie" ? "It's a tie!" : `${winner} wins!`}\n${player1.name}: ${player1.totalPoints} - ${player2.name}: ${player2.totalPoints}`);
      
    } catch (err) {
      console.error("Failed to save game:", err);
      alert("Failed to save game to database");
    }
  };

  return (
    <button 
      onClick={handleGameEnd}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '10px'
      }}
    >
      End Game
    </button>
  );
}