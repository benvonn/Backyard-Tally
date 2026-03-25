// logic/gameLogic.ts

interface PlayerJSON {
  id: number | string;
  name: string;
  roundPoints?: number;
  totalPoints?: number;
  bags?: number;
  roundBagsIn?: number;
  roundBagsOn?: number;
  roundScores?: number[];
  totalBagsIn?: number;
  totalBagsOn?: number;
}

interface PlayerStats {
  name: string;
  totalPoints: number;
  roundsPlayed: number;
  roundScores: number[];
  PPR: string | number;
  bagsIn: number;
  bagsOn: number;
  totalBagsThrown: number;
  inPercentage: string | number;
}

export default class Player {
  id: number | string;
  name: string;
  roundPoints: number;
  totalPoints: number;
  bags: number;
  roundBagsIn: number;
  roundBagsOn: number;
  roundScores: number[];
  totalBagsIn: number;
  totalBagsOn: number;

  constructor(id: number | string, name: string) {
    this.id = id;
    this.name = name;
    this.roundPoints = 0;
    this.totalPoints = 0;
    this.bags = 4;
    this.roundBagsIn = 0;
    this.roundBagsOn = 0;
    this.roundScores = [];
    this.totalBagsIn = 0;
    this.totalBagsOn = 0;
  }

  toJSON(): PlayerJSON {
    return {
      id: this.id,
      name: this.name,
      roundPoints: this.roundPoints,
      totalPoints: this.totalPoints,
      bags: this.bags,
      roundBagsIn: this.roundBagsIn,
      roundBagsOn: this.roundBagsOn,
      roundScores: this.roundScores,
      totalBagsIn: this.totalBagsIn,
      totalBagsOn: this.totalBagsOn,
    };
  }

  static fromJSON(obj: PlayerJSON | null): Player | null {
    if (!obj) return null;
    const player = new Player(obj.id, obj.name);
    player.roundPoints = obj.roundPoints ?? 0;
    player.totalPoints = obj.totalPoints ?? 0;
    player.bags = obj.bags ?? 4;
    player.roundBagsIn = obj.roundBagsIn ?? 0;
    player.roundBagsOn = obj.roundBagsOn ?? 0;
    player.roundScores = Array.isArray(obj.roundScores) ? [...obj.roundScores] : [];
    player.totalBagsIn = obj.totalBagsIn ?? 0;
    player.totalBagsOn = obj.totalBagsOn ?? 0;
    return player;
  }

  throw(type: string = "in"): boolean {
    if (type === "subtractOn") {
      this.roundPoints = Math.max(0, this.roundPoints - 1);
      this.bags = Math.min(4, this.bags + 1);
      this.totalBagsOn = Math.max(0, this.totalBagsOn - 1);
      this.roundBagsOn = Math.max(0, this.roundBagsOn - 1);
      return true;
    } else if (type === "subtractIn") {
      this.roundPoints = Math.max(0, this.roundPoints - 3);
      this.bags = Math.min(4, this.bags + 1);
      this.totalBagsIn = Math.max(0, this.totalBagsIn - 1);
      this.roundBagsIn = Math.max(0, this.roundBagsIn - 1);
      return true;
    }

    if (this.bags > 0) {
      this.bags -= 1;
      if (type === "in") {
        this.roundPoints += 3;
        this.totalBagsIn += 1;
        this.roundBagsIn += 1;
      } else if (type === "on") {
        this.roundPoints += 1;
        this.totalBagsOn += 1;
        this.roundBagsOn += 1;
      }
      return true;
    } else {
      console.log("no bags left to throw");
      return false;
    }
  }

  endRound(): void {
    this.roundScores.push(this.roundPoints);
  }

  newRound(): void {
    this.bags = 4;
    this.roundPoints = 0;
  }

  getStats(totalRounds: number): PlayerStats {
    return {
      name: this.name,
      totalPoints: this.totalPoints,
      roundsPlayed: totalRounds,
      roundScores: this.roundScores,
      PPR: totalRounds > 0 ? (this.totalPoints / totalRounds).toFixed(2) : 0,
      bagsIn: this.totalBagsIn,
      bagsOn: this.totalBagsOn,
      totalBagsThrown: this.totalBagsIn + this.totalBagsOn,
      inPercentage: this.totalBagsIn + this.totalBagsOn > 0
        ? ((this.totalBagsIn / (this.totalBagsIn + this.totalBagsOn)) * 100).toFixed(1)
        : 0
    };
  }
}