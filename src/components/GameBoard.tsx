import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AvailableMove, GameState, MoveActionType, Piece, PlayerType } from '../models/types';
import { calculateAvailableMoves } from '../utils/gameLogic';
import Point from './Point';
import Bar from './Bar';
import Home from './Home';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 40px 1fr;
  width: 100%;
  max-width: 1000px;
  height: 600px;
  background-color: var(--board-light);
  border: 10px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const TopRow = styled.div`
  grid-column: 1 / 13;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const MiddleRow = styled.div`
  grid-column: 1 / 13;
  grid-row: 2;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  background-color: var(--primary-color);
`;

const BottomRow = styled.div`
  grid-column: 1 / 13;
  grid-row: 3;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const PlayerInfo = styled.div<{ isCurrentPlayer: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${props => props.isCurrentPlayer ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.isCurrentPlayer ? 'white' : '#333'};
  border-radius: 4px;
  width: 100%;
  max-width: 1000px;
`;

const PlayerName = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

const PlayerScore = styled.span`
  font-size: 1.2rem;
`;

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onUpdateGameState }) => {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [availableMoves, setAvailableMoves] = useState<AvailableMove[]>([]);
  
  // Calculate available moves when dice are rolled or a piece is selected
  useEffect(() => {
    if (gameState.dice.rolled && gameState.dice.values.length > 0) {
      const moves = calculateAvailableMoves(gameState);
      setAvailableMoves(moves);
    } else {
      setAvailableMoves([]);
    }
  }, [gameState.dice, selectedPiece]);
  
  // Handle piece selection
  const handlePieceSelect = (piece: Piece, pointIndex: number) => {
    // Only allow selecting pieces of the current player
    if (piece.type !== gameState.currentPlayer || !gameState.dice.rolled) {
      return;
    }
    
    setSelectedPiece(piece);
  };
  
  // Handle piece movement
  const handlePointClick = (pointIndex: number) => {
    if (!selectedPiece || availableMoves.length === 0) {
      return;
    }
    
    // Find if this is a valid move
    const move = availableMoves.find(m => 
      m.toPos === pointIndex && 
      (selectedPiece.type === gameState.currentPlayer)
    );
    
    if (move) {
      // Create a deep copy of the game state
      const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
      
      // Implement the move logic here
      // This is a placeholder - actual move implementation would be more complex
      
      // Update the game state
      onUpdateGameState(newState);
      
      // Reset selection
      setSelectedPiece(null);
    }
  };
  
  // Render the board
  return (
    <BoardContainer>
      <PlayerInfo isCurrentPlayer={gameState.currentPlayer === 'BLACK'}>
        <PlayerName>Player Black</PlayerName>
        <PlayerScore>Score: {gameState.score.BLACK}</PlayerScore>
      </PlayerInfo>
      
      <Board>
        <TopRow>
          {/* Points 12-23 (top row) */}
          {Array.from({ length: 6 }, (_, i) => (
            <Point 
              key={i + 18} 
              pointIndex={i + 18} 
              pieces={gameState.board.points[i + 18]} 
              isHighlighted={availableMoves.some(m => m.toPos === i + 18)}
              onPieceSelect={handlePieceSelect}
              onPointClick={handlePointClick}
            />
          ))}
          
          {/* Bar for BLACK pieces */}
          <Bar 
            playerType="BLACK" 
            pieces={gameState.board.bar.BLACK} 
            onPieceSelect={(piece) => handlePieceSelect(piece, -1)}
          />
          
          {/* Points 12-17 (top row, right side) */}
          {Array.from({ length: 6 }, (_, i) => (
            <Point 
              key={i + 12} 
              pointIndex={i + 12} 
              pieces={gameState.board.points[i + 12]} 
              isHighlighted={availableMoves.some(m => m.toPos === i + 12)}
              onPieceSelect={handlePieceSelect}
              onPointClick={handlePointClick}
            />
          )).reverse()}
        </TopRow>
        
        <MiddleRow>
          {/* Middle row with dice display */}
          <div style={{ gridColumn: '1 / 13', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {gameState.dice.values.map((value, index) => (
              <div key={index} style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: 'white', 
                borderRadius: '4px', 
                margin: '0 5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                opacity: gameState.dice.usedIndices.includes(index) ? 0.5 : 1
              }}>
                {value}
              </div>
            ))}
          </div>
        </MiddleRow>
        
        <BottomRow>
          {/* Points 6-11 (bottom row, left side) */}
          {Array.from({ length: 6 }, (_, i) => (
            <Point 
              key={i + 6} 
              pointIndex={i + 6} 
              pieces={gameState.board.points[i + 6]} 
              isHighlighted={availableMoves.some(m => m.toPos === i + 6)}
              onPieceSelect={handlePieceSelect}
              onPointClick={handlePointClick}
            />
          ))}
          
          {/* Bar for WHITE pieces */}
          <Bar 
            playerType="WHITE" 
            pieces={gameState.board.bar.WHITE} 
            onPieceSelect={(piece) => handlePieceSelect(piece, -1)}
          />
          
          {/* Points 0-5 (bottom row, right side) */}
          {Array.from({ length: 6 }, (_, i) => (
            <Point 
              key={i} 
              pointIndex={i} 
              pieces={gameState.board.points[i]} 
              isHighlighted={availableMoves.some(m => m.toPos === i)}
              onPieceSelect={handlePieceSelect}
              onPointClick={handlePointClick}
            />
          )).reverse()}
        </BottomRow>
      </Board>
      
      <PlayerInfo isCurrentPlayer={gameState.currentPlayer === 'WHITE'}>
        <PlayerName>Player White</PlayerName>
        <PlayerScore>Score: {gameState.score.WHITE}</PlayerScore>
      </PlayerInfo>
    </BoardContainer>
  );
};

export default GameBoard; 