class GameDataManager {
  constructor() {
    this.MAX_LOCAL_GAMES = 50;
  }

  /**
   * Get all games from localStorage
   */
  getAllGames() {
    const stored = localStorage.getItem('gameHistory');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Mark as uploaded (call when online upload succeeds)
   */
  markAsUploaded() {
    localStorage.setItem('lastUploadDate', new Date().toISOString());
  }

  /**
   * Add a new game and enforce policies
   */
  addGame(newGame) {
    const games = this.getAllGames();
    games.push(newGame);
    
    // Enforce decay policy after adding
    if (games.length > this.MAX_LOCAL_GAMES) {
      this.enforceDecayPolicy();
    }
  }

  /**
   * Apply decay policy to reduce local storage size
   */
  enforceDecayPolicy() {
    const allGames = this.getAllGames()
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    
    const finalGames = allGames.slice(0, this.MAX_LOCAL_GAMES);
    localStorage.setItem('gameHistory', JSON.stringify(finalGames));
    
    return finalGames;
  }
}

// Create singleton instance
export const gameDataManager = new GameDataManager();
export default gameDataManager;