import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = 'http://localhost:8080';

function TypingGamePage() {
  // Game states
  const [sentences, setSentences] = useState([]);
  const [gameState, setGameState] = useState("waiting"); // waiting | running | finished
  const [timerOption, setTimerOption] = useState(15); // 15 | 30 | 60
  const [timeLeft, setTimeLeft] = useState(timerOption);
  const [currentSentence, setCurrentSentence] = useState("");
  const [typed, setTyped] = useState("");
  const [correctWords, setCorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef(null);

  // Load sentences from assets/sentences.txt (fix fetch path and error handling)
  useEffect(() => {
    //I will just process the sentences in te backend 
    //and then get them using fetch
    const getSentences = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/sentences`);
        if (!response.ok) throw new Error("Failed to fetch sentences");
        const data = await response.json();
        setSentences(data);
      } catch (error) {
        console.error("Error loading sentences:", error);
      }
    }
    getSentences();
 }, []);

  // Reset timer when option changes
  useEffect(() => {
    setTimeLeft(timerOption);
  }, [timerOption]);

  // Timer logic
  useEffect(() => {
    if (gameState !== "running") return;
    if (timeLeft <= 0) {
      setGameState("finished");
      setShowResult(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  // Focus invisible input for key capture
  useEffect(() => {
    if (gameState === "running" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentSentence]);

  // Start game on any key press
  const handleStart = () => {
    setGameState("running");
    setTimeLeft(timerOption);
    setCorrectWords(0);
    setTotalWords(0);
    setShowResult(false);
    loadRandomSentence();
    setTyped("");
  };

  // Load a random sentence
  const loadRandomSentence = () => {
    if (sentences.length === 0) return;
    const idx = Math.floor(Math.random() * sentences.length);
    setCurrentSentence(sentences[idx]);
    setTyped("");
  };

  // Handle typing
  const handleKeyDown = (e) => {
    if (gameState === "waiting") {
      handleStart();
      return;
    }
    if (gameState !== "running") return; // doesn't let you type if you havent started the game
    if (!currentSentence) return; //doesn't let you type if there is no sentence loaded

    // Ignore non-character keys except Backspace
    if (e.key.length > 1 && e.key !== "Backspace") return;

    if (e.key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1)); 
      return;
    }

    // Prevent typing beyond sentence length
    if (typed.length >= currentSentence.length) return;

    setTyped((prev) => prev + e.key);
    console.log('typed letter:', typed)

    // If sentence finished
    if (typed.length + 1 === currentSentence.length) {
      // Check correctness
      let correct = true;
      let i = 1;
      while ( i < currentSentence.length+1) {
        if ((typed + e.key)[i] !== currentSentence[i]) {
          correct = false;
          break;
        }
        if (e.key === "Backspace") {
          i--;
          correct = true;
          continue;
        }
        i++;
      }
      setTotalWords((w) => w + currentSentence.trim().split(/\s+/).length);
      if (correct) {
        setCorrectWords((w) => w + currentSentence.trim().split(/\s+/).length); 
        // the "/\s+/" basically splits the sentence by whitespaces (spaces, tabs), regex  
      }
      setTimeout(() => {
        loadRandomSentence();
      }, 100);
    }
  };

  // WPM calculation
  const wpm = (correctWords / timerOption) * 60;

  //restart game
  const handleRestart = () => {
    setGameState("waiting");
    setTyped("");
    setCurrentSentence("");
    setShowResult(false);
    setTimeLeft(timerOption);
    setCorrectWords(0);
    setTotalWords(0);
  };

  // Render sentence with highlights
  const renderSentence = () => {
    return (
      <div className="text-2xl font-mono mb-4">
        {currentSentence.split("").map((char, idx) => {
          let color = "";
          if (typed[idx] == null) {
            color = "";
          //set char color to green if it is correct, red if it is incorrect
          }else if (typed[idx] === char){
            color = "text-green-600"; 
          }else {
            color = "text-red-600";
          }
            return (
            <span key={idx} className={color}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      tabIndex={0}
      className="min-h-screen bg-gray-700 font-mono"
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <div className="absolute top-6 left-10 flex gap-4 text-blue-300">
        <Link to="/">
            Back to Menu
        </Link>
      </div>
      {/* Heading at top center */}
      <div className="w-full pt-8 pb-2 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-center text-white">Typing Challenge</h1>
        <p className="text-lg mb-2 text-amber-200 text-center">
          Type the words as fast as you can!
        </p>
        {/* Timer buttons always visible below heading */}
        <div className="mb-4">
          <span className="mr-2 font-semibold text-white">Choose time:</span>
          {[15, 30, 60].map((opt) => ( // map through each timer option, short code
            <button
              key={opt}
              className={`px-3 py-1 mx-1 rounded ${
                timerOption === opt
                  ? "bg-yellow-400" // if selected set color to yellow
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setTimerOption(opt);
                handleRestart(); //reset game when timer option changes
              }}
            >
              {opt}s
            </button>
          ))}
        </div>
      </div>
      {/* Timer display */}
      {gameState !== "waiting" && (
        <div className="mt-5 text-center mb-2 text-xl font-semibold pl-4 text-red-400">
          Time left: {timeLeft}s
        </div>
      )}
      {/* Sentence display at top left */}
      <div className="text-center pl-4 pt-2 text-white">
        {gameState === "waiting" && (
          <div className="mt-5 mb-4 text-lg text-gray-200">
            Press any key to start!
          </div>
        )}
        {gameState === "running" && renderSentence()}
      </div>
      {/* Invisible input for key capture */}
      <input
        ref={inputRef}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        tabIndex={-1}
        value=""
        readOnly
      />
      {/* Result popup with dark, blurred overlay */}
      {showResult && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(30, 30, 30, 0.5)",
            backdropFilter: "blur(6px)"
          }}
        >
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <div className="text-3xl font-bold mb-2">Your WPM</div>
            <div className="text-5xl font-extrabold mb-4">{wpm}</div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TypingGamePage;