import React from 'react';
import styled from 'styled-components';
import { GameVariant } from '../models/types';

interface VariantSelectorProps {
  onSelectVariant: (variant: GameVariant) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: var(--primary-color);
  margin-bottom: 2rem;
`;

const VariantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const VariantCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border: 2px solid var(--secondary-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
  }
`;

const VariantTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const VariantDescription = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StartButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #6b3510;
  }
`;

const VariantSelector: React.FC<VariantSelectorProps> = ({ onSelectVariant }) => {
  const variants: { 
    id: GameVariant; 
    name: string; 
    description: string 
  }[] = [
    {
      id: 'casual',
      name: 'Casual Backgammon',
      description: 'Standard backgammon rules without the doubling cube.'
    },
    {
      id: 'gulbara',
      name: 'Gul Bara',
      description: 'Also known as Rosespring or Crazy Narde. Different initial setup and movement patterns.'
    },
    {
      id: 'tapa',
      name: 'Tapa',
      description: 'A variant with unique rules and setup, where pieces move in the same direction.'
    }
  ];

  return (
    <Container>
      <Title>Select Game Variant</Title>
      <VariantsGrid>
        {variants.map((variant) => (
          <VariantCard key={variant.id} onClick={() => onSelectVariant(variant.id)}>
            <VariantTitle>{variant.name}</VariantTitle>
            <VariantDescription>{variant.description}</VariantDescription>
            <StartButton>Start Game</StartButton>
          </VariantCard>
        ))}
      </VariantsGrid>
    </Container>
  );
};

export default VariantSelector; 