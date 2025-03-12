# Backgammon 4

A modern implementation of the classic backgammon game with URL-based state sharing.

## Overview

This project implements a complete backgammon game with multiple rule variants. The game uses a unique URL-based state sharing approach, allowing players to share their game state via URL without requiring a persistent server connection.

## Features

- Multiple backgammon variants (Casual, Gul Bara, Tapa)
- Complete game rules implementation
- URL-based state sharing for multiplayer functionality
- Responsive design for desktop and mobile play
- No account required - just share the URL to play with friends
- Optional state persistence for game history

## How to Play

1. Create a new game by selecting a variant
2. Share the generated URL with your opponent
3. Take turns making moves and sharing the updated URL
4. The complete game state is encoded in the URL, so no server is required for gameplay

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anythingpossible71/backgammon-4.git

# Navigate to the project directory
cd backgammon-4

# Install dependencies
npm install

# Start the development server
npm start
```

## Game Variants

### Casual Backgammon
Standard backgammon rules without the doubling cube.

### Gul Bara (Rosespring/Crazy Narde)
A variant with different initial setup and movement patterns.

### Tapa
Another variant with unique rules and setup.

## Technical Details

The game uses a URL-based state sharing approach:
- Complete game state is encoded in URL parameters
- Efficient compression to minimize URL length
- No server required for core gameplay
- Optional server component for state persistence

## License

[License information to be determined] 