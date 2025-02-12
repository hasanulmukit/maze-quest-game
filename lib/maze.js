// lib/maze.js

// Utility to create a 2D array
export function create2DArray(rows, cols, initialValue = 0) {
    return Array.from({ length: rows }, () => Array(cols).fill(initialValue));
  }
  
  // Directions for maze movement: [dx, dy]
  export const DIRECTIONS = [
    [0, -1], // up
    [1, 0],  // right
    [0, 1],  // down
    [-1, 0], // left
  ];
  
  // Maze generation using recursive backtracking
  export function generateMaze(width, height) {
    // Initialize maze with walls (1 = wall, 0 = path)
    const maze = create2DArray(height, width, 1);
  
    // Helper to check valid cell indices
    function inBounds(x, y) {
      return x >= 0 && y >= 0 && x < width && y < height;
    }
  
    // Recursive backtracking algorithm
    function carve(x, y) {
      maze[y][x] = 0; // mark as path
  
      // Shuffle directions for randomness
      const dirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
      for (const [dx, dy] of dirs) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (inBounds(nx, ny) && maze[ny][nx] === 1) {
          // Carve the wall between cells
          maze[y + dy][x + dx] = 0;
          carve(nx, ny);
        }
      }
    }
  
    // Start carving from (1,1) (ensure odd dimensions for best results)
    carve(1, 1);
  
    return maze;
  }
  
  // (Optional) Maze solving using Breadth-First Search (BFS) to find the shortest path
  export function solveMaze(maze, start, end) {
    const height = maze.length;
    const width = maze[0].length;
    const queue = [start];
    const visited = create2DArray(height, width, false);
    const prev = create2DArray(height, width, null);
  
    visited[start.y][start.x] = true;
  
    while (queue.length > 0) {
      const { x, y } = queue.shift();
  
      // Found the end?
      if (x === end.x && y === end.y) break;
  
      for (const [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < width &&
          ny < height &&
          maze[ny][nx] === 0 &&
          !visited[ny][nx]
        ) {
          visited[ny][nx] = true;
          prev[ny][nx] = { x, y };
          queue.push({ x: nx, y: ny });
        }
      }
    }
  
    // Reconstruct path
    const path = [];
    let curr = end;
    while (curr && (curr.x !== start.x || curr.y !== start.y)) {
      path.push(curr);
      curr = prev[curr.y][curr.x];
    }
    if (curr) path.push(start);
    return path.reverse();
  }
  
  // (Optional) Maze solving with step-by-step animation using a generator (BFS)
  export function* solveMazeAnimated(maze, start, end) {
    const height = maze.length;
    const width = maze[0].length;
    const queue = [start];
    const visited = create2DArray(height, width, false);
    const prev = create2DArray(height, width, null);
  
    visited[start.y][start.x] = true;
  
    while (queue.length > 0) {
      const { x, y } = queue.shift();
      yield { x, y, type: "visit" }; // yield visited cell
  
      if (x === end.x && y === end.y) break;
  
      for (const [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < width &&
          ny < height &&
          maze[ny][nx] === 0 &&
          !visited[ny][nx]
        ) {
          visited[ny][nx] = true;
          prev[ny][nx] = { x, y };
          queue.push({ x: nx, y: ny });
        }
      }
    }
  
    // Reconstruct path
    const path = [];
    let curr = end;
    while (curr && (curr.x !== start.x || curr.y !== start.y)) {
      path.push(curr);
      curr = prev[curr.y][curr.x];
    }
    if (curr) path.push(start);
    yield { type: "path", path: path.reverse() };
  }
  