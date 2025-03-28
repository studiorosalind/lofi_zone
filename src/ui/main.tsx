/* eslint-disable @typescript-eslint/no-unused-vars */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { UserSessionProvider } from './context/UserSessionContext'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import TestPage from './pages/TestPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserSessionProvider>
      <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/test" element={<TestPage />} />
        </Routes>
      </HashRouter>
    </UserSessionProvider>
  </StrictMode>,
)
