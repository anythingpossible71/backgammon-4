import React from 'react';
import styled from 'styled-components';
import { Piece, PlayerType } from '../models/types';
import GamePiece from './GamePiece';

interface HomeProps {
  playerType: PlayerType;
  pieces: Piece[];
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--secondary-color);
  border-left: 2px solid var(--primary-color);
  position: relative;
`;

const PiecesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  max-width: 100%;
  padding: 5px;
`;

const PieceCount = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
`;

const Home: React.FC<HomeProps> = ({ playerType, pieces }) => {
  // Render pieces in the home area
  const renderPieces = () => {
    // Limit visible pieces to 10, with a counter for the total
    const visiblePieces = pieces.slice(0, 10);
    
    return (
      <>
        {visiblePieces.map((piece) => (
          <GamePiece 
            key={piece.id}
            piece={piece}
            onClick={() => {}} // No action when clicking pieces in home
            style={{ width: '20px', height: '20px' }}
          />
        ))}
      </>
    );
  };
  
  return (
    <HomeContainer>
      {pieces.length > 0 && (
        <>
          <PiecesContainer>
            {renderPieces()}
          </PiecesContainer>
          <PieceCount>{pieces.length}</PieceCount>
        </>
      )}
    </HomeContainer>
  );
};

export default Home; 