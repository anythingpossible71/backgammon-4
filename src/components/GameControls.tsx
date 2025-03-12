import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { GameState } from '../models/types';
import { rollDice } from '../utils/gameLogic';
import { encodeGameState } from '../utils/stateManager';

interface GameControlsProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onNewGame: () => void;
}

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${props => props.primary ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#6b3510' : '#e0e0e0'};
  }
  
  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const UrlContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const GameControls: React.FC<GameControlsProps> = ({ 
  gameState, 
  onUpdateGameState,
  onNewGame
}) => {
  const [gameUrl, setGameUrl] = useState<string>('');
  
  // Handle dice roll
  const handleRollDice = () => {
    if (!gameState.dice.rolled) {
      const newState = rollDice(gameState);
      onUpdateGameState(newState);
      
      // Update URL
      const encodedState = encodeGameState(newState);
      const newUrl = `${window.location.origin}${window.location.pathname}?state=${encodedState}`;
      setGameUrl(newUrl);
    }
  };
  
  // Handle URL copy
  const handleCopyUrl = () => {
    toast.success('Game URL copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 2000
    });
  };
  
  // Generate current game URL
  const generateGameUrl = () => {
    const encodedState = encodeGameState(gameState);
    const newUrl = `${window.location.origin}${window.location.pathname}?state=${encodedState}`;
    setGameUrl(newUrl);
    return newUrl;
  };
  
  return (
    <ControlsContainer>
      <ButtonsRow>
        <Button 
          primary 
          onClick={handleRollDice}
          disabled={gameState.dice.rolled}
        >
          Roll Dice
        </Button>
        
        <Button onClick={onNewGame}>
          New Game
        </Button>
        
        <Button onClick={generateGameUrl}>
          Generate URL
        </Button>
      </ButtonsRow>
      
      {gameUrl && (
        <UrlContainer>
          <UrlInput 
            type="text" 
            value={gameUrl} 
            readOnly 
          />
          <CopyToClipboard text={gameUrl} onCopy={handleCopyUrl}>
            <Button>Copy</Button>
          </CopyToClipboard>
        </UrlContainer>
      )}
      
      <div>
        <p>
          <strong>Current Player:</strong> {gameState.currentPlayer === 'WHITE' ? 'White' : 'Black'}
        </p>
        <p>
          <strong>Game ID:</strong> {gameState.gameId.substring(0, 8)}
        </p>
      </div>
    </ControlsContainer>
  );
};

export default GameControls; 