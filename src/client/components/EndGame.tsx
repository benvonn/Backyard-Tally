import React from 'react';
import { saveCompleteGame, getTempRoundData } from '../utils/gameStorage';

interface Player {
  id: number;
  name: string;
  totalPoints: number;
  roundPoints: number;
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
  onGameEnd 
}: EndGameProps) {
    
  const handleGameEnd = () => {
    if (!player1 || !player2) {
      alert("Error: Players not initialized");
      return;
    }

    // Get all round data that was saved during the game
    const roundHistory = getTempRoundData();
    
    const gameData = {
      date: new Date().toISOString(),
      totalRounds: currentRound,
      board: selectedBoard,
      winner: player1.totalPoints > player2.totalPoints ? player1.name : 
              player2.totalPoints > player1.totalPoints ? player2.name : "Tie",
      player1: { 
        id: player1.id,
        name: player1.name, 
        score: player1.totalPoints 
      },
      player2: { 
        id: player2.id,
        name: player2.name, 
        score: player2.totalPoints 
      },
      rounds: roundHistory
    };
    
    // Save complete game
    saveCompleteGame(gameData);
    console.log("Game saved to localStorage:", gameData);
    
    
    const winner = gameData.winner;
    alert(`Game Over! ${winner === "Tie" ? "It's a tie!" : `${winner} wins!`}\n${player1.name}: ${player1.totalPoints} - ${player2.name}: ${player2.totalPoints}`);
    
    // Notify parent
    if (onGameEnd) {
      onGameEnd();
    }
  };

  if (!player1 || !player2) {
    return null;
  }

  return (
    <button 
      onClick={handleGameEnd}
      style={{
        padding: '12px 20px',
        fontSize: '16px',
        background: '#00ff00ff',
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