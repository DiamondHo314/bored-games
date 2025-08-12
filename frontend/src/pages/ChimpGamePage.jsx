import  { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { checkAuth } from "../components/checkAuth";

const BACKEND_URL = 'http://localhost:8080'; 
const GRID_ROWS = 4;
const GRID_COLS = 8;
const NUM_BUTTONS = 10;


function getRandomPositions() {
  const positions = new Set();
  while (positions.size < NUM_BUTTONS) {
    const pos = Math.floor(Math.random() * GRID_ROWS * GRID_COLS);
    positions.add(pos);
  }
  return Array.from(positions);
}

function ChimpGamePage() {
  const [buttonPositions, setButtonPositions] = useState([]);
  const [clickedOrder, setClickedOrder] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const timerRef = useRef();

  //checking if there is any user logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkUserAuth = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
    };
  checkUserAuth();
}, []);

  // Start/restart game
  const startGame = () => {
    setButtonPositions(getRandomPositions());
    setClickedOrder([]);
    setScore(null);
    setStartTime(Date.now());
    setGameActive(true);
  };

  // Handle button click
  const handleButtonClick = async (num) => {
    if (!gameActive) return;
    if (num === clickedOrder.length + 1) {
      const newOrder = [...clickedOrder, num];
      setClickedOrder(newOrder);
      // Remove the clicked button from the grid
      setButtonPositions((prev) => {
        const newPositions = [...prev];
        newPositions.splice(num - 1, 1, null);
        return newPositions;
      });
      if (newOrder.length === NUM_BUTTONS) {
        setGameActive(false);
        setScore(((Date.now() - startTime) / 1000).toFixed(2));
        if (isAuthenticated) {
            const res = await fetch(`${BACKEND_URL}/scores/chimp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials for session management
            body: JSON.stringify({ score: ((Date.now() - startTime) / 1000).toFixed(2) }), 
          });
          if (res.ok) {
            console.log("Score submitted successfully");
          } else {
            console.error("Failed to submit score");
          }
        }
      }
    } else {
      // Wrong order, restart
      startGame();
    }
  };

  // Start game on mount
  useEffect(() => {
    startGame();
    // eslint-disable-next-line
  }, []);

  // Timer update (for live display, optional)
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (gameActive) {
      timerRef.current = setInterval(() => {
        setElapsed(((Date.now() - startTime) / 1000).toFixed(2));
      }, 100);
    } else {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [gameActive, startTime]);

  // Render grid cells
  const gridCells = [];
  for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
    const btnIdx = buttonPositions.indexOf(i);
    gridCells.push(
      <div key={i} className="flex items-center justify-center">
        {btnIdx !== -1 && buttonPositions[btnIdx] !== null && gameActive && (
          <button
            className="w-14 h-14 rounded-full bg-yellow-400 text-xl font-bold flex items-center justify-center shadow hover:bg-yellow-500 transition"
            onClick={() => handleButtonClick(btnIdx + 1)}
          >
            {btnIdx + 1}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-4">Chimp Game</h1>
      <p className="text-lg mb-4 text-gray-700">
        Click the numbers in order from 1 to 10 as fast as you can!
      </p>
      <div className="absolute top-6 left-10 flex gap-4">
        <Link to="/">
            Back to Menu
        </Link>
      </div>
      <div
        className="grid mb-8 bg-white rounded-lg shadow-lg"
        style={{
          gridTemplateRows: `repeat(${GRID_ROWS}, 3.5rem)`,
          gridTemplateColumns: `repeat(${GRID_COLS}, 3.5rem)`,
          gap: "1rem",
          padding: "2rem",
        }}
      >
        {gridCells}
      </div>
      <div className="flex flex-col items-center mb-4">
        {gameActive ? (
          <span className="text-lg text-gray-600 mb-2">
            Time: {elapsed}s
          </span>
        ) : score !== null ? (
          <span className="text-2xl font-semibold text-green-600 mb-2">
            Score: {score} seconds!
          </span>
        ) : null}
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          onClick={startGame}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default ChimpGamePage;