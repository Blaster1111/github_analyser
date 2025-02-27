import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const SnakeGameLoader: React.FC = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const BOARD_WIDTH = GRID_SIZE;
  const BOARD_HEIGHT = GRID_SIZE;
  
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const directionQueueRef = useRef<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const [speed, setSpeed] = useState(200); 

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT)
    };
    
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      return generateFood();
    }
    
    return newFood;
  };
  
  // Reset game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(200);
    directionQueueRef.current = [];
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      // Space key pauses/resumes the game
      if (e.key === " ") {
        setIsPaused(prev => !prev);
        return;
      }
      
      // If game is over, any key restarts
      if (gameOver && e.key !== " ") {
        resetGame();
        return;
      }
      
      // Direction queue to handle rapid key presses
      const newDirection = (() => {
        switch (e.key) {
          case "ArrowUp":
            return direction !== "DOWN" ? "UP" : direction;
          case "ArrowDown":
            return direction !== "UP" ? "DOWN" : direction;
          case "ArrowLeft":
            return direction !== "RIGHT" ? "LEFT" : direction;
          case "ArrowRight":
            return direction !== "LEFT" ? "RIGHT" : direction;
          default:
            return null;
        }
      })();
      
      if (newDirection && newDirection !== direction) {
        directionQueueRef.current.push(newDirection);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [direction, gameOver]);
  
  // Focus the game board on initial render
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.focus();
    }
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const gameLoop = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTimeRef.current;
      
      if (elapsed > speed) {
        lastUpdateTimeRef.current = now;
        updateGame();
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [snake, food, direction, gameOver, isPaused, speed]);
  
  // Update game state
  const updateGame = () => {
    // Process direction queue
    if (directionQueueRef.current.length > 0) {
      const nextDirection = directionQueueRef.current.shift() as any;
      setDirection(nextDirection);
    }
  
    // Move snake
    const head = { ...snake[0] };
  
    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }
  
    // Check if snake is outside the grid (boundary collision)
    if (
      head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT
    ) {
      setGameOver(true);
      return;
    }
  
    // Check self collision
    const selfCollision = snake.slice(1).some(
      segment => segment.x === head.x && segment.y === head.y
    );
  
    if (selfCollision) {
      setGameOver(true);
      return;
    }
  
    // Create new snake array
    const newSnake = [head, ...snake];
  
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      setScore(prev => prev + 1);
  
      // Speed up slightly (min 70ms)
      setSpeed(prev => Math.max(70, prev - 5));
  
      // Generate new food
      setFood(generateFood());
    } else {
      // Remove tail if no food was eaten
      newSnake.pop();
    }
  
    setSnake(newSnake);
  };
  
  
  // Handle touch controls for mobile
  const handleTouchStart = (direction: string) => {
    if (gameOver) {
      resetGame();
      return;
    }
    
    const validMoves: Record<string, string> = {
      UP: direction !== "DOWN" ? "UP" : direction,
      DOWN: direction !== "UP" ? "DOWN" : direction,
      LEFT: direction !== "RIGHT" ? "LEFT" : direction,
      RIGHT: direction !== "LEFT" ? "RIGHT" : direction
    };
    
    if (validMoves[direction] && validMoves[direction] !== direction) {
      directionQueueRef.current.push(validMoves[direction]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-green-300 mb-2">Loading...</h3>
        <p className="text-gray-300 mb-4">
          Play Snake while waiting! Use arrow keys to control.
        </p>
        
        {/* Game board */}
        <div 
          ref={boardRef}
          tabIndex={0}
          className="relative bg-gray-800 border-2 border-gray-700 focus:outline-none"
          style={{ 
            width: BOARD_WIDTH * CELL_SIZE, 
            height: BOARD_HEIGHT * CELL_SIZE,
          }}
        >
          {/* Food */}
          <div 
            className="absolute bg-red-500 rounded-full"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: food.x * CELL_SIZE + 1,
              top: food.y * CELL_SIZE + 1,
            }}
          />
          
          {/* Snake */}
          {snake.map((segment, index) => (
            <div 
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${index === 0 ? 'bg-green-400' : 'bg-green-500'} rounded-sm`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1,
              }}
            />
          ))}
          
          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <h2 className="text-white text-xl font-bold mb-2">Game Over</h2>
              <p className="text-white mb-4">Score: {score}</p>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          )}

          {/* Pause overlay */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <h2 className="text-white text-xl font-bold">Paused</h2>
            </div>
          )}
        </div>
        
        {/* Score */}
        <div className="text-white mt-2">
          Score: {score}
        </div>
        
        {/* Touch controls for mobile */}
        <div className="flex flex-col items-center mt-4 md:hidden">
          <button 
            className="w-16 h-12 bg-gray-700 text-white mb-2 rounded"
            onClick={() => handleTouchStart("UP")}
          >
            ↑
          </button>
          <div className="flex justify-center">
            <button 
              className="w-16 h-12 bg-gray-700 text-white mx-2 rounded"
              onClick={() => handleTouchStart("LEFT")}
            >
              ←
            </button>
            <button 
              className="w-16 h-12 bg-gray-700 text-white mx-2 rounded"
              onClick={() => handleTouchStart("RIGHT")}
            >
              →
            </button>
          </div>
          <button 
            className="w-16 h-12 bg-gray-700 text-white mt-2 rounded"
            onClick={() => handleTouchStart("DOWN")}
          >
            ↓
          </button>
          <button 
            className="w-24 h-12 bg-gray-700 text-white mt-4 rounded"
            onClick={() => setIsPaused(prev => !prev)}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};