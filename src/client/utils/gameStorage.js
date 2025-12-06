// utils/gameStorage.js

// Save round data to localStorage
export function saveRoundData(roundData) {
  try {
    const existingRounds = JSON.parse(localStorage.getItem("tempRoundData") || "[]");
    existingRounds.push(roundData);
    localStorage.setItem("tempRoundData", JSON.stringify(existingRounds));
    console.log("Round data saved to localStorage:", roundData);
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

// Clear temporary round data (after uploading to DB)
export function clearTempRoundData() {
  localStorage.removeItem("tempRoundData");
}

// Save complete game (for EndGameButton)
export function saveCompleteGame(gameData) {
  try {
    const existingGames = JSON.parse(localStorage.getItem("gameHistory") || "[]");
    existingGames.push(gameData);
    localStorage.setItem("gameHistory", JSON.stringify(existingGames));
    console.log("Game saved to localStorage:", gameData);
  } catch (error) {
    console.error("Failed to save game:", error);
  }
}