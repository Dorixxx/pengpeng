
export enum TurtleColor {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  PURPLE = 'PURPLE',
  ORANGE = 'ORANGE',
  PINK = 'PINK',
  CYAN = 'CYAN',
  BROWN = 'BROWN',
  WHITE = 'WHITE'
}

export interface Turtle {
  id: string;
  color: TurtleColor;
}

export type GridSlot = Turtle | null;

export interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'bonus' | 'wish' | 'match';
}

export interface ToastItem {
  id: number;
  message: string;
  type: 'info' | 'bonus' | 'wish' | 'match';
}

export interface SettlementResult {
  bonusPacks: number;
  matches: string[]; // Descriptions of matches e.g. "Red Pair", "Blue Line"
  totalCleared: number;
  isFullHouse: boolean;
  isClearance: boolean;
}

export interface GameState {
  inventory: Turtle[];
  grid: GridSlot[];
  packsRemaining: number;
  totalOpened: number;
  status: 'IDLE' | 'PLAYING' | 'SETTLING' | 'FINISHED';
  wishColor: TurtleColor | null;
  logs: LogEntry[];
  lastAction: string | null;
}

export const PACK_COST = 19.9; // Simulated currency