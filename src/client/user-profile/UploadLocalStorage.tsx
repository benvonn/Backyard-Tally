import React, { useEffect, useState, useMemo } from "react";
import gameDataManager from "../utils/Manager";
import styled from "@emotion/styled";

interface Player {
  id: number | string; 
  name: string;
  score: number;
}

interface Round {
  roundNumber: number;
  player1RoundScore: number;
  player2RoundScore: number;
  player1TotalBefore: number;
  player2TotalBefore: number;
}

interface GameDataItem {
  date: string;
  totalRounds: number;
  board: string;
  winner: string;
  player1: Player;
  player2: Player;
  rounds: Round[];
}

const ToggleButton = styled.button`
  background: #0f0;
  border: solid 2.5px #0f0;
  color: #000000ff;
  cursor: pointer;
  padding: 0;
  font-family: VT323;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  width: 30vw;
`;

const ToggleText = styled.span`
  padding-left: 8px; 
`;

const ToggleArrow = styled.span`
  padding-right: 8px; 
`;

const ContentContainer = styled.div`
  background: #000000ff;
  position: fixed;
  border: 5px solid #0f0;
  padding: 8px;
  margin-top: 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  -ms-overflow-style: none;  
  scrollbar-width: none;  
  &::-webkit-scrollbar {
    display: none;  
  }
`;

const StyledH2 = styled.h2`
  font-size: 25px;
  color: #0f0;
  margin-bottom: 16px;
  text-align: center;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #0f0;
  margin-bottom: 10px;
`;

const StyledCheckbox = styled.input`
  accent-color: #0f0;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ErrorP = styled.p`
  color: #f00;
  font-size: 16px;
  margin-bottom: 16px;
`;

const NoDataP = styled.p`
  font-size: 20px;
  color: #0f0;
  text-align: center;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-size: 20px;
`;

const StyledThead = styled.thead`
  background: #0f0;
  color: #000;
`;

const StyledTh = styled.th`
  border: 2.5px solid #0f0;
  padding: 0.5rem 1rem;
  text-align: left;
  font-weight: normal;
`;

const StyledTbody = styled.tbody``;

const StyledTr = styled.tr`
  &:hover {
    background: rgba(15, 255, 0, 0.1);
  }
`;

const StyledTd = styled.td`
  border: 2.5px solid #0f0;
  padding: 0.5rem 1rem;
`;

const StyledUploadButton = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-family: VT323;
  font-size: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function GameDataTable() {
  const [data, setData] = useState<GameDataItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>("");
  const [showAllGames, setShowAllGames] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const URL = "https://witty-moss-0d46e7810.6.azurestaticapps.net";

  useEffect(() => {
    const storedData = localStorage.getItem("gameHistory");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          setData(parsedData);
        } else {
          setError("Invalid game data format in local storage.");
        }
      } catch (err) {
        setError("Error parsing game data from local storage.");
      }
    }

    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const parsedUser = JSON.parse(userProfile);
        setCurrentUser(parsedUser.name || null);
      } catch (err) {
        setError("Error parsing user profile from local storage.");
      }
    } else {
      setError("No user profile found in local storage.");
    }
  }, []);

  const filteredData = useMemo(() => {
    if (showAllGames) {
      return data;
    }
    
    if (!currentUser) return [];
    
    return data.filter(
      (game) => {
        const player1Matches = game.player1.name === currentUser;
        const player2Matches = game.player2.name === currentUser;
        
        return player1Matches || player2Matches;
      }
    );
  }, [data, currentUser, showAllGames]);

  const handleUpload = async () => {
    if (!currentUser) {
      setError("No current user identified for upload.");
      return;
    }

    const userGames = data.filter(
      (game) => game.player1.name === currentUser || game.player2.name === currentUser
    );
    
    if (userGames.length === 0) {
      setError("No game data associated with the current user to upload.");
      return;
    }

    try {
      const res = await fetch(`${URL}/api/GameData/Update/DB`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: userGames })
      });
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      gameDataManager.markAsUploaded();
      
      alert("Games uploaded successfully!");
    } catch (error) {
      setError("Failed to upload data to database.");
    }
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      const newSelected = new Set(filteredData.map(game => game.date));
      setSelectedRows(newSelected);
    }
  };

  const toggleRow = (date: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(date)) {
      newSelected.delete(date);
    } else {
      newSelected.add(date);
    }
    setSelectedRows(newSelected);
  };

  const headers = [
    { id: 'select', label: '' },
    { id: 'date', label: 'Date' },
    { id: 'board', label: 'Board' },
    { id: 'player1Name', label: 'Player 1 Name' },
    { id: 'player1Score', label: 'Player 1 Score' },
    { id: 'player2Name', label: 'Player 2 Name' },
    { id: 'player2Score', label: 'Player 2 Score' },
    { id: 'totalRounds', label: 'Total Rounds' },
    { id: 'winner', label: 'Winner' },
  ];

  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      width: '100%' 
    }}>
      <ToggleButton 
        onClick={() => setShowContent(!showContent)}
      >
        <ToggleText>Game Data</ToggleText>
        <ToggleArrow>▼</ToggleArrow>
      </ToggleButton>
      
      {showContent && (
        <ContentContainer>
          <StyledH2>Game Data</StyledH2>
          
          <StyledLabel>
            <StyledCheckbox
              type="checkbox"
              checked={showAllGames}
              onChange={() => setShowAllGames(!showAllGames)}
              style={{ marginRight: '5px' }}
            />
            Show All Games
          </StyledLabel>
          
          {error && <ErrorP>{error}</ErrorP>}
          
          {filteredData.length > 0 ? (
            <StyledTable>
              <StyledThead>
                <StyledTr>
                  {headers.map((header) => (
                    <StyledTh key={header.id}>
                      {header.id === 'select' ? (
                        <StyledCheckbox
                          type="checkbox"
                          checked={selectedRows.size === filteredData.length}
                          onChange={toggleAllRows}
                        />
                      ) : (
                        header.label
                      )}
                    </StyledTh>
                  ))}
                </StyledTr>
              </StyledThead>
              <StyledTbody>
                {filteredData.map((game) => (
                  <StyledTr key={game.date}>
                    <StyledTd>
                      <StyledCheckbox
                        type="checkbox"
                        checked={selectedRows.has(game.date)}
                        onChange={() => toggleRow(game.date)}
                      />
                    </StyledTd>
                    <StyledTd>{new Date(game.date).toLocaleString()}</StyledTd>
                    <StyledTd>{game.board}</StyledTd>
                    <StyledTd>{game.player1.name}</StyledTd>
                    <StyledTd>{game.player1.score}</StyledTd>
                    <StyledTd>{game.player2.name}</StyledTd>
                    <StyledTd>{game.player2.score}</StyledTd>
                    <StyledTd>{game.totalRounds}</StyledTd>
                    <StyledTd>{game.winner}</StyledTd>
                  </StyledTr>
                ))}
              </StyledTbody>
            </StyledTable>
          ) : (
            <NoDataP>No game data available {showAllGames ? "in storage" : `for ${currentUser || "the current user"}`}.</NoDataP>
          )}
          
          <StyledUploadButton 
            onClick={handleUpload}
            disabled={showAllGames ? !data.filter(
              (game) => game.player1.name === currentUser || game.player2.name === currentUser
            ).length : !filteredData.length}
          >
            Upload {showAllGames ? "My Games" : "Local Storage to Database"}
          </StyledUploadButton>
        </ContentContainer>
      )}
    </div>
  );
}
