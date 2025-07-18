import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlayerProfile() {
  const [playerName, setPlayerName] = useState('');
  const BACKEND_URL = 'http://localhost:8080'; 

  useEffect(() => {
    fetch(`${BACKEND_URL}/profile`, {
      credentials: 'include' //this is important to include user information in req.user
      //without this, req.user will be empty
    })
      .then(res => res.json())
      .then(data => setPlayerName(data.username || 'Unknown'))
      .catch(() => setPlayerName('Unknown'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-pink-400 to-red-400 font-mono">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 max-w-md w-full border-4 border-yellow-400 text-center">
        <h1 className="text-4xl font-extrabold text-pink-500 mb-6 tracking-wide flex items-center justify-center gap-2">
          <span role="img" aria-label="dice">🎲</span>
          Player Profile
          <span role="img" aria-label="controller">🎮</span>
        </h1>
        <p className="text-2xl text-gray-800 mb-2">
          <span className="font-bold">Name:</span>
          <span className="text-yellow-500 ml-2">{playerName}</span>
        </p>
      </div>
       <div className="absolute top-6 left-10 flex gap-4">
        <Link to="/">
            Back to Menu
        </Link>
      </div>
    </div>
  );
}

export default PlayerProfile;