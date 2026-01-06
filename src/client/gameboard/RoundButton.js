// components/RoundButton.jsx
import React from 'react';
import { saveRoundData } from '../utils/gameStorage';
import Player from './logic/gameLogic.js';

export default function RoundButton({ player1, player2, currentRound, onEndRound }) {
  const handleEndRound = () => {
    console.log("P1 bags on:", player1.roundBagsOn, "bags in:", player1.roundBagsIn);  // Updated log for round
    console.log("P2 bags on:", player2.roundBagsOn, "bags in:", player2.roundBagsIn);  // Updated log for round
    
    // Save round data to localStorage BEFORE any calculations (raw round points + bags)
    const roundData = {
      roundNumber: currentRound,
      player1RoundScore: player1.roundPoints,
      player2RoundScore: player2.roundPoints,
      player1TotalBefore: player1.totalPoints,
      player2TotalBefore: player2.totalPoints,
      player1RoundBagsIn: player1.roundBagsIn || 0,
      player1RoundBagsOn: player1.roundBagsOn || 0,
      player2RoundBagsIn: player2.roundBagsIn || 0,
      player2RoundBagsOn: player2.roundBagsOn || 0,
      timestamp: new Date().toISOString()
    };
    
    saveRoundData(roundData);
    
    // Create updated players as class instances
    const updatedPlayer1 = new Player(player1.id, player1.name);
    updatedPlayer1.totalPoints = player1.totalPoints;
    updatedPlayer1.roundScores = [...player1.roundScores];
    updatedPlayer1.totalBagsIn = player1.totalBagsIn;
    updatedPlayer1.totalBagsOn = player1.totalBagsOn;
    updatedPlayer1.roundBagsIn = player1.roundBagsIn || 0;
    updatedPlayer1.roundBagsOn = player1.roundBagsOn || 0;

    const updatedPlayer2 = new Player(player2.id, player2.name);
    updatedPlayer2.totalPoints = player2.totalPoints;
    updatedPlayer2.roundScores = [...player2.roundScores];
    updatedPlayer2.totalBagsIn = player2.totalBagsIn;
    updatedPlayer2.totalBagsOn = player2.totalBagsOn;
    updatedPlayer2.roundBagsIn = player2.roundBagsIn || 0;
    updatedPlayer2.roundBagsOn = player2.roundBagsOn || 0;
    
    // Cornhole cancellation scoring logic
    const difference = Math.abs(player1.roundPoints - player2.roundPoints);
    let player1Net = 0;
    let player2Net = 0;
    
    if (player1.roundPoints > player2.roundPoints) {
      player1Net = difference;
    } else if (player2.roundPoints > player1.roundPoints) {
      player2Net = difference;
    }
    // If tie, both nets remain 0
    
    updatedPlayer1.totalPoints += player1Net;
    updatedPlayer1.roundScores.push(player1Net);
    
    updatedPlayer2.totalPoints += player2Net;
    updatedPlayer2.roundScores.push(player2Net);
    
    // Reset for next round
    updatedPlayer1.roundPoints = 0;
    updatedPlayer1.bags = 4;
    updatedPlayer1.roundBagsIn = 0;  // New reset
    updatedPlayer1.roundBagsOn = 0;  // New reset
    updatedPlayer2.roundPoints = 0;
    updatedPlayer2.bags = 4;
    updatedPlayer2.roundBagsIn = 0;  // New reset
    updatedPlayer2.roundBagsOn = 0;  // New reset
    
    // Notify parent with updated players
    if (onEndRound) {
      onEndRound(updatedPlayer1, updatedPlayer2);
    }
  };

  return (
    <button 
      onClick={handleEndRound}
      style={{
        padding: '12px 20px',
        fontSize: '16px',
        background: '#00ff00ff', // Same green as EndGame
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '10px' // Same margin as EndGame
      }}
    >
      End Round
    </button>
  );
}