import LZString from 'lz-string';
import { v4 as uuidv4 } from 'uuid';
import { BoardState, Dice, GameState, GameVariant, Piece, PlayerType } from '../models/types';

// Generate a unique ID for pieces
const generatePieceId = (): string => {
  return uuidv4().substring(0, 8);
};

// Create a new piece
const createPiece = (type: PlayerType): Piece => {
  return {
    id: generatePieceId(),
    type
  };
};

// Initialize the board for casual backgammon
const initCasualBoard = (): BoardState => {
  const points: Piece[][] = Array(24).fill([]).map(() => []);
  
  // Set up initial positions for casual backgammon
  // White pieces
  points[0] = Array(2).fill(null).map(() => createPiece('WHITE'));
  points[11] = Array(5).fill(null).map(() => createPiece('WHITE'));
  points[16] = Array(3).fill(null).map(() => createPiece('WHITE'));
  points[18] = Array(5).fill(null).map(() => createPiece('WHITE'));
  
  // Black pieces
  points[23] = Array(2).fill(null).map(() => createPiece('BLACK'));
  points[12] = Array(5).fill(null).map(() => createPiece('BLACK'));
  points[7] = Array(3).fill(null).map(() => createPiece('BLACK'));
  points[5] = Array(5).fill(null).map(() => createPiece('BLACK'));
  
  return {
    points,
    bar: {
      WHITE: [],
      BLACK: []
    },
    outside: {
      WHITE: [],
      BLACK: []
    }
  };
};

// Initialize the board for Gul Bara variant
const initGulBaraBoard = (): BoardState => {
  const points: Piece[][] = Array(24).fill([]).map(() => []);
  
  // Set up initial positions for Gul Bara
  // This is a placeholder - implement actual Gul Bara setup
  points[0] = Array(15).fill(null).map(() => createPiece('WHITE'));
  points[23] = Array(15).fill(null).map(() => createPiece('BLACK'));
  
  return {
    points,
    bar: {
      WHITE: [],
      BLACK: []
    },
    outside: {
      WHITE: [],
      BLACK: []
    }
  };
};

// Initialize the board for Tapa variant
const initTapaBoard = (): BoardState => {
  const points: Piece[][] = Array(24).fill([]).map(() => []);
  
  // Set up initial positions for Tapa
  // This is a placeholder - implement actual Tapa setup
  points[0] = Array(15).fill(null).map(() => createPiece('WHITE'));
  points[12] = Array(15).fill(null).map(() => createPiece('BLACK'));
  
  return {
    points,
    bar: {
      WHITE: [],
      BLACK: []
    },
    outside: {
      WHITE: [],
      BLACK: []
    }
  };
};

// Generate initial game state based on variant
export const generateInitialState = (variant: GameVariant): GameState => {
  let board: BoardState;
  
  switch (variant) {
    case 'gulbara':
      board = initGulBaraBoard();
      break;
    case 'tapa':
      board = initTapaBoard();
      break;
    case 'casual':
    default:
      board = initCasualBoard();
      break;
  }
  
  // Randomly determine first player
  const firstPlayer: PlayerType = Math.random() < 0.5 ? 'WHITE' : 'BLACK';
  
  return {
    variant,
    board,
    currentPlayer: firstPlayer,
    dice: {
      values: [],
      rolled: false,
      usedIndices: []
    },
    moveHistory: [],
    gameId: uuidv4(),
    timestamp: Date.now(),
    score: {
      WHITE: 0,
      BLACK: 0
    }
  };
};

// Encode game state to URL-friendly string
export const encodeGameState = (state: GameState): string => {
  // Convert the state to a string
  const stateString = JSON.stringify(state);
  
  // Compress the string
  const compressed = LZString.compressToEncodedURIComponent(stateString);
  
  return compressed;
};

// Decode game state from URL-friendly string
export const decodeGameState = (encodedState: string): GameState => {
  // Decompress the string
  const decompressed = LZString.decompressFromEncodedURIComponent(encodedState);
  
  if (!decompressed) {
    throw new Error('Failed to decompress game state');
  }
  
  // Parse the JSON
  try {
    const state = JSON.parse(decompressed) as GameState;
    return state;
  } catch (error) {
    throw new Error('Failed to parse game state JSON');
  }
}; 