import React from 'react';
import styled from 'styled-components';
import { Piece, PlayerType } from '../models/types';
import GamePiece from './GamePiece';

interface BarProps {
  playerType: PlayerType;
  pieces: Piece[];
  onPieceSelect: (piece: Piece) => void;
}

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--primary-color);
  grid-column: span 2;
  position: relative;
`;

const PiecesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  max-height: 100%;
  overflow-y: auto;
  padding: 5px 0;
`;

const Bar: React.FC<BarProps> = ({ playerType, pieces, onPieceSelect }) => {
  // Render pieces on the bar
  const renderPieces = () => {
    // Limit visible pieces to 5, with a counter for additional pieces
    const visiblePieces = pieces.slice(0, 5);
    const remainingCount = pieces.length - visiblePieces.length;
    
    return (
      <>
        {visiblePieces.map((piece) => (
          <GamePiece 
            key={piece.id}
            piece={piece}
            onClick={() => onPieceSelect(piece)}
          />
        ))}
        {remainingCount > 0 && (
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '5px'
          }}>
            +{remainingCount}
          </div>
        )}
      </>
    );
  };
  
  return (
    <BarContainer>
      <PiecesContainer>
        {pieces.length > 0 && renderPieces()}
      </PiecesContainer>
    </BarContainer>
  );
};

export default Bar; 