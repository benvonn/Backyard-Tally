import { useState, useEffect } from 'react';
import Player from "../logic/gameLogic";
import RoundButton from '../RoundButton';
import EndGameButton from '../../components/EndGame.tsx';

export default function Pro_main_area() {
  const [users, setUsers] = useState([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [roundHistory, setRoundHistory] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const currentUser = localStorage.getItem("userProfile");
  
  const URL = 'https://localhost:7157';

  useEffect(() => {
    // Fetch all users from backend
    fetchUsers();
    
    // Set default value from localStorage when component mounts
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setSelectedPlayer1(user.name);
    }
  }, []); // Empty dependency array means this runs once on mount

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
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
 
  const endGame = async () => {
    if (gameEnded) return;

    setGameEnded(true);

    const winner = player1.totalPoints > player2.totalPoints ? player1.name : 
                   player2.totalPoints > player1.totalPoints ? player2.name : "Tie";
  


    alert(`Game Over! Winner: ${winner}`);
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
  
  const throwBag = (player, type) => {
    player.throw(type);
    setRefresh(prev => prev + 1);
  };

  const handleEndRound = () => {
    const roundData = {
      roundNumber: currentRound,
      player1RoundPoints: player1.roundPoints,
      player2RoundPoints: player2.roundPoints,
      player1TotalPoints: player1.totalPoints,
      player2TotalPoints: player2.totalPoints
    };

    setRoundHistory(prev => [...prev, roundData]);
    setCurrentRound(prev => prev + 1)
    setRefresh(prev => prev + 1);
  };

  // Show player selection screen if game hasn't started
  if (!gameStarted) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Select Players</h2>
        
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
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
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
          <h3 id="player1-name">{player1.name}</h3>
          <div onClick={() => throwBag(player1, "on")} className="cursor-pointer">+1</div>
          <div onClick={() => throwBag(player1, "in")} className="cursor-pointer">+3</div>
          <h1 id="player1-Round">{player1.roundPoints}</h1>
          <h2 id="player1-Total">{player1.totalPoints}</h2>
          <div onClick={() => throwBag(player1, "subtractOn")} className="cursor-pointer">-1</div>
          <div onClick={() => throwBag(player1, "subtractIn")} className="cursor-pointer">-3</div>
        </div>
        
        <div id="player_two">
          <h3 id="player2-name">{player2.name}</h3>
          <div onClick={() => throwBag(player2, "on")} className="cursor-pointer">+1</div>
          <div onClick={() => throwBag(player2, "in")} className="cursor-pointer">+3</div>
          <h1 id="player2-Round">{player2.roundPoints}</h1>
          <h2 id="player2-Total">{player2.totalPoints}</h2>
          <div onClick={() => throwBag(player2, "subtractOn")} className="cursor-pointer">-1</div>
          <div onClick={() => throwBag(player2, "subtractIn")} className="cursor-pointer">-3</div>
        </div>
      </section>
      
      {!gameEnded && (
  <>
    <RoundButton 
      player1={player1} 
      player2={player2} 
      onEndRound={handleEndRound}
    />
    <EndGameButton/>
  </>
)}
    </div>
  );
}