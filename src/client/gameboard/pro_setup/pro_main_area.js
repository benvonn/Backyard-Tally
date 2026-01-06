import { useState, useEffect, useCallback, useRef } from 'react';
import Player from "../logic/gameLogic";
import RoundButton from '../RoundButton';
import GameEndButton from '../../components/EndGame.tsx';
import GlitchyTouchButton from '../../components/StyledTouchButton.tsx'; 
import { useNavigate } from 'react-router-dom';

// Define the initial game state
const INITIAL_GAME_STATE = {
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

export default function Pro_main_area() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [showPlayer1Dropdown, setShowPlayer1Dropdown] = useState(false);
  const [showPlayer2Dropdown, setShowPlayer2Dropdown] = useState(false);
  const navigate = useNavigate();
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

  // Load saved game state on mount
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
      loadUsersFromCache();
      
      const currentUser = localStorage.getItem("userProfile");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setGameState(prev => ({ ...prev, selectedPlayer1: user.id }));
      }
    }
  }, []);

  // Save game state whenever it changes (after initial load)
  useEffect(() => {
    if (gameState.gameStarted) {
      const serializableState = {
        ...gameState,
        player1: gameState.player1 ? gameState.player1.toJSON() : null,
        player2: gameState.player2 ? gameState.player2.toJSON() : null,
      };
      localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(serializableState));
    }
  }, [gameState]);

  const loadUsersFromCache = () => {
    const cachedUsers = localStorage.getItem("allUsers");
    if (cachedUsers) {
      const parsedUsers = JSON.parse(cachedUsers);
      setGameState(prev => ({ ...prev, users: parsedUsers }));
    }
  };

  const startGame = () => {
    if (!gameState.selectedPlayer1 || !gameState.selectedPlayer2) {
      alert("Please select both players!");
      return;
    }

    if (gameState.selectedPlayer1 === gameState.selectedPlayer2) {
      alert("Please select different players!");
      return;
    }

    console.log('Selected ID1:', gameState.selectedPlayer1, 'ID2:', gameState.selectedPlayer2, 'Users:', gameState.users);

    const user1 = gameState.users.find(u => u.id == gameState.selectedPlayer1);
    const user2 = gameState.users.find(u => u.id == gameState.selectedPlayer2);

    if (!user1 || !user2) {
      alert("Selected users not found! Check console for details.");
      console.error('User1 found:', user1, 'User2 found:', user2);
      return;
    }
    console.log('user1.id type:', typeof user1.id, 'value:', user1.id);

    if (typeof user1.id !== 'number' || typeof user2.id !== 'number') {
      console.error('User IDs must be numbers!', { user1, user2 });
      alert('Invalid user data. Please check your user storage.');
      return;
    }

    setGameState(prev => ({
      ...prev,
      player1: new Player(Number(user1.id), user1.name),
      player2: new Player(Number(user2.id), user2.name),
      gameStarted: true,
      gameEnded: false,
      roundHistory: [],
      currentRound: 1,
    }));
  };

  const handleGameEnd = () => {
    setGameState(prev => ({ ...prev, gameEnded: true }));
    localStorage.removeItem(GAME_STORAGE_KEY); // Clear saved state on game end
  };

  const resetGame = () => {
    localStorage.removeItem(GAME_STORAGE_KEY);
    setGameState(INITIAL_GAME_STATE);
  };
  
  // Use useCallback to memoize the functions to prevent unnecessary re-renders
  const throwBagPlayer1 = useCallback((type) => {
    if (gameState.gameEnded) {
      alert("Game is over! Click 'New Game' to start again.");
      return;
    }
    
    setGameState(prevState => {
      const prevPlayer = prevState.player1;
      if (!prevPlayer) return prevState;
      
      const updatedPlayer = new Player(prevPlayer.id, prevPlayer.name);
      updatedPlayer.roundPoints = prevPlayer.roundPoints;
      updatedPlayer.totalPoints = prevPlayer.totalPoints;
      updatedPlayer.bags = prevPlayer.bags;
      updatedPlayer.roundScores = [...prevPlayer.roundScores];
      updatedPlayer.totalBagsIn = prevPlayer.totalBagsIn;
      updatedPlayer.totalBagsOn = prevPlayer.totalBagsOn;
      updatedPlayer.roundBagsIn = prevPlayer.roundBagsIn || 0;  // New copy
      updatedPlayer.roundBagsOn = prevPlayer.roundBagsOn || 0;  // New copy
      
      const success = updatedPlayer.throw(type);
      return success 
        ? { ...prevState, player1: updatedPlayer } 
        : prevState;
    });
  }, [gameState.gameEnded]); // Dependency is gameEnded state

  // Repeat the same for throwBagPlayer2
  const throwBagPlayer2 = useCallback((type) => {
    if (gameState.gameEnded) {
      alert("Game is over! Click 'New Game' to start again.");
      return;
    }
    
    setGameState(prevState => {
      const prevPlayer = prevState.player2;
      if (!prevPlayer) return prevState;
      
      const updatedPlayer = new Player(prevPlayer.id, prevPlayer.name);
      updatedPlayer.roundPoints = prevPlayer.roundPoints;
      updatedPlayer.totalPoints = prevPlayer.totalPoints;
      updatedPlayer.bags = prevPlayer.bags;
      updatedPlayer.roundScores = [...prevPlayer.roundScores];
      updatedPlayer.totalBagsIn = prevPlayer.totalBagsIn;
      updatedPlayer.totalBagsOn = prevPlayer.totalBagsOn;
      updatedPlayer.roundBagsIn = prevPlayer.roundBagsIn || 0;  // New copy
      updatedPlayer.roundBagsOn = prevPlayer.roundBagsOn || 0;  // New copy
      
      const success = updatedPlayer.throw(type);
      return success 
        ? { ...prevState, player2: updatedPlayer } 
        : prevState;
    });
  }, [gameState.gameEnded]); // Dependency is gameEnded state

  const handleEndRound = (updatedPlayer1, updatedPlayer2) => {
    setGameState(prevState => ({
      ...prevState,
      player1: updatedPlayer1,
      player2: updatedPlayer2,
      currentRound: prevState.currentRound + 1,
    }));
  };

  useEffect(() => {
    const handleClickOutsidePlayer1 = (event) => {
      if (player1Ref.current && !player1Ref.current.contains(event.target)) {
        setShowPlayer1Dropdown(false);
      }
    };

    if (showPlayer1Dropdown) {
      document.addEventListener("click", handleClickOutsidePlayer1);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsidePlayer1);
    };
  }, [showPlayer1Dropdown]);

  useEffect(() => {
    const handleClickOutsidePlayer2 = (event) => {
      if (player2Ref.current && !player2Ref.current.contains(event.target)) {
        setShowPlayer2Dropdown(false);
      }
    };

    if (showPlayer2Dropdown) {
      document.addEventListener("click", handleClickOutsidePlayer2);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsidePlayer2);
    };
  }, [showPlayer2Dropdown]);

  if (!gameState.gameStarted) {
    const player1Name = gameState.selectedPlayer1 
      ? gameState.users.find(u => u.id === gameState.selectedPlayer1)?.name || "-- Select Player 1 --"
      : "-- Select Player 1 --";
    
    const player2Name = gameState.selectedPlayer2 
      ? gameState.users.find(u => u.id === gameState.selectedPlayer2)?.name || "-- Select Player 2 --"
      : "-- Select Player 2 --";

    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'VT323' }}>
        <h2>Select Players</h2>
        
        {gameState.users.length === 0 && (
          <p style={{ color: 'orange', marginBottom: '20px' }}>
            Please select Users
          </p>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Player 1:
            <div ref={player1Ref} style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                id="player1-dropdown-toggle"
                onClick={() => setShowPlayer1Dropdown(!showPlayer1Dropdown)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00ff00',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '16px',
                  margin: '8px auto',
                  width: '200px',
                  justifyContent: 'center'
                }}
              >
                {player1Name} ▼
              </button>
              
              {showPlayer1Dropdown && (
                <div 
                  id="player1-dropdown"
                  style={{ 
                    position: 'absolute', 
                    background: 'rgba(53, 53, 53, 1)', 
                    border: '1px solid #a4a4a4ff',
                    borderRadius: '4px',
                    padding: '8px',
                    marginTop: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    minWidth: '200px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {gameState.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setGameState(prev => ({ ...prev, selectedPlayer1: user.id }));
                        setShowPlayer1Dropdown(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 16px',
                        border: 'none',
                        background: user.id === gameState.selectedPlayer1 ? '#4f4f4f' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#6e6e6e';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = user.id === gameState.selectedPlayer1 ? '#4f4f4f' : 'transparent';
                      }}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
            </div>  
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Player 2:
            <div ref={player2Ref} style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                id="player2-dropdown-toggle"
                onClick={() => setShowPlayer2Dropdown(!showPlayer2Dropdown)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00ff00',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '16px',
                  margin: '8px auto',
                  width: '200px',
                  justifyContent: 'center'
                }}
              >
                {player2Name} ▼
              </button>
              
              {showPlayer2Dropdown && (
                <div 
                  id="player2-dropdown"
                  style={{ 
                    position: 'absolute', 
                    background: 'rgba(53, 53, 53, 1)', 
                    border: '1px solid #a4a4a4ff',
                    borderRadius: '4px',
                    padding: '8px',
                    marginTop: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    minWidth: '200px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {gameState.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setGameState(prev => ({ ...prev, selectedPlayer2: user.id }));
                        setShowPlayer2Dropdown(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 16px',
                        border: 'none',
                        background: user.id === gameState.selectedPlayer2 ? '#4f4f4f' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#6e6e6e';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = user.id === gameState.selectedPlayer2 ? '#4f4f4f' : 'transparent';
                      }}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>

        <button
          onClick={startGame}
          disabled={gameState.users.length === 0}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            background: gameState.users.length === 0 ? '#ccc' : '#00ff00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: gameState.users.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

   // Destructure the game state for cleaner access
  const { player1, player2, gameEnded, currentRound, roundHistory } = gameState;

  return (
    <div style={{ fontFamily: 'VT323' }}>
      {/* Game control buttons (only visible during active game) */}
      {!gameEnded && player1 && player2 && (
        <div
          id="GameButtons"
          style={{
            display: 'flex',
            zIndex: 20,
            justifyContent: 'center',
            margin: '0px',
            paddingTop: '35px',
          }}
        >
          <RoundButton
            player1={player1}
            player2={player2}
            currentRound={currentRound}
            onEndRound={handleEndRound}
          />
          <GameEndButton
            player1={player1}
            player2={player2}
            currentRound={currentRound}
            selectedBoard="pro"
            roundHistory={roundHistory}
            onGameEnd={handleGameEnd}
          />
        </div>
      )}

      <section
        id="game-area"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0px',
          height: '95vh',
          width: '90vw',
          margin: 'auto',
          position: 'relative',
        }}
      >
        {/* Player 1 Side */}
        <div
          id="player_one_side"
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '0px',
            alignItems: 'center',
            width: '100%',
            height: '95vh',
            margin: 'auto',
          }}
        >
          <h3
            id="player_one_name"
            style={{
              margin: '10px',
              fontFamily: 'VT323',
              fontSize: '24px',
              textTransform: 'uppercase',
            }}
          >
            {player1?.name}
          </h3>
          <GlitchyTouchButton
            onPlusTap={() => throwBagPlayer1('on')}
            onMinusTap={() => throwBagPlayer1('subtractOn')}
            bagIn="on"
            bagOn="in"
            isMinusButton={false}
            containerStyle={{
              width: '100%',
              height: '83vh',
            }}
          >
            {player1?.roundPoints}
          </GlitchyTouchButton>
        </div>

        {/* Central Score Board */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <h2
              id="total_score_left"
              style={{
                fontSize: '122px',
                fontWeight: 'normal',
                fontFamily: 'VT323',
                margin: '0 5px',
                color: '#00ff00',
              }}
            >
              {player1?.totalPoints}
            </h2>
            <h2
              id="total_score_right"
              style={{
                fontSize: '122px',
                fontWeight: 'normal',
                fontFamily: 'VT323',
                margin: '0 5px',
                color: '#00ff00',
              }}
            >
              {player2?.totalPoints}
            </h2>
          </div>
        </div>

        {/* Player 2 Side */}
        <div
          id="player_two_side"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '95vh',
            margin: 'auto',
          }}
        >
          <h3
            id="player_two_name"
            style={{
              margin: '10px',
              fontFamily: 'VT323',
              textTransform: 'uppercase',
              fontSize: '24px',
            }}
          >
            {player2?.name}
          </h3>
          <GlitchyTouchButton
            onPlusTap={() => throwBagPlayer2('on')}
            onMinusTap={() => throwBagPlayer2('subtractOn')}
            bagIn="on"
            bagOn="in"
            isMinusButton={false}
            containerStyle={{
              width: '100%',
              height: '83vh',
            }}
          >
            {player2?.roundPoints}
          </GlitchyTouchButton>
        </div>
      </section>

      {/* ✅ NEW: Game Over Overlay */}
      {gameEnded && player1 && player2 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            fontFamily: 'VT323',
            color: '#00ff00',
            border: '2px solid #00ff00',
          }}
        >
          <h2 style={{ fontSize: '36px', marginBottom: '20px', textTransform: 'uppercase' }}>
            Game Over!
          </h2>
          <p style={{ fontSize: '22px', marginBottom: '30px', textAlign: 'center' }}>
            {player1.totalPoints > player2.totalPoints
              ? `${player1.name} wins!`
              : player2.totalPoints > player1.totalPoints
              ? `${player2.name} wins!`
              : "It's a tie!"}
          </p>
          <button
            onClick={resetGame}
            style={{
              padding: '14px 36px',
              fontSize: '22px',
              background: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'VT323',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            New Game
          </button>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '14px 36px',
              fontSize: '22px',
              background: '#00ff00',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'VT323',
              textTransform: 'uppercase',
            }}
          >
            Home
          </button>
        </div>
      )}
    </div>
  );
}