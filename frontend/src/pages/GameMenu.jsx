import GameTitle from '../components/GameTitle';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function GameMenu() {
  const BACKEND_URL = 'http://localhost:8080';
  const [profileOrLogin, setProfileOrLogin] = useState("Login");
  const [profileLink, setProfileLink] = useState("/login");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/login/checkAuth`, {
          credentials: 'include',
        });
        console.log('Authentication check response:', res);
        if (res.ok) {
          setProfileOrLogin("Profile");
          setProfileLink("/profile");
        } else {
          setProfileOrLogin("Login");
          setProfileLink("/login");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)',
        color: 'white',
      }}
    >
      <div className="absolute top-6 right-10 flex gap-4">
        <Link
          to={profileLink}
          className="bg-white bg-opacity-30 text-pink-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-opacity-50 transition"
        >
          {profileOrLogin}
        </Link>
        {profileOrLogin === "Login" && (
          <Link
            to='/register'
            className="bg-white bg-opacity-30 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-opacity-50 transition"
          >
          Register 
          </Link>
        )}
      </div>
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Game Menu</h1>
      <p className="mb-8 text-lg font-medium drop-shadow">
        Welcome to the game menu. Please select an option to continue.
      </p>
      <div className="flex gap-8">
          <GameTitle gameName="chimp-game" />
          <GameTitle  gameName="typing-game"/>
          <GameTitle  />
      </div>
    </div>
  );
}

export default GameMenu;