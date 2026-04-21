import Player from './logic/gameLogic';

interface Props {
  player1: Player;
  player2: Player;
  onReset: () => void;
  onHome: () => void;
}

export default function GameOverOverlay({ player1, player2, onReset, onHome }: Props) {
  const winner =
    player1.totalPoints > player2.totalPoints ? `${player1.name} wins!`
    : player2.totalPoints > player1.totalPoints ? `${player2.name} wins!`
    : "It's a tie!";

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1000, fontFamily: 'VT323', color: '#00ff00', border: '2px solid #00ff00' }}>
      <h2 style={{ fontSize: '36px', marginBottom: '20px', textTransform: 'uppercase' }}>Game Over!</h2>
      <p style={{ fontSize: '22px', marginBottom: '30px' }}>{winner}</p>
      <button onClick={onReset} style={{ padding: '14px 36px', fontSize: '22px', background: '#00ff00', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'VT323', textTransform: 'uppercase', marginBottom: '20px' }}>
        New Game
      </button>
      <button onClick={onHome} style={{ padding: '14px 36px', fontSize: '22px', background: '#00ff00', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'VT323', textTransform: 'uppercase' }}>
        Home
      </button>
    </div>
  );
}