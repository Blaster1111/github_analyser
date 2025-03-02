import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const SnakeGameLoader: React.FC = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const BOARD_WIDTH = GRID_SIZE;
  const BOARD_HEIGHT = GRID_SIZE;

  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(200);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const directionQueueRef = useRef<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const generateFood = (): { x: number; y: number } => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };

    const isOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );

    return isOnSnake ? generateFood() : newFood;
  };

  const resetGame = (): void => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(200);
    directionQueueRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      e.preventDefault();

      if (e.key === " ") {
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver && e.key !== " ") {
        resetGame();
        return;
      }

      const newDirection = (() => {
        switch (e.key.toLowerCase()) {
          case "arrowup":
          case "w":
            return direction !== "DOWN" ? "UP" : direction;
          case "arrowdown":
          case "s":
            return direction !== "UP" ? "DOWN" : direction;
          case "arrowleft":
          case "a":
            return direction !== "RIGHT" ? "LEFT" : direction;
          case "arrowright":
          case "d":
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

  useEffect(() => {
    if (boardRef.current) boardRef.current.focus();
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const gameLoop = (): void => {
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

  const updateGame = (): void => {
    if (directionQueueRef.current.length > 0) {
      setDirection(directionQueueRef.current.shift() as typeof direction);
    }

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

    if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT) {
      setGameOver(true);
      return;
    }

    if (snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      setSpeed((prev) => Math.max(70, prev - 5));
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const handleTouchStart = (newDirection: typeof direction): void => {
    if (gameOver) {
      resetGame();
      return;
    }

    const validMoves: Record<string, typeof direction> = {
      UP: direction !== "DOWN" ? "UP" : direction,
      DOWN: direction !== "UP" ? "DOWN" : direction,
      LEFT: direction !== "RIGHT" ? "LEFT" : direction,
      RIGHT: direction !== "LEFT" ? "RIGHT" : direction,
    };

    if (validMoves[newDirection] && validMoves[newDirection] !== direction) {
      directionQueueRef.current = [validMoves[newDirection]]; // Replace queue instead of pushing
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center touch-none">
        <h3 className="text-xl font-bold text-green-300 mb-2">Loading...</h3>
        <p className="text-gray-300 mb-4">
          Play Snake while waiting! Use arrow keys or WASD to control (Space to pause)
        </p>

        <div
          ref={boardRef}
          tabIndex={0}
          className="relative bg-gray-800 border-2 border-gray-700 focus:outline-none touch-none"
          style={{
            width: BOARD_WIDTH * CELL_SIZE,
            height: BOARD_HEIGHT * CELL_SIZE,
            userSelect: "none",
          }}
        >
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: food.x * CELL_SIZE + 1,
              top: food.y * CELL_SIZE + 1,
            }}
          />

          {snake.map((segment, index) => (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${index === 0 ? "bg-green-400" : "bg-green-500"} rounded-sm`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1,
              }}
            />
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <h2 className="text-white text-xl font-bold mb-2">Game Over</h2>
              <p className="text-white mb-4">Score: {score}</p>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={resetGame}
                onTouchStart={resetGame}
              >
                Play Again
              </button>
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <h2 className="text-white text-xl font-bold">Paused</h2>
            </div>
          )}
        </div>

        <div className="text-white mt-2">Score: {score}</div>

        <div className="flex flex-col items-center mt-4 touch-none select-none">
          <button
            className="w-16 h-12 bg-gray-700 text-white mb-2 rounded touch-none"
            onTouchStart={() => handleTouchStart("UP")}
          >
            ↑
          </button>
          <div className="flex justify-center">
            <button
              className="w-16 h-12 bg-gray-700 text-white mx-2 rounded touch-none"
              onTouchStart={() => handleTouchStart("LEFT")}
            >
              ←
            </button>
            <button
              className="w-16 h-12 bg-gray-700 text-white mx-2 rounded touch-none"
              onTouchStart={() => handleTouchStart("RIGHT")}
            >
              →
            </button>
          </div>
          <button
            className="w-16 h-12 bg-gray-700 text-white mt-2 rounded touch-none"
            onTouchStart={() => handleTouchStart("DOWN")}
          >
            ↓
          </button>
          <button
            className="w-24 h-12 bg-gray-700 text-white mt-4 rounded touch-none"
            onTouchStart={() => setIsPaused((prev) => !prev)}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};