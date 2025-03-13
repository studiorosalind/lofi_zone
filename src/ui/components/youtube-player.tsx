"use client"

import { useEffect, useRef } from "react"

interface YoutubePlayerProps {
  playlistId: string
}

export default function YoutubePlayer({ playlistId }: YoutubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)

  // useEffect(() => {
  //   // Load YouTube API
  //   const tag = document.createElement("script")
  //   tag.src = "https://www.youtube.com/iframe_api"
  //   const firstScriptTag = document.getElementsByTagName("script")[0]
  //   firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

  //   // Initialize player when API is ready
  //   window.onYouTubeIframeAPIReady = () => {
  //     if (!playerRef.current) return

  //     playerInstanceRef.current = new (window as any).YT.Player(playerRef.current, {
  //       height: "0",
  //       width: "0",
  //       playerVars: {
  //         listType: "playlist",
  //         list: playlistId,
  //         autoplay: 1,
  //         controls: 0,
  //         showinfo: 0,
  //         loop: 1,
  //       },
  //       events: {
  //         onReady: (event: any) => {
  //           event.target.setVolume(70)
  //           event.target.playVideo()
  //         },
  //       },
  //     })
  //   }

  //   return () => {
  //     if (playerInstanceRef.current) {
  //       playerInstanceRef.current.destroy()
  //     }
  //     window.onYouTubeIframeAPIReady = null
  //   }
  // }, [])

  // Handle playlist change
  useEffect(() => {
    if (playerInstanceRef.current && playerInstanceRef.current.loadPlaylist) {
      playerInstanceRef.current.loadPlaylist({
        listType: "playlist",
        list: playlistId,
      })
    }
  }, [playlistId])

  return <div ref={playerRef} id="youtube-player" />
}

