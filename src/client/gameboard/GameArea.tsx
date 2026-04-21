// components/game/GameArea.tsx
import RoundButton from './RoundButton.tsx';
import GameEndButton from './../components/EndGame.tsx';
import GlitchyTouchButton from './../components/StyledTouchButton.tsx';
import ScoreBoard from './ScoreBoard.tsx';
import Player from './logic/gameLogic.tsx';

interface Props {
  player1: Player;
  player2: Player;
  currentRound: number;
  roundHistory: number[];
  gameEnded: boolean;
  onThrowP1: (type: string) => void;
  onThrowP2: (type: string) => void;
  onEndRound: (p1: Player, p2: Player) => void;
  onGameEnd: () => void;
}

export default function GameArea({ player1, player2, currentRound, roundHistory, gameEnded, onThrowP1, onThrowP2, onEndRound, onGameEnd }: Props) {
  return (
    <div style={{ fontFamily: 'VT323' }}>
      {!gameEnded && (
        <div id="GameButtons" style={{ display: 'flex', zIndex: 20, justifyContent: 'center', paddingTop: '35px' }}>
          <RoundButton player1={player1} player2={player2} currentRound={currentRound} onEndRound={onEndRound} />
          <GameEndButton player1={player1} player2={player2} currentRound={currentRound} selectedBoard="pro" roundHistory={roundHistory} onGameEnd={onGameEnd} />
        </div>
      )}

      <section style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '95vh', width: '90vw', margin: 'auto', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '95vh', margin: 'auto' }}>
          <h3 style={{ margin: '10px', fontSize: '24px', textTransform: 'uppercase' }}>{player1?.name}</h3>
          <GlitchyTouchButton onPlusTap={() => onThrowP1('on')} onMinusTap={() => onThrowP1('subtractOn')} isMinusButton={false} containerStyle={{ width: '100%', height: '83vh' }} bagIn={undefined} bagOn={undefined}>
            {player1?.roundPoints}
          </GlitchyTouchButton>
        </div>

        <ScoreBoard player1={player1} player2={player2} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '95vh', margin: 'auto' }}>
          <h3 style={{ margin: '10px', fontSize: '24px', textTransform: 'uppercase' }}>{player2?.name}</h3>
          <GlitchyTouchButton onPlusTap={() => onThrowP2('on')} onMinusTap={() => onThrowP2('subtractOn')} isMinusButton={false} containerStyle={{ width: '100%', height: '83vh' }} bagIn={undefined} bagOn={undefined}>
            {player2?.roundPoints}
          </GlitchyTouchButton>
        </div>
      </section>
    </div>
  );
}