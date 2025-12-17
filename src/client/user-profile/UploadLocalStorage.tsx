import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import gameDataManager from "../utils/Manager";

interface Player {
  id: number | string; // Allow both string and number for ID
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

export default function GameDataTable() {
  const [data, setData] = useState<GameDataItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [error, setError] = useState<string>("");
  const [showAllGames, setShowAllGames] = useState(false); // New state for filter toggle
  const URL = "https://localhost:7157";

  useEffect(() => {
    // Load games from localStorage
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
        console.log("User profile:", parsedUser); // Debug log
        
        // Set currentUser to just the name
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
      // Show all games if toggle is on
      return data;
    }
    
    // Otherwise, filter for current user
    if (!currentUser) return [];
    
    console.log("Current user:", currentUser); // Debug log
    console.log("Games:", data); // Debug log
    
    return data.filter(
      (game) => {
        const player1Matches = game.player1.name === currentUser;
        const player2Matches = game.player2.name === currentUser;
        
        console.log(`Game ${game.date}: player1=${game.player1.name}, player2=${game.player2.name}, matches=${player1Matches || player2Matches}`);
        
        return player1Matches || player2Matches;
      }
    );
  }, [data, currentUser, showAllGames]);

  const handleUpload = async () => {
    if (!currentUser) {
      setError("No current user identified for upload.");
      return;
    }

    // Only allow upload of user's games
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
      console.log(userGames);
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      // On successful upload, mark as uploaded
      gameDataManager.markAsUploaded();
      
      alert("Games uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      setError("Failed to upload data to database.");
    }
  };

  const columns: ColumnDef<GameDataItem>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
      },
      {
        accessorKey: "board",
        header: "Board",
      },
      {
        accessorFn: (row) => row.player1.name,
        name: "player1Name",
        header: "Player 1 Name",
      },
      {
        accessorFn: (row) => row.player1.score,
        id: "player1Score",
        header: "Player 1 Score",
      },
      {
        accessorFn: (row) => row.player2.name,
        id: "player2Name",
        header: "Player 2 Name",
      },
      {
        accessorFn: (row) => row.player2.score,
        id: "player2Score",
        header: "Player 2 Score",
      },
      {
        accessorKey: "totalRounds",
        header: "Total Rounds",
      },
      {
        accessorKey: "winner",
        header: "Winner",
      },
      // {
      //   id: "actions",
      //   header: "Actions",
      //   cell: ({ row }) => (
      //     <button onClick={() => console.log("Dropdown action for game:", row.original)}>
      //       ▼
      //     </button>
      //   ),
      // },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: (row: GameDataItem) => row.date, // Add explicit type
  });

  return (
    <div>
      <h2>Game Data</h2>
      
      {/* Filter Toggle Button */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={showAllGames}
            onChange={() => setShowAllGames(!showAllGames)}
            style={{ marginRight: '5px' }}
          />
          Show All Games
        </label>
      </div>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {filteredData.length > 0 ? (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No game data available {showAllGames ? "in storage" : `for ${currentUser || "the current user"}`}.</p>
      )}
      
      <button 
        onClick={handleUpload}
        disabled={showAllGames ? !data.filter(
          (game) => game.player1.name === currentUser || game.player2.name === currentUser
        ).length : !filteredData.length}
      >
        Upload {showAllGames ? "My Games" : "Local Storage to Database"}
      </button>
    </div>
  );
}