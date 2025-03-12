import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Piece } from '../models/types';

interface GamePieceProps {
  piece: Piece;
  onClick: () => void;
  style?: CSSProperties;
}

interface PieceStyledProps {
  pieceType: 'WHITE' | 'BLACK';
}

const PieceStyled = styled.div<PieceStyledProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.pieceType === 'WHITE' 
    ? 'var(--white-piece-color)' 
    : 'var(--black-piece-color)'
  };
  border: 2px solid ${props => props.pieceType === 'WHITE' 
    ? '#ccc' 
    : '#111'
  };
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const GamePiece: React.FC<GamePieceProps> = ({ piece, onClick, style }) => {
  return (
    <PieceStyled 
      pieceType={piece.type} 
      onClick={onClick}
      style={style}
    />
  );
};

export default GamePiece; 