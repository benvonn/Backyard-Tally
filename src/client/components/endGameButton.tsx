import React from 'react';
import styled from '@emotion/styled';
import { saveCompleteGame, getTempRoundData } from '../utils/gameStorage';

interface Player {
  id: number | string;
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

const StyledButton = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-family: VT323;
  font-size: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #0f0;
    color: #000;
    border-color: #0f0;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid #1aff00;
    outline-offset: 2px;
  }
`;

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

    const roundHistory = getTempRoundData();

    const gameData = {
      date: new Date().toISOString(),
      totalRounds: currentRound,
      board: selectedBoard,
      winner: player1.totalPoints > player2.totalPoints ? player1.name : 
              player2.totalPoints > player1.totalPoints ? player2.name : "Tie",
      player1: { id: player1.id, name: player1.name, score: player1.totalPoints },
      player2: { id: player2.id, name: player2.name, score: player2.totalPoints },
      rounds: roundHistory
    };

    saveCompleteGame(gameData);

    if (onGameEnd) onGameEnd();
  };

  if (!player1 || !player2) return null;

  return (
    <StyledButton onClick={handleGameEnd}>
      End Game
    </StyledButton>
  );
}