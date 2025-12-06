import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

interface Player {
  name: string;
  score: number;
}

interface Round {
  roundNumber: number;
  player1RoundScore: number;
  player2RoundScore: number;
  player1TotalBefore: number;
  player2TotalBefore: number;
  // Add more round fields if needed.
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
  const [rowSelection, setRowSelection] = useState({});
  const [error, setError] = useState("");
  const URL = "https://localhost:7157";

  useEffect(() => {
    const storedData = localStorage.getItem("gameData");
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
  }, []);

  const handleUpload = async () => {
    const currentData = localStorage.getItem("gameData");
    if (!currentData) {
      setError("No game data in local storage to upload.");
      return;
    }

    try {
      const res = await fetch(`${URL}/api/Update/DB`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: currentData }),
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const updatedData: GameDataItem[] = await res.json();
      const updatedString = JSON.stringify(updatedData);
      localStorage.setItem("gameData", updatedString);
      setData(updatedData); // Update local state without reload for better UX.
      // window.location.reload(); // Optional: Uncomment if you need a full reload.
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
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(), // Format date for display.
      },
      {
        accessorKey: "board",
        header: "Board",
      },
      {
        accessorFn: (row) => row.player1.name,
        id: "player1Name",
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
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button onClick={() => console.log("Dropdown action for game:", row.original)}>
            ▼
          </button>
        ), // Placeholder for dropdown features. Implement onClick logic later, e.g., to show rounds details.
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true, // Enable row selection.
    getRowId: (row) => row.date, // Use date as unique row ID since it's likely unique.
  });

  return (
    <div>
      <h2>Game Data</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length > 0 ? (
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
        <p>No game data available in local storage.</p>
      )}
      <button onClick={handleUpload}>Upload Local Storage to Database</button>
    </div>
  );
}