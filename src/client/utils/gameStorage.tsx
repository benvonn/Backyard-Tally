// utils/gameStorage.ts

interface RoundData {
  roundNumber: number;
  player1RoundScore: number;
  player2RoundScore: number;
  player1TotalBefore: number;
  player2TotalBefore: number;
  player1RoundBagsIn?: number;
  player1RoundBagsOn?: number;
  player2RoundBagsIn?: number;
  player2RoundBagsOn?: number;
  timestamp: string;
}

interface GameData {
  player1TotalBagsIn?: number;
  player1TotalBagsOn?: number;
  player2TotalBagsIn?: number;
  player2TotalBagsOn?: number;
  [key: string]: any;
}

export function saveRoundData(roundData: RoundData): void {
  try {
    const completeRoundData = {
      ...roundData,
      player1RoundBagsIn: roundData.player1RoundBagsIn || 0,
      player1RoundBagsOn: roundData.player1RoundBagsOn || 0,
      player2RoundBagsIn: roundData.player2RoundBagsIn || 0,
      player2RoundBagsOn: roundData.player2RoundBagsOn || 0
    };
    
    const existingRounds: RoundData[] = JSON.parse(localStorage.getItem("tempRoundData") || "[]");
    existingRounds.push(completeRoundData);
    localStorage.setItem("tempRoundData", JSON.stringify(existingRounds));
    console.log("Round data saved to localStorage:", completeRoundData);
  } catch (error) {
    console.error("Failed to save round data:", error);
  }
}

export function getTempRoundData(): RoundData[] {
  try {
    return JSON.parse(localStorage.getItem("tempRoundData") || "[]");
  } catch (error) {
    console.error("Failed to get temp round data:", error);
    return [];
  }
}

export function saveCompleteGame(gameData: GameData): void {
  try {
    const completeGameData = {
      ...gameData,
      player1TotalBagsIn: gameData.player1TotalBagsIn || 0,
      player1TotalBagsOn: gameData.player1TotalBagsOn || 0,
      player2TotalBagsIn: gameData.player2TotalBagsIn || 0,
      player2TotalBagsOn: gameData.player2TotalBagsOn || 0
    };
    
    const existingGames: GameData[] = JSON.parse(localStorage.getItem("gameHistory") || "[]");
    existingGames.push(completeGameData);
    localStorage.setItem("gameHistory", JSON.stringify(existingGames));
    console.log("Game saved to localStorage:", completeGameData);
  } catch (error) {
    console.error("Failed to save game:", error);
  }
}