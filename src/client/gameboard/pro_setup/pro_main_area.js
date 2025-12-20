import { useState, useEffect, useCallback } from 'react';
import Player from "../logic/gameLogic";
import RoundButton from '../RoundButton';
import GameEndButton from '../../components/EndGame.tsx';
import GlitchyTouchButton from '../../components/StyledTouchButton.tsx'; 

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

export default function Pro_main_area() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);

  useEffect(() => {
    loadUsersFromCache();
    
    const currentUser = localStorage.getItem("userProfile");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setGameState(prev => ({ ...prev, selectedPlayer1: user.id }));
    }
  }, []);

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
  };

  const resetGame = () => {
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

  if (!gameState.gameStarted) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Select Players</h2>
        
        {gameState.users.length === 0 && (
          <p style={{ color: 'orange', marginBottom: '20px' }}>
            No users available. Please visit home page to load users.
          </p>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Player 1:
            <select
              value={gameState.selectedPlayer1 || ""}
              onChange={(e) => setGameState(prev => ({ ...prev, selectedPlayer1: Number(e.target.value) }))}
              style={{
                display: 'block',
                width: '200px',
                margin: '8px auto',
                padding: '8px',
                fontSize: '16px'
              }}
            >
              <option value="">-- Select Player 1 --</option>
              {gameState.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Player 2:
            <select
              value={gameState.selectedPlayer2 || ""}
              onChange={(e) => setGameState(prev => ({ ...prev, selectedPlayer2: Number(e.target.value) }))}
              style={{
                display: 'block',
                width: '200px',
                margin: '8px auto',
                padding: '8px',
                fontSize: '16px'
              }}
            >
              <option value="">-- Select Player 2 --</option>
              {gameState.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={startGame}
          disabled={gameState.users.length === 0}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            background: gameState.users.length === 0 ? '#ccc' : '#007bff',
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
    <div>
      {/* ... head-bar ... */}
            {!gameEnded && player1 && player2 && (
        <div id='GameButtons' style={{display: 'flex', zIndex: 20,  justifyContent: 'center', marigin: '10px'}}>
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
      <section id="game-area"        
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
         
        }}>
        {/* Player 1 Side - Full Height Touchable Area */}
        <div id="player_one_side"
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '0px',
            alignItems: 'center',
            width: '100%', // Ensure it spans the full width
            height: '95vh',
            margin: 'auto',// Set a fixed height or use '100vh' if needed
          }}>
          {/* For player_one */}
          <h3 id='player_one_name' style={{margin: '10px', fontFamily: 'DigitTech16', fontSize: '24px', textTransform: 'uppercase'}}>{player1.name}</h3>

          {/* Large Touchable Area for Player 1 - Round Points as children */}
          <GlitchyTouchButton
            onPlusTap={() => throwBagPlayer1("on")}
            onMinusTap={() => throwBagPlayer1("subtractOn")}
            bagIn="on"
            bagOn="in"
            isMinusButton={false}
            containerStyle={{
              width: '100%', // Fill the available width
              height: '83vh',
            }}
          >
            {player1.roundPoints} {/* Pass the round points number as children */}
          </GlitchyTouchButton>
        </div>

        {/* Central Score Area - Straddles both sides */}
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
            backgroundColor: 'rgba(94, 94, 94, 1)',
            borderRadius: '12px',
          }}
        >
          {/* Total Points */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '8px',
              
            }}
          >
            <h2 id='total_score_left'
              style={{
                fontSize: '122px',
                fontWeight: 'normal',
                fontFamily: 'DigitTech16',
                margin: '0 5px',
              }}
            >
              {player1.totalPoints}
            </h2>
            <h2 id='total_score_right'
              style={{
                fontSize: '122px',
                fontWeight: 'normal',
                fontFamily: 'DigitTech16',
                margin: '0 5px',
              }}
            >
              {player2.totalPoints}
            </h2>
          </div>
        </div>

        {/* Player 2 Side - Full Height Touchable Area */}
        <div id='player_two_side'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%', // Ensure it spans the full width
            height: '95vh',
            marigin: 'auto' // Set a fixed height or use '100vh' if needed
          }}>
          <h3 id='player_two_name' style={{margin: '10px', fontFamily: 'DigitTech16', textTransform: 'uppercase', fontSize: '24px'}}>{player2.name}</h3>

          {/* Large Touchable Area for Player 2 - Round Points as children */}
          <GlitchyTouchButton
            onPlusTap={() => throwBagPlayer2("on")}
            onMinusTap={() => throwBagPlayer2("subtractOn")}
            bagIn="on"
            bagOn="in"
            isMinusButton={false}
            containerStyle={{
              width: '100%', // Fill the available width
              height: '83vh', // Set the height for the touchable area
            }}
          >
            {player2.roundPoints} {/* Pass the round points number as children */}
          </GlitchyTouchButton>
        </div>
      </section>
      

    </div>
  );
}