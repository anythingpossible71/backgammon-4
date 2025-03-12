import { AvailableMove, GameState, MoveActionType, PlayerType } from '../models/types';

// Calculate the direction of movement based on player type
const getDirection = (playerType: PlayerType): number => {
  return playerType === 'WHITE' ? 1 : -1;
};

// Check if a point is blocked (has 2+ opponent pieces)
const isPointBlocked = (gameState: GameState, pointIndex: number): boolean => {
  const point = gameState.board.points[pointIndex];
  if (point.length >= 2 && point[0].type !== gameState.currentPlayer) {
    return true;
  }
  return false;
};

// Check if a player has all pieces in their home board
const areAllPiecesInHomeBoard = (gameState: GameState): boolean => {
  const currentPlayer = gameState.currentPlayer;
  const homeStart = currentPlayer === 'WHITE' ? 18 : 0;
  const homeEnd = currentPlayer === 'WHITE' ? 23 : 5;
  
  // Check if any pieces are on the bar
  if (gameState.board.bar[currentPlayer].length > 0) {
    return false;
  }
  
  // Check if any pieces are outside the home board
  for (let i = 0; i < 24; i++) {
    if (i < homeStart || i > homeEnd) {
      const point = gameState.board.points[i];
      if (point.some(piece => piece.type === currentPlayer)) {
        return false;
      }
    }
  }
  
  return true;
};

// Calculate available moves for the current player
export const calculateAvailableMoves = (gameState: GameState): AvailableMove[] => {
  const availableMoves: AvailableMove[] = [];
  const currentPlayer = gameState.currentPlayer;
  const direction = getDirection(currentPlayer);
  
  // If dice haven't been rolled, no moves are available
  if (!gameState.dice.rolled || gameState.dice.values.length === 0) {
    return [];
  }
  
  // Get unused dice values
  const unusedDiceIndices = gameState.dice.values
    .map((_, index) => index)
    .filter(index => !gameState.dice.usedIndices.includes(index));
  
  const unusedDiceValues = unusedDiceIndices.map(index => gameState.dice.values[index]);
  
  // Check if player has pieces on the bar
  const barPieces = gameState.board.bar[currentPlayer];
  if (barPieces.length > 0) {
    // Player must move pieces from the bar first
    for (const piece of barPieces) {
      for (let i = 0; i < unusedDiceValues.length; i++) {
        const dieValue = unusedDiceValues[i];
        const dieIndex = unusedDiceIndices[i];
        
        // Calculate entry point
        const entryPoint = currentPlayer === 'WHITE' 
          ? dieValue - 1 
          : 24 - dieValue;
        
        // Check if entry point is not blocked
        if (!isPointBlocked(gameState, entryPoint)) {
          availableMoves.push({
            fromPos: -1, // Bar
            toPos: entryPoint,
            dieValue,
            dieIndex,
            type: gameState.board.points[entryPoint].length === 1 && 
                  gameState.board.points[entryPoint][0].type !== currentPlayer
                  ? MoveActionType.HIT
                  : MoveActionType.RECOVER
          });
        }
      }
    }
    
    // If there are moves from the bar, return only those
    if (availableMoves.length > 0) {
      return availableMoves;
    }
    
    // If no moves from bar are possible, player forfeits turn
    return [];
  }
  
  // Check if player can bear off pieces
  const canBearOff = areAllPiecesInHomeBoard(gameState);
  
  // Calculate regular moves
  for (let pointIndex = 0; pointIndex < 24; pointIndex++) {
    const point = gameState.board.points[pointIndex];
    
    // Skip empty points or opponent's pieces
    if (point.length === 0 || point[0].type !== currentPlayer) {
      continue;
    }
    
    // For each unused die value
    for (let i = 0; i < unusedDiceValues.length; i++) {
      const dieValue = unusedDiceValues[i];
      const dieIndex = unusedDiceIndices[i];
      
      // Calculate destination point
      const destPoint = pointIndex + (direction * dieValue);
      
      // Regular move within the board
      if (destPoint >= 0 && destPoint < 24) {
        // Check if destination is not blocked
        if (!isPointBlocked(gameState, destPoint)) {
          availableMoves.push({
            fromPos: pointIndex,
            toPos: destPoint,
            dieValue,
            dieIndex,
            type: gameState.board.points[destPoint].length === 1 && 
                  gameState.board.points[destPoint][0].type !== currentPlayer
                  ? MoveActionType.HIT
                  : MoveActionType.MOVE
          });
        }
      } 
      // Bearing off
      else if (canBearOff) {
        // For WHITE, check if destPoint >= 24
        // For BLACK, check if destPoint < 0
        if ((currentPlayer === 'WHITE' && destPoint >= 24) || 
            (currentPlayer === 'BLACK' && destPoint < 0)) {
          
          // Check if this is an exact bear off or if there are no pieces on higher points
          const isExactBearOff = (currentPlayer === 'WHITE' && pointIndex === 24 - dieValue) ||
                                (currentPlayer === 'BLACK' && pointIndex === dieValue - 1);
          
          let canBearOffWithThisDie = isExactBearOff;
          
          if (!isExactBearOff) {
            // Check if there are no pieces on higher points
            let hasHigherPieces = false;
            
            if (currentPlayer === 'WHITE') {
              for (let p = pointIndex + 1; p < 24; p++) {
                if (gameState.board.points[p].some(piece => piece.type === 'WHITE')) {
                  hasHigherPieces = true;
                  break;
                }
              }
            } else {
              for (let p = pointIndex - 1; p >= 0; p--) {
                if (gameState.board.points[p].some(piece => piece.type === 'BLACK')) {
                  hasHigherPieces = true;
                  break;
                }
              }
            }
            
            canBearOffWithThisDie = !hasHigherPieces;
          }
          
          if (canBearOffWithThisDie) {
            availableMoves.push({
              fromPos: pointIndex,
              toPos: -2, // Outside (bearing off)
              dieValue,
              dieIndex,
              type: MoveActionType.BEAR
            });
          }
        }
      }
    }
  }
  
  return availableMoves;
};

// Apply a move to the game state
export const applyMove = (gameState: GameState, move: AvailableMove, pieceId: string): GameState => {
  // Create a deep copy of the game state
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  // Find the piece to move
  let pieceToMove;
  let fromPointIndex;
  
  if (move.fromPos === -1) {
    // Moving from bar
    fromPointIndex = -1;
    const barPieceIndex = newState.board.bar[newState.currentPlayer].findIndex(p => p.id === pieceId);
    if (barPieceIndex === -1) {
      throw new Error('Piece not found on bar');
    }
    pieceToMove = newState.board.bar[newState.currentPlayer][barPieceIndex];
    newState.board.bar[newState.currentPlayer].splice(barPieceIndex, 1);
  } else {
    // Moving from a point
    fromPointIndex = move.fromPos;
    const pointPieceIndex = newState.board.points[fromPointIndex].findIndex(p => p.id === pieceId);
    if (pointPieceIndex === -1) {
      throw new Error('Piece not found on point');
    }
    pieceToMove = newState.board.points[fromPointIndex][pointPieceIndex];
    newState.board.points[fromPointIndex].splice(pointPieceIndex, 1);
  }
  
  // Apply the move based on its type
  switch (move.type) {
    case MoveActionType.MOVE:
      // Regular move
      newState.board.points[move.toPos].push(pieceToMove);
      break;
      
    case MoveActionType.HIT:
      // Hit opponent's piece
      const hitPiece = newState.board.points[move.toPos][0];
      newState.board.bar[hitPiece.type].push(hitPiece);
      newState.board.points[move.toPos] = [pieceToMove];
      break;
      
    case MoveActionType.RECOVER:
      // Recover from bar
      newState.board.points[move.toPos].push(pieceToMove);
      break;
      
    case MoveActionType.BEAR:
      // Bear off
      newState.board.outside[newState.currentPlayer].push(pieceToMove);
      break;
  }
  
  // Mark the die as used
  newState.dice.usedIndices.push(move.dieIndex);
  
  // Add move to history
  newState.moveHistory.push({
    pieceId,
    fromPos: move.fromPos,
    toPos: move.toPos,
    dieIndex: move.dieIndex,
    type: move.type
  });
  
  // Check if all dice have been used
  if (newState.dice.usedIndices.length === newState.dice.values.length) {
    // End turn
    newState.currentPlayer = newState.currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE';
    newState.dice = {
      values: [],
      rolled: false,
      usedIndices: []
    };
  }
  
  // Check for game end
  if (newState.board.outside[newState.currentPlayer].length === 15) {
    // Player has borne off all pieces
    newState.score[newState.currentPlayer]++;
    // Reset for a new game would go here
  }
  
  return newState;
};

// Roll dice for the current player
export const rollDice = (gameState: GameState): GameState => {
  // Create a deep copy of the game state
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  // Generate random dice values
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  
  // Check for doubles
  if (die1 === die2) {
    newState.dice = {
      values: [die1, die1, die1, die1],
      rolled: true,
      usedIndices: []
    };
  } else {
    newState.dice = {
      values: [die1, die2],
      rolled: true,
      usedIndices: []
    };
  }
  
  // Update timestamp
  newState.timestamp = Date.now();
  
  return newState;
}; 