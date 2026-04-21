import Player from './logic/gameLogic.tsx'

interface Props {
  player1: Player;
  player2: Player;
}

export default function ScoreBoard({ player1, player2 }: Props) {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
      <h2 style={{ fontSize: '122px', color: '#00ff00' }}>{player1?.totalPoints}</h2>
      <h2 style={{ fontSize: '122px', color: '#00ff00' }}>{player2?.totalPoints}</h2>
    </div>
  );
}