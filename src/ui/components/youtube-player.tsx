"use client"

import { useRef, useEffect, useState } from "react"
import { Volume2, Play, Pause, SkipForward, SkipBack } from "lucide-react"
import NowPlayingDisplay from "./playlist/now-playing-display"
import { usePlaylist } from "../context/PlaylistContext"

const VOLUME_LEVELS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // 🎚 Defines how many "battery bars" exist

export default function YouTubeAudioPlayer() {
  const { 
    currentTrack, 
    nextTrack: goToNextTrack, 
    prevTrack: goToPrevTrack 
  } = usePlaylist();
  
  const [isPlaying, setIsPlaying] = useState(true) // ✅ Starts playing automatically
  const [volume, setVolume] = useState(50) // ✅ Default volume at 50%
  const [playerReady, setPlayerReady] = useState(false)
  const playerRef = useRef<YT.Player | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  
  // ✅ Load YouTube API on mount
  useEffect(() => {    
    if (!currentTrack) return;
    
    if (window.YT && window.YT.Player) {
      initializePlayer()
      return
    }

    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = initializePlayer

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [currentTrack])

  // ✅ Initialize player when API is ready
  const initializePlayer = () => {
    if (!playerContainerRef.current || !currentTrack) return

    if (playerRef.current) {
      playerRef.current.destroy() // Remove old player
    }

    playerContainerRef.current.innerHTML = ""

    const playerDiv = document.createElement("div")
    playerDiv.id = "youtube-player"
    playerContainerRef.current.appendChild(playerDiv)

    try {
      playerRef.current = new YT.Player("youtube-player", {
        videoId: currentTrack.id,
        height: "0", // ✅ Hide the video
        width: "0", // ✅ Hide the video
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume)
            setPlayerReady(true)
            setIsPlaying(true) // ✅ Autoplay
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === YT.PlayerState.PAUSED) {
              setIsPlaying(false)
            }
          },
        },
      })
    } catch (err) {
      console.error("Error initializing YouTube player:", err)
    }
  }

  // ✅ Set Volume when clicking bars
  const handleVolumeClick = (level: number) => {
    setVolume(level)
  }
    
  // ✅ Handle volume change
  useEffect(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(volume)
    }
  }, [volume, playerReady])

  // ✅ Play/Pause Button Logic
  const togglePlayPause = () => {
    if (!playerRef.current || !playerReady) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  return (
    <div className="bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-lg flex flex-col items-center gap-2">
      <NowPlayingDisplay />
      <div className="text-white rounded-lg flex items-center gap-4">
        {/* Previous Track Button */}
        <button onClick={goToPrevTrack} className="hover:scale-110 transition-transform">
          <SkipBack className="h-6 w-6" />
        </button>

        {/* Play/Pause Button */}
        <button onClick={togglePlayPause} className="hover:scale-110 transition-transform">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>

        {/* Next Track Button */}
        <button onClick={goToNextTrack} className="hover:scale-110 transition-transform">
          <SkipForward className="h-6 w-6" />
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 ml-4">
          <Volume2 className="h-5 w-5" />
          <div className="flex space-x-1">
            {VOLUME_LEVELS.map((level) => (
              <div
                key={level}
                className={`h-3 w-1 rounded-sm transition-all cursor-pointer ${
                  volume >= level ? "bg-green-500" : "bg-gray-600 opacity-50"
                } hover:opacity-100`}
                onClick={() => handleVolumeClick(level)}
              />
            ))}
          </div>
        </div>

        {/* Hidden YouTube Player */}
        <div ref={playerContainerRef} className="hidden"></div>
      </div>
    </div>
  )
}
