import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { checkAuth } from "../components/checkAuth";
import { correctCounter, postTypingGameScore, postWrongWords, aiGenerateSentence } from "../components/typFunctions";
import { LoadingScreen } from "../components/LoadingScreen";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wrongWords, setWrongWords] = useState([]);
  const [aiEnabledText, setAiEnabledText] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [weakLetters, setWeakLetters] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    async function checkUserAuth() {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
    }
    checkUserAuth();
  }, []);

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
    if (aiEnabledText !== "") {
      console.log("AI mode enabled, setting weak letters");
    } else {
      console.log("AI mode disabled");
    }
    if (timeLeft <= 0) {
      if (currentSentence && typed.length > 0) {
      const typedWords = typed.trim().split(/\s+/);
      const sentenceWords = currentSentence.trim().split(/\s+/);

      const correctCount = correctCounter(typedWords, sentenceWords)[0];

      setCorrectWords((w) => w + correctCount);
      setTotalWords((w) => w + sentenceWords.length);

      //setShowResult(true); // idfk the results weren't showing up in some cases idfk i hate this
    }
    setGameState("finished");
    setShowResult(true);
    return;
    //setShowResult(true);
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
    if(aiEnabledText !== "") {
      setWeakLetters(sentences[0]) //because i told the ai to give the users weak letters in the first sentence
    }
    if (sentences.length === 0) return;
    const idx = Math.floor(Math.random() * sentences.length);
    if(idx === 0){
      setCurrentSentence("skibidi sigma will tax your mom rizzler of oz huge gyatt sybau ts pmo")
    } else setCurrentSentence(sentences[idx]);
    setTyped("");
  };

  // set sentence to ai generated one when user clicks ai coach
  const handleAiCoach = async () => {
    setAiEnabledText("AI generated custom sentences")
    setIsLoadingAi(true);
    handleRestart();
    try {
      const response = await aiGenerateSentence();
      if (response && response.length > 0) {
        setSentences(response); // Set the first AI-generated sentence
        console.log("AI sentences loaded:", response);
      }
    } catch (error) {
      console.error("Error generating AI sentence:", error);
    } finally {
      setIsLoadingAi(false);
    }
  }

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
    //console.log('typed letter:', typed)
    // typed proceeds like:
    // typed letter: T
    // typed letter: Th
    // typed letter: The

    // If sentence finished
    if (typed.length + 1 === currentSentence.length || gameState === "finished") {
      // Split both typed and original sentences into an array of words
      const typedWords = (typed + e.key).trim().split(/\s+/);
      const sentenceWords = currentSentence.trim().split(/\s+/);

      // Count correct words
      const correctCount = correctCounter(typedWords, sentenceWords);

      console.log(correctCount[1])
      setWrongWords((w) => [...w, ...correctCount[1]]);
      
      setCorrectWords((w) => w + correctCount[0]);
      setTotalWords((w) => w + sentenceWords.length);
      
      setTimeout(() => {
        loadRandomSentence();
      }, 100);
    }
  }


  // WPM calculation (always integer)
  const wpm = Math.floor((correctWords / timerOption) * 60);
  // Accuracy calculation (percentage, avoid division by zero)
  const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;

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

  const handleRefreshPage = () => {
    window.location.reload();
  }

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

  //post the score once a game is finished only if a user is logged in
  useEffect(() => {
    if (gameState === "finished") {
      if (isAuthenticated) {
        console.log(wrongWords)
        postTypingGameScore(timerOption, wpm, accuracy)
        postWrongWords(wrongWords)
        .then(() => {
          console.log("Typing game score and wrong words posted successfully");
        })
        .catch((error) => {
          console.error("Error posting typing game score:", error);
        });
      }
    }
  }, [gameState, isAuthenticated, timerOption, wpm, accuracy, wrongWords]);
  

  return (
    <div
      tabIndex={0}
      className="min-h-screen bg-gray-700 font-mono"
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <div className="absolute top-6 left-10 flex gap-4 text-blue-300">
        <Link to="/">
          <button className="bg-blue-800  text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-900 transition cursor-pointer">
            Back to Menu
          </button>
        </Link>
      </div>
      {isLoadingAi && <LoadingScreen />}
      {(aiEnabledText !== "") && (
      <div className="absolute top-6 right-10 flex gap-4">
        <button
          className="bg-green-900 text-white font-mono font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-950 cursor-pointer"
          onClick={handleRefreshPage}
          >Disable AI mode</button>
      </div>
      )}
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
            Press any key to start {aiEnabledText}!
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
      <div className="absolute text-center bottom-25 left-1/2 transform -translate-x-1/2">
        <p className="text-lg text-white">{weakLetters}</p>
      </div>
      {isAuthenticated && (
        <div className="absolute text-center bottom-10 left-1/2 transform -translate-x-1/2">
          <button
            className="bg-yellow-400 bg-opacity-30 font-mono font-semibold px-4 py-2 rounded-lg shadow hover:bg-yellow-500 cursor-pointer"
            onClick={handleAiCoach}
          >🤖 custom sentences made by AI coach mode</button>
        </div>
      )}
      {/* Result popup with dark, blurred overlay */}
      {showResult && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(30, 30, 30, 0.5)",
            backdropFilter: "blur(6px)"
          }}
        >
          <div className="bg-white rounded-lg p-8 shadow-lg text-center relative">
            {/* Move the close button to the top right */}
            <button
              onClick={handleRestart}
              className="absolute top-2 right-2 font-bold cursor-pointer hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-3xl font-bold mb-2">Your WPM</div>
            <div className="text-5xl font-extrabold mb-4">{wpm}</div>
            <div className="text-xl font-semibold mb-2 text-gray-700">
              Accuracy: {accuracy}%
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}


export default TypingGamePage;