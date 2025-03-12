import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Header from './components/Header';
import VariantSelector from './components/VariantSelector';
import { GameState, GameVariant, PlayerType } from './models/types';
import { decodeGameState, encodeGameState, generateInitialState } from './utils/stateManager';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<GameVariant>('casual');
  const [isNewGame, setIsNewGame] = useState(true);

  // On initial load, try to parse game state from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');
    
    if (stateParam) {
      try {
        const decodedState = decodeGameState(stateParam);
        setGameState(decodedState);
        setSelectedVariant(decodedState.variant);
        setIsNewGame(false);
      } catch (error) {
        console.error('Failed to decode game state from URL:', error);
        // If decoding fails, we'll show the variant selector
        setIsNewGame(true);
      }
    } else {
      setIsNewGame(true);
    }
  }, []);

  // Update URL when game state changes
  useEffect(() => {
    if (gameState && !isNewGame) {
      const encodedState = encodeGameState(gameState);
      const newUrl = `${window.location.pathname}?state=${encodedState}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, [gameState, isNewGame]);

  const handleStartGame = (variant: GameVariant) => {
    const initialState = generateInitialState(variant);
    setGameState(initialState);
    setSelectedVariant(variant);
    setIsNewGame(false);
  };

  const updateGameState = (newState: GameState) => {
    setGameState(newState);
  };

  return (
    <AppContainer>
      <Header />
      
      {isNewGame ? (
        <VariantSelector onSelectVariant={handleStartGame} />
      ) : (
        gameState && (
          <>
            <GameBoard 
              gameState={gameState} 
              onUpdateGameState={updateGameState} 
            />
            <GameControls 
              gameState={gameState}
              onUpdateGameState={updateGameState}
              onNewGame={() => setIsNewGame(true)}
            />
          </>
        )
      )}
      
      <ToastContainer position="bottom-right" />
    </AppContainer>
  );
};

export default App; 