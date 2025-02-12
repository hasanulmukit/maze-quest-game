// app/maze/page.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { generateMaze } from "../../lib/maze";

const CELL_SIZE = 20; // Each cell is 20x20 pixels

export default function MazePage() {
  // Use gridPlayer for the discrete cell position and animPlayer for the smooth animated position.
  const [cols, setCols] = useState(31);
  const [rows, setRows] = useState(21);
  const [maze, setMaze] = useState([]);
  const [gridPlayer, setGridPlayer] = useState({ x: 1, y: 1 });
  const [animPlayer, setAnimPlayer] = useState({ x: 1, y: 1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const canvasRef = useRef(null);

  // Generate a new maze whenever the dimensions change (or on initial mount)
  useEffect(() => {
    const newMaze = generateMaze(cols, rows);
    setMaze(newMaze);
    setGridPlayer({ x: 1, y: 1 });
    setAnimPlayer({ x: 1, y: 1 });
    setGameWon(false);
    setIsAnimating(false);
  }, [cols, rows]);

  // Animate the player's movement from a start to an end grid coordinate.
  const animateMovement = useCallback(
    (start, end, duration = 200) => {
      setIsAnimating(true);
      const startTime = performance.now();
      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1);
        const newPos = {
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t,
        };
        setAnimPlayer(newPos);
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // At the end, update the grid position and reset animation flag.
          setGridPlayer(end);
          setAnimPlayer(end);
          setIsAnimating(false);
          if (end.x === cols - 2 && end.y === rows - 2) {
            setGameWon(true);
          }
        }
      }
      requestAnimationFrame(animate);
    },
    [cols, rows]
  );

  // Handle arrow key presses to trigger movement.
  const handleKeyDown = useCallback(
    (event) => {
      if (gameWon || isAnimating) return; // Ignore input if game is won or animating.
      const { key } = event;
      let newX = gridPlayer.x;
      let newY = gridPlayer.y;
      if (key === "ArrowUp") newY = gridPlayer.y - 1;
      else if (key === "ArrowDown") newY = gridPlayer.y + 1;
      else if (key === "ArrowLeft") newX = gridPlayer.x - 1;
      else if (key === "ArrowRight") newX = gridPlayer.x + 1;
      else return;

      // Ensure the new cell is within bounds and is a path.
      if (
        newX >= 0 &&
        newX < cols &&
        newY >= 0 &&
        newY < rows &&
        maze[newY] &&
        maze[newY][newX] === 0
      ) {
        animateMovement(gridPlayer, { x: newX, y: newY });
      }
    },
    [gridPlayer, maze, cols, rows, gameWon, isAnimating, animateMovement]
  );

  // Add keyboard listener.
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Draw the maze, finish cell, fog overlay, and animated player.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || maze.length === 0) return;
    const ctx = canvas.getContext("2d");
    canvas.width = cols * CELL_SIZE;
    canvas.height = rows * CELL_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a vertical gradient for the walls.
    const wallGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    wallGradient.addColorStop(0, "#2D3748");
    wallGradient.addColorStop(1, "#1A202C");

    // Draw each cell of the maze.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        ctx.fillStyle = maze[y][x] === 1 ? wallGradient : "#E5E7EB";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Draw subtle grid lines.
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(canvas.width, y * CELL_SIZE);
      ctx.stroke();
    }
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, canvas.height);
      ctx.stroke();
    }

    // Draw the finish cell (target) at (cols-2, rows-2)
    ctx.fillStyle = "#10B981";
    ctx.fillRect((cols - 2) * CELL_SIZE, (rows - 2) * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw fog overlay (simulate limited visibility).
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const playerCx = animPlayer.x * CELL_SIZE + CELL_SIZE / 2;
    const playerCy = animPlayer.y * CELL_SIZE + CELL_SIZE / 2;
    const visibleRadius = 3 * CELL_SIZE;
    // Create a radial gradient for a smooth edge to the visible area.
    const gradient = ctx.createRadialGradient(playerCx, playerCy, visibleRadius * 0.5, playerCx, playerCy, visibleRadius);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(playerCx, playerCy, visibleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw the player on top with a glow.
    ctx.save();
    ctx.shadowColor = "rgba(37, 99, 235, 0.7)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(playerCx, playerCy, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = "#2563EB";
    ctx.fill();
    ctx.restore();
  }, [maze, animPlayer, cols, rows]);

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-black">
      <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-md">Maze Quest</h1>
      <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl">
        Navigate the labyrinth with your arrow keys. Guide your hero (blue) to the exit (green). Beware of dead ends!
      </p>
      <div className="relative">
        <canvas ref={canvasRef} className="border-4 border-gray-700 rounded-lg shadow-2xl" />
      </div>
      {gameWon && (
        <div className="mt-6 p-4 bg-green-800 border border-green-600 text-green-200 rounded-lg shadow-lg text-center animate-pulse">
          <p className="font-bold text-2xl">Congratulations!</p>
          <p>You conquered the maze!</p>
        </div>
      )}
      <div className="mt-8 flex flex-wrap gap-6 justify-center">
        <button
          onClick={() => {
            const newMaze = generateMaze(cols, rows);
            setMaze(newMaze);
            setGridPlayer({ x: 1, y: 1 });
            setAnimPlayer({ x: 1, y: 1 });
            setGameWon(false);
            setIsAnimating(false);
          }}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          Generate New Maze
        </button>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <label className="text-gray-300 flex items-center space-x-3">
          <span className="font-medium">Columns:</span>
          <input
            type="number"
            min="11"
            step="2"
            value={cols}
            onChange={(e) => setCols(parseInt(e.target.value))}
            className="w-20 text-center bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="text-gray-300 flex items-center space-x-3">
          <span className="font-medium">Rows:</span>
          <input
            type="number"
            min="11"
            step="2"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value))}
            className="w-20 text-center bg-gray-800 text-white border border-gray-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <button
          onClick={() => {
            const newMaze = generateMaze(cols, rows);
            setMaze(newMaze);
            setGridPlayer({ x: 1, y: 1 });
            setAnimPlayer({ x: 1, y: 1 });
            setGameWon(false);
            setIsAnimating(false);
          }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          Update Maze Size
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>Use the arrow keys to move your hero through the maze.</p>
      </div>
    </main>
  );
}
