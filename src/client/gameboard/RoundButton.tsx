import React from 'react';
import styled from '@emotion/styled';
import { saveRoundData } from '../utils/gameStorage';
import Player from './logic/gameLogic';

interface RoundButtonProps {
  player1: InstanceType<typeof Player>;
  player2: InstanceType<typeof Player>;
  currentRound: number;
  onEndRound: (updatedPlayer1: InstanceType<typeof Player>, updatedPlayer2: InstanceType<typeof Player>) => void;
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

export default function RoundButton({ player1, player2, currentRound, onEndRound }: RoundButtonProps) {
  const handleEndRound = () => {
     console.log("P1 bags on:", player1.roundBagsOn, "bags in:", player1.roundBagsIn);
    console.log("P2 bags on:", player2.roundBagsOn, "bags in:", player2.roundBagsIn);
    
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
    
    const difference = Math.abs(player1.roundPoints - player2.roundPoints);
    let player1Net = 0;
    let player2Net = 0;
    
    if (player1.roundPoints > player2.roundPoints) {
      player1Net = difference;
    } else if (player2.roundPoints > player1.roundPoints) {
      player2Net = difference;
    }
    
    updatedPlayer1.totalPoints += player1Net;
    updatedPlayer1.roundScores.push(player1Net);
    
    updatedPlayer2.totalPoints += player2Net;
    updatedPlayer2.roundScores.push(player2Net);
    
    updatedPlayer1.roundPoints = 0;
    updatedPlayer1.bags = 4;
    updatedPlayer1.roundBagsIn = 0;
    updatedPlayer1.roundBagsOn = 0;
    updatedPlayer2.roundPoints = 0;
    updatedPlayer2.bags = 4;
    updatedPlayer2.roundBagsIn = 0;
    updatedPlayer2.roundBagsOn = 0;
    
    if (onEndRound) {
      onEndRound(updatedPlayer1, updatedPlayer2);
    }
  };

  return (
    <StyledButton onClick={handleEndRound}>
      End Round
    </StyledButton>
  );
}