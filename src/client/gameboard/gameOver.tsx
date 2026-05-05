import React from 'react';
import styled from '@emotion/styled';
import Player from './logic/gameLogic';

interface Props {
  player1: Player;
  player2: Player;
  onReset: () => void;
  onHome: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: VT323;
  color: #0f0;
  border: 2.5px solid #0f0;
`;

const Title = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const Winner = styled.p`
  font-size: 22px;
  margin-bottom: 30px;
`;

const StyledButton = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-family: VT323;
  font-size: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin: 10px;
  width: 30%;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: #0f0;
    color: #000;
    border-color: #000;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid #1aff00;
    outline-offset: 2px;
  }
`;

export default function GameOverOverlay({ player1, player2, onReset, onHome }: Props) {
  const winner =
    player1.totalPoints > player2.totalPoints ? `${player1.name} wins!`
    : player2.totalPoints > player1.totalPoints ? `${player2.name} wins!`
    : "It's a tie!";

  return (
    <Overlay>
      <Title>Game Over!</Title>
      <Winner>{winner}</Winner>
      <StyledButton onClick={onReset}>New Game</StyledButton>
      <StyledButton onClick={onHome}>Home</StyledButton>
    </Overlay>
  );
}