import { useState, useEffect, useCallback } from 'react';
import Player from "./logic/gameLogic.tsx";

interface GameState {
  users: { id: number; name: string }[];
  selectedPlayer1: number | null;
  selectedPlayer2: number | null;
  player1: Player | null;
  player2: Player | null;
  roundHistory: number[];
  gameEnded: boolean;
  gameStarted: boolean;
  currentRound: number;
}

const INITIAL_GAME_STATE: GameState = {
  users: [],
  selectedPlayer1: null,
  selectedPlayer2: null,
  player1: null,
  player2: null,
  roundHistory: [],
  gameEnded: false,
  gameStarted: false,
  currentRound: 1,
};

const GAME_STORAGE_KEY = 'currentGameState';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  useEffect(() => {
    const savedGame = localStorage.getItem(GAME_STORAGE_KEY);
    if (savedGame) {
      const parsed = JSON.parse(savedGame);
      setGameState({
        ...parsed,
        player1: parsed.player1 ? Player.fromJSON(parsed.player1) : null,
        player2: parsed.player2 ? Player.fromJSON(parsed.player2) : null,
      });
    } else {
      const cachedUsers = localStorage.getItem("allUsers");
      if (cachedUsers) {
        setGameState(prev => ({ ...prev, users: JSON.parse(cachedUsers) }));
      }
      const currentUser = localStorage.getItem("userProfile");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setGameState(prev => ({ ...prev, selectedPlayer1: user.id }));
      }
    }
  }, []);

  useEffect(() => {
    if (!gameState.gameStarted) return;
    const serializableState = {
      ...gameState,
      player1: gameState.player1 ? gameState.player1.toJSON() : null,
      player2: gameState.player2 ? gameState.player2.toJSON() : null,
    };
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(serializableState));
  }, [gameState]);

  const startGame = () => {
    const { selectedPlayer1, selectedPlayer2, users } = gameState;
    if (!selectedPlayer1 || !selectedPlayer2) return alert("Please select both players!");
    if (selectedPlayer1 === selectedPlayer2) return alert("Please select different players!");

    const user1 = users.find(u => u.id === selectedPlayer1);
    const user2 = users.find(u => u.id === selectedPlayer2);
    if (!user1 || !user2) return alert("Selected users not found!");

    setGameState(prev => ({
      ...prev,
      player1: new Player(user1.id, user1.name),
      player2: new Player(user2.id, user2.name),
      gameStarted: true,
      gameEnded: false,
      roundHistory: [],
      currentRound: 1,
    }));
  };

  const resetGame = () => {
    localStorage.removeItem(GAME_STORAGE_KEY);
    setGameState(INITIAL_GAME_STATE);
  };

  const handleGameEnd = () => {
    setGameState(prev => ({ ...prev, gameEnded: true }));
    localStorage.removeItem(GAME_STORAGE_KEY);
  };

  const handleEndRound = (updatedPlayer1: Player, updatedPlayer2: Player) => {
    setGameState(prev => ({
      ...prev,
      player1: updatedPlayer1,
      player2: updatedPlayer2,
      currentRound: prev.currentRound + 1,
    }));
  };

  const throwBagPlayer1 = useCallback((type: string) => {
    if (gameState.gameEnded) return alert("Game is over! Click 'New Game' to start again.");
    setGameState(prev => {
      const p = prev.player1;
      if (!p) return prev;
      const updated = Object.assign(new Player(p.id, p.name), { ...p, roundScores: [...p.roundScores] });
      return updated.throw(type) ? { ...prev, player1: updated } : prev;
    });
  }, [gameState.gameEnded]);

  const throwBagPlayer2 = useCallback((type: string) => {
    if (gameState.gameEnded) return alert("Game is over! Click 'New Game' to start again.");
    setGameState(prev => {
      const p = prev.player2;
      if (!p) return prev;
      const updated = Object.assign(new Player(p.id, p.name), { ...p, roundScores: [...p.roundScores] });
      return updated.throw(type) ? { ...prev, player2: updated } : prev;
    });
  }, [gameState.gameEnded]);

  return {
    gameState,
    setGameState,
    startGame,
    resetGame,
    handleGameEnd,
    handleEndRound,
    throwBagPlayer1,
    throwBagPlayer2,
  };
}