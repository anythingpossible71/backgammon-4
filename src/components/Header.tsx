import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--primary-color);
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin: 0;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <div>
        <Title>Backgammon 4</Title>
        <Subtitle>A modern implementation with URL-based state sharing</Subtitle>
      </div>
    </HeaderContainer>
  );
};

export default Header; 