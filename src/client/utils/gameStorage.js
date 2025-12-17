// utils/gameStorage.js

// Save round data to localStorage
export function saveRoundData(roundData) {
  try {
    // Ensure bag counts are included if provided
    const completeRoundData = {
      ...roundData,
      player1RoundBagsIn: roundData.player1RoundBagsIn || 0,
      player1RoundBagsOn: roundData.player1RoundBagsOn || 0,
      player2RoundBagsIn: roundData.player2RoundBagsIn || 0,
      player2RoundBagsOn: roundData.player2RoundBagsOn || 0
    };
    
    const existingRounds = JSON.parse(localStorage.getItem("tempRoundData") || "[]");
    existingRounds.push(completeRoundData);
    localStorage.setItem("tempRoundData", JSON.stringify(existingRounds));
    console.log("Round data saved to localStorage:", completeRoundData);
  } catch (error) {
    console.error("Failed to save round data:", error);
  }
}

// Get all temporary round data
export function getTempRoundData() {
  try {
    return JSON.parse(localStorage.getItem("tempRoundData") || "[]");
  } catch (error) {
    console.error("Failed to get temp round data:", error);
    return [];
  }
}


// Save complete game (for EndGameButton)
export function saveCompleteGame(gameData) {
  try {
    // Optionally add total bag counts to gameData if needed
    const completeGameData = {
      ...gameData,
      player1TotalBagsIn: gameData.player1TotalBagsIn || 0,
      player1TotalBagsOn: gameData.player1TotalBagsOn || 0,
      player2TotalBagsIn: gameData.player2TotalBagsIn || 0,
      player2TotalBagsOn: gameData.player2TotalBagsOn || 0
    };
    
    const existingGames = JSON.parse(localStorage.getItem("gameHistory") || "[]");
    existingGames.push(completeGameData);
    localStorage.setItem("gameHistory", JSON.stringify(existingGames));
    console.log("Game saved to localStorage:", completeGameData);
  } catch (error) {
    console.error("Failed to save game:", error);
  }
}