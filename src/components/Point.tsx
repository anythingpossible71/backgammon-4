import React from 'react';
import styled from 'styled-components';
import { Piece as PieceType } from '../models/types';
import GamePiece from './GamePiece';

interface PointProps {
  pointIndex: number;
  pieces: PieceType[];
  isHighlighted: boolean;
  onPieceSelect: (piece: PieceType, pointIndex: number) => void;
  onPointClick: (pointIndex: number) => void;
}

interface TriangleProps {
  isTop: boolean;
  isEven: boolean;
  isHighlighted: boolean;
}

const PointContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  cursor: pointer;
`;

const Triangle = styled.div<TriangleProps>`
  width: 100%;
  height: 80%;
  clip-path: ${props => props.isTop 
    ? 'polygon(50% 0%, 100% 100%, 0% 100%)'
    : 'polygon(50% 100%, 100% 0%, 0% 0%)'
  };
  background-color: ${props => props.isEven 
    ? 'var(--board-dark)' 
    : 'var(--board-light)'
  };
  ${props => props.isHighlighted && `
    box-shadow: inset 0 0 10px var(--highlight-color);
    background-color: ${props.isEven 
      ? 'var(--board-dark)' 
      : 'var(--board-light)'
    };
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--highlight-color);
      clip-path: ${props.isTop 
        ? 'polygon(50% 0%, 100% 100%, 0% 100%)'
        : 'polygon(50% 100%, 100% 0%, 0% 0%)'
      };
      pointer-events: none;
    }
  `}
`;

const PiecesContainer = styled.div<{ isTop: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  ${props => props.isTop ? 'top: 0;' : 'bottom: 0;'}
  padding: 5px;
`;

const Point: React.FC<PointProps> = ({ 
  pointIndex, 
  pieces, 
  isHighlighted, 
  onPieceSelect, 
  onPointClick 
}) => {
  const isTop = pointIndex >= 12;
  const isEven = pointIndex % 2 === 0;
  
  // Handle click on the point
  const handlePointClick = () => {
    onPointClick(pointIndex);
  };
  
  // Render pieces with stacking
  const renderPieces = () => {
    // Limit visible pieces to 5, with a counter for additional pieces
    const visiblePieces = pieces.slice(0, 5);
    const remainingCount = pieces.length - visiblePieces.length;
    
    return (
      <>
        {visiblePieces.map((piece, index) => (
          <GamePiece 
            key={piece.id}
            piece={piece}
            onClick={() => onPieceSelect(piece, pointIndex)}
            style={{ 
              zIndex: isTop ? 5 - index : index + 1,
              marginTop: isTop ? `${index * 5}px` : 0,
              marginBottom: !isTop ? `${index * 5}px` : 0
            }}
          />
        ))}
        {remainingCount > 0 && (
          <div style={{ 
            position: 'absolute', 
            [isTop ? 'top' : 'bottom']: '50%', 
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            +{remainingCount}
          </div>
        )}
      </>
    );
  };
  
  return (
    <PointContainer onClick={handlePointClick}>
      <Triangle isTop={isTop} isEven={isEven} isHighlighted={isHighlighted} />
      <PiecesContainer isTop={isTop}>
        {pieces.length > 0 && renderPieces()}
      </PiecesContainer>
    </PointContainer>
  );
};

export default Point; 