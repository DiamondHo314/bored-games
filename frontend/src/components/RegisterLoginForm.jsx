import React, { useState } from 'react'; 
import { Navigate, useNavigate } from 'react-router-dom';

function RegisterLoginForm({ headingText, ...props }) {
  let footerText = "Don't have an account? ";
  let footerLink = "/register";
  let footerAction = "Register";
  if (props.isRegisterPage) {
   footerText = "Back to "; 
   footerLink = "/login";
   footerAction = "login";
  }

  const BACKEND_URL = 'http://localhost:8080'; 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("")
    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      console.log("Registration successful");
      // Redirect to the home page or login page
      navigate("/login"); // Use Navigate to redirect
    } else {
      setErrorMsg("Registration failed. Please try again.");
      console.error("Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("")
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials for session management
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      //console.log("Login successful");
      // Redirect to the player profile or home page
      navigate("/profile"); // Use Navigate to redirect
    } else {
      setErrorMsg("Login failed. Please check your credentials.");
      console.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
      
      <div className="w-96 bg-white rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
        
        <form className="space-y-7"  onSubmit={ (e) =>
          {
            if (props.isRegisterPage) {
            handleRegister(e);
          } else {
            handleLogin(e);
          }
        }
        }>
        
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-5">
          {headingText || "Login"}
          </h1>
          {errorMsg && (
          <div className="text-red-500 text-center mb-4">
            {errorMsg}
          </div>
        )}
          <div>
            <label className="block text-blue-700 font-bold mb-2 tracking-wide">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border-2 border-pink-300 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-pink-50 text-lg transition"
              autoComplete="username"
              required
              onChange={(e) => setUsername(e.target.value)} // Handle username input
            />
          </div>
          <div>
            <label className="block text-blue-700 font-bold mb-2 tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border-2 border-pink-300 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-pink-50 text-lg transition"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} // Handle password input}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 text-white py-3 rounded-full font-extrabold text-lg shadow-md hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200"
          >
            Let's Play!
          </button>
        </form>
          <div className="mt-8 text-center">
            <span className="text-blue-600 font-semibold">{footerText}</span>
            <a
              href={footerLink}
              className="text-pink-500 hover:underline font-bold"
            >
            {footerAction}
            </a>
          </div>
        </div>
    </div>
  );
}

export default RegisterLoginForm;