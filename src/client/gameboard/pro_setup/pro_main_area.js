import { useState, useEffect } from 'react';
import Player from "../logic/gameLogic";
import RoundButton from '../RoundButton';
import GameEndButton from '../../components/EndGame.tsx';
import TouchButton from '../../components/TouchControls.jsx';

export default function Pro_main_area() {
  const [users, setUsers] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [roundHistory, setRoundHistory] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    loadUsersFromCache();
    
    const currentUser = localStorage.getItem("userProfile");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setSelectedPlayer1(user.name);
    }
  }, []);

  const loadUsersFromCache = () => {
    const cachedUsers = localStorage.getItem("allUsers");
    if (cachedUsers) {
      const parsedUsers = JSON.parse(cachedUsers);
      setUsers(parsedUsers);
    }
  };

  const startGame = () => {
    if (!selectedPlayer1 || !selectedPlayer2) {
      alert("Please select both players!");
      return;
    }

    if (selectedPlayer1 === selectedPlayer2) {
      alert("Please select different players!");
      return;
    }

    setPlayer1(new Player(selectedPlayer1));
    setPlayer2(new Player(selectedPlayer2));
    setGameStarted(true);
    setGameEnded(false);
    setRoundHistory([]);
    setCurrentRound(1);
  };

  const handleGameEnd = () => {
    setGameEnded(true);
  };

  const resetGame = () => {
    setPlayer1(null);
    setPlayer2(null);
    setSelectedPlayer1(null);
    setSelectedPlayer2(null);
    setGameStarted(false);
    setGameEnded(false);
    setRoundHistory([]);
    setCurrentRound(1);
  };
  
  const throwBagPlayer1 = (type) => {
    if (gameEnded) {
      alert("Game is over! Click 'New Game' to start again.");
      return;
    }
    
    setPlayer1(prevPlayer => {
      if (!prevPlayer) return prevPlayer;
      
      const updatedPlayer = new Player(prevPlayer.name);
      updatedPlayer.roundPoints = prevPlayer.roundPoints;
      updatedPlayer.totalPoints = prevPlayer.totalPoints;
      updatedPlayer.bags = prevPlayer.bags;
      updatedPlayer.roundScores = [...prevPlayer.roundScores];
      updatedPlayer.totalBagsIn = prevPlayer.totalBagsIn;
      updatedPlayer.totalBagsOn = prevPlayer.totalBagsOn;
      
      const success = updatedPlayer.throw(type);
      return success ? updatedPlayer : prevPlayer;
    });
  };

  const throwBagPlayer2 = (type) => {
    if (gameEnded) {
      alert("Game is over! Click 'New Game' to start again.");
      return;
    }
    
    setPlayer2(prevPlayer => {
      if (!prevPlayer) return prevPlayer;
      
      const updatedPlayer = new Player(prevPlayer.name);
      updatedPlayer.roundPoints = prevPlayer.roundPoints;
      updatedPlayer.totalPoints = prevPlayer.totalPoints;
      updatedPlayer.bags = prevPlayer.bags;
      updatedPlayer.roundScores = [...prevPlayer.roundScores];
      updatedPlayer.totalBagsIn = prevPlayer.totalBagsIn;
      updatedPlayer.totalBagsOn = prevPlayer.totalBagsOn;
      
      const success = updatedPlayer.throw(type);
      return success ? updatedPlayer : prevPlayer;
    });
  };

    const handleEndRound = (updatedPlayer1, updatedPlayer2) => {
  setPlayer1(updatedPlayer1);
  setPlayer2(updatedPlayer2);
  setCurrentRound(prev => prev + 1);
};

  if (!gameStarted) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Select Players</h2>
        
        {users.length === 0 && (
          <p style={{ color: 'orange', marginBottom: '20px' }}>
            ⚠️ No users available. Please visit home page to load users.
          </p>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Player 1:
            <select
              value={selectedPlayer1 || ""}
              onChange={(e) => setSelectedPlayer1(e.target.value)}
              style={{
                display: 'block',
                width: '200px',
                margin: '8px auto',
                padding: '8px',
                fontSize: '16px'
              }}
            >
              <option value="">-- Select Player 1 --</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
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
              value={selectedPlayer2 || ""}
              onChange={(e) => setSelectedPlayer2(e.target.value)}
              style={{
                display: 'block',
                width: '200px',
                margin: '8px auto',
                padding: '8px',
                fontSize: '16px'
              }}
            >
              <option value="">-- Select Player 2 --</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={startGame}
          disabled={users.length === 0}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            background: users.length === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: users.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div>
      <div id="head-bar">
        <button 
          onClick={resetGame}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          New Game
        </button>
        
        <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
          Round: {currentRound}
        </span>
        
        {gameEnded && (
          <span style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold' }}>
            Game Over!
          </span>
        )}
      </div>
      
      <section id="game-area">
        <div id="player_one">
          {/* For player_one */}
          <h3>{player1.name}</h3>

          <TouchButton
            onSingleTap={() => throwBagPlayer1("on")}
            onDoubleTap={() => throwBagPlayer1("in")}
            style={{ 
              padding: '15px',
              background: '#e3f2fd',
              borderRadius: '8px',
              margin: '8px 0',
              textAlign: 'center',
              fontSize: '18px'
            }}
          >
            +1 / +3
          </TouchButton>

          <h1>Round: {player1.roundPoints}</h1>
          <h2>Total: {player1.totalPoints}</h2>

          <TouchButton
            onSingleTap={() => throwBagPlayer1("subtractOn")}
            onDoubleTap={() => throwBagPlayer1("subtractIn")}
            style={{ 
              padding: '15px',
              background: '#ffebee',
              borderRadius: '8px',
              margin: '8px 0',
              textAlign: 'center',
              fontSize: '18px'
            }}
          >
            -1 / -3
          </TouchButton>

          {/* Repeat the same display changes for player_two */}
          <h3>{player2.name}</h3>

          <TouchButton
            onSingleTap={() => throwBagPlayer2("on")}
            onDoubleTap={() => throwBagPlayer2("in")}
            style={{ 
              padding: '15px',
              background: '#e3f2fd',
              borderRadius: '8px',
              margin: '8px 0',
              textAlign: 'center',
              fontSize: '18px'
            }}
          >
            +1 / +3
          </TouchButton>

          <h1>Round: {player2.roundPoints}</h1>
          <h2>Total: {player2.totalPoints}</h2>

          <TouchButton
            onSingleTap={() => throwBagPlayer2("subtractOn")}
            onDoubleTap={() => throwBagPlayer2("subtractIn")}
            style={{ 
              padding: '15px',
              background: '#ffebee',
              borderRadius: '8px',
              margin: '8px 0',
              textAlign: 'center',
              fontSize: '18px'
            }}
          >
            -1 / -3
          </TouchButton>
        </div>
      </section>
      
      {!gameEnded && player1 && player2 && (
        <>
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
        </>
      )}
    </div>
  );
}