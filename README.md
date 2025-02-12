# Maze Quest

**Maze Quest** is a modern, interactive maze game built with Next.js, Tailwind CSS, and the HTML5 Canvas API. The game features smooth player transitions, enhanced maze rendering with gradients and grid lines, and a dynamic fog-of-war effect that simulates limited visibility. Navigate the labyrinth using your arrow keys and guide your hero to the exit for an immersive gaming experience.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Maze Generation:**  
  Uses a recursive backtracking algorithm to generate challenging mazes.
- **Smooth Player Transitions:**  
  The hero smoothly glides between maze cells via animated interpolation.
- **Enhanced Maze Rendering:**  
  Maze walls feature a vertical gradient with subtle grid lines for added depth.
- **Dynamic Lighting (Fog-of-War):**  
  Only a portion of the maze around the hero is visible, creating tension and a sense of exploration.
- **Responsive UI:**  
  The interface is styled using Tailwind CSS to ensure a consistent experience across devices.
- **Manual Navigation:**  
  Move your hero using the arrow keys. Reach the green exit cell to win!

## Getting Started

### Prerequisites

- **Node.js** v16 or later
- **npm** (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/maze-quest.git
   cd maze-quest
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:3000 to start playing.

## Project Structure

- maze-quest/
- ├── app/
- │ ├── layout.jsx // Root layout with global CSS import
- │ ├── globals.css // Global Tailwind CSS styles
- │ ├── page.jsx // Homepage
- │ └── maze/
- │ └── page.jsx // Maze game page (manual navigation, animations, fog-of-war)
- ├── lib/
- │ └── maze.js // Maze generation and solving logic
- ├── tailwind.config.js // Tailwind CSS configuration
- ├── postcss.config.js // PostCSS configuration
- ├── package.json
- └── README.md

## Technologies Used

1. Next.js (App Router)
2. React
3. Tailwind CSS
4. HTML5 Canvas API
5. JavaScript

### Future Enhancements

- Sound Effects and Music:
  Integrate audio for player actions and background ambiance.
- Scoring System:
  Add a timer or move counter to track performance.
- Multiple Levels:
  Introduce mazes of increasing difficulty and new obstacles.
- Touch Controls:
  Implement swipe gestures for mobile navigation.
- Multiplayer or Leaderboard:
  Use a backend service or Firebase to enable high scores and competitive play.

### Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please follow the standard GitHub workflow for contributing to open-source projects.

## #License

This project is licensed under the MIT License.
