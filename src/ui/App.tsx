/* eslint-disable @typescript-eslint/no-unused-vars */
'client'

import { useState, useEffect } from "react";
import YoutubePlayer from "./components/youtube-player";
import TopRightWidget from "./components/top-right-widget";
import QuestsPopup from "./components/popups/quests-popup";
import PomodoroPopup from "./components/popups/pomodoro-popup";
import ThemePopup from "./components/popups/theme-popup";
import PlaylistsPopup from "./components/popups/playlists-popup";
import AmbientPopup from "./components/popups/ambient-popup";
import BackgroundSelector from "./components/background-selector";
import Dock from "./components/dock";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentBackground, setCurrentBackground] = useState("cyberpunk-city")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activePopup, setActivePopup] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPlaylist, setCurrentPlaylist] = useState("PLhK5MCJLYPpcXgj7BI009xIrcLg8rZ2Jl")

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDockItemClick = (item: string) => {
    setActivePopup(activePopup === item ? null : item)
  }

  const backgrounds = {
    "cyberpunk-city": "url('/placeholder.svg?height=1080&width=1920')",
    "lofi-cafe": "url('/placeholder.svg?height=1080&width=1920')",
    "rainy-window": "url('/placeholder.svg?height=1080&width=1920')",
    "night-sky": "url('/placeholder.svg?height=1080&width=1920')",
    "sunset-beach": "url('/placeholder.svg?height=1080&width=1920')",
  }

  return (
    <>
      <main
      className="relative h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXRxdWN4cmZnaHRucmk0aGQ5bmJzcmw3ZW0zajAyajRuOHduYnozciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XbJYBCi69nyVOffLIU/giphy.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Semi-transparent overlay for better visibility of controls */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* YouTube Player (hidden visually but audio plays) */}
      <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden">
        <YoutubePlayer playlistId={currentPlaylist} />
      </div>

      {/* Top-right widget */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-4">
        <TopRightWidget />
        <button
          onClick={toggleFullScreen}
          className="text-white bg-black/30 hover:bg-black/40 rounded-md p-2 backdrop-blur-md transition-colors"
        >
          {isFullScreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Popups */}
      {activePopup === "quests" && <QuestsPopup onClose={() => setActivePopup(null)} />}
      {activePopup === "pomodoro" && <PomodoroPopup onClose={() => setActivePopup(null)} />}
      {activePopup === "theme" && (
        <ThemePopup onClose={() => setActivePopup(null)} onBackgroundSelect={() => setShowBackgroundSelector(true)} />
      )}
      {activePopup === "playlists" && (
        <PlaylistsPopup
          onClose={() => setActivePopup(null)}
          onPlaylistSelect={(id) => setCurrentPlaylist(id)}
          currentPlaylist={currentPlaylist}
        />
      )}
      {activePopup === "ambient" && <AmbientPopup onClose={() => setActivePopup(null)} />}

      {/* Background selector */}
      {showBackgroundSelector && (
        <BackgroundSelector
          backgrounds={Object.keys(backgrounds)}
          currentBackground={currentBackground}
          onSelect={(bg) => {
            setCurrentBackground(bg)
            setShowBackgroundSelector(false)
          }}
          onClose={() => setShowBackgroundSelector(false)}
        />
      )}

      {/* Bottom macOS style dock */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Dock onItemClick={handleDockItemClick} activeItem={activePopup} />
      </div>
    </main>
    </>
  )
}

export default App
