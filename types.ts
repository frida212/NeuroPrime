export enum GameType {
  NONE = 'NONE',
  SIMON = 'SIMON',
  MEMORY = 'MEMORY',
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface SimonColor {
  id: string;
  color: string;
  soundFreq: number;
  highlightClass: string;
  baseClass: string;
}

export interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameResult {
  score: number;
  gameType: GameType;
}
