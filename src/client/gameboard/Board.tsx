import { useGameState } from './logic/gameState';
import PlayerSelect from './playerSelect';
import GameArea from './gameArea';
import GameOverOverlay from './gameOver';
import { useNavigate } from "react-router-dom";

export default function Board() {
  const { gameState, startGame, resetGame, handleGameEnd, handleEndRound, throwBagPlayer1, throwBagPlayer2, setGameState } = useGameState();
  const { player1, player2, gameEnded, gameStarted, currentRound, roundHistory, users, selectedPlayer1, selectedPlayer2 } = gameState;
  const navigate = useNavigate();

  if (!gameStarted) return (
    <PlayerSelect
      users={users}
      selectedPlayer1={selectedPlayer1}
      selectedPlayer2={selectedPlayer2}
      onSelectP1={(id) => setGameState(prev => ({ ...prev, selectedPlayer1: id }))}
      onSelectP2={(id) => setGameState(prev => ({ ...prev, selectedPlayer2: id }))}
      onStart={startGame}
    />
  );

  if (!player1 || !player2) return null;

  return (
    <div style={{ fontFamily: 'VT323' }}>
      <GameArea
        player1={player1} player2={player2}
        currentRound={currentRound} roundHistory={roundHistory}
        gameEnded={gameEnded}
        onThrowP1={throwBagPlayer1} onThrowP2={throwBagPlayer2}
        onEndRound={handleEndRound} onGameEnd={handleGameEnd}
      />
      {gameEnded && (
        <GameOverOverlay player1={player1} player2={player2} onReset={resetGame} onHome={() => navigate('/home')} />
      )}
    </div>
  );
}