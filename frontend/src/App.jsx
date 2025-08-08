import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GameMenu from './pages/GameMenu'
import PlayerProfile from './pages/PlayerProfile'
import ChimpGamePage from './pages/ChimpGamePage'
import NotFoundPage from './pages/NotFoundPage'
import TypingGamePage from './pages/TypingGamePage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<GameMenu />} />
      <Route path="/profile" element={<PlayerProfile />} />
      <Route path="/chimp-game" element={<ChimpGamePage />} />
      <Route path="/typing-game" element={<TypingGamePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
