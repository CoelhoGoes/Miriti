import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GameProvider, readSavedAccessibilityMode, syncColorblindBodyMode } from './context/GameContext.jsx'
import './index.css'

syncColorblindBodyMode(readSavedAccessibilityMode())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
)
