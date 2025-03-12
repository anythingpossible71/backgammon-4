// Player types
export type PlayerType = 'WHITE' | 'BLACK';

// Game variants
export type GameVariant = 'casual' | 'gulbara' | 'tapa';

// Piece representation
export interface Piece {
  id: string;
  type: PlayerType;
}

// Dice representation
export interface Dice {
  values: number[];
  rolled: boolean;
  usedIndices: number[];
}

// Move types
export enum MoveActionType {
  MOVE = 'MOVE',
  HIT = 'HIT',
  RECOVER = 'RECOVER',
  BEAR = 'BEAR'
}

// Move representation
export interface Move {
  pieceId: string;
  fromPos: number;
  toPos: number;
  dieIndex: number;
  type: MoveActionType;
}

// Point on the board (triangle)
export type Point = Piece[];

// Bar representation
export interface Bar {
  WHITE: Piece[];
  BLACK: Piece[];
}

// Outside (borne off pieces)
export interface Outside {
  WHITE: Piece[];
  BLACK: Piece[];
}

// Board state
export interface BoardState {
  points: Point[];
  bar: Bar;
  outside: Outside;
}

// Game state
export interface GameState {
  variant: GameVariant;
  board: BoardState;
  currentPlayer: PlayerType;
  dice: Dice;
  moveHistory: Move[];
  gameId: string;
  timestamp: number;
  score: {
    WHITE: number;
    BLACK: number;
  };
}

// Available move
export interface AvailableMove {
  fromPos: number;
  toPos: number;
  dieValue: number;
  dieIndex: number;
  type: MoveActionType;
} 