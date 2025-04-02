/* eslint-disable @typescript-eslint/no-unused-vars */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { UserSessionProvider } from './context/UserSessionContext'
import { QuestProvider } from './context/QuestContext'
import { PlaylistProvider } from './context/PlaylistContext'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import TestPage from './pages/TestPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserSessionProvider>
      <QuestProvider>
        <PlaylistProvider>
          <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/test" element={<TestPage />} />
        </Routes>
          </HashRouter>
        </PlaylistProvider>
      </QuestProvider>
    </UserSessionProvider>
  </StrictMode>,
)
