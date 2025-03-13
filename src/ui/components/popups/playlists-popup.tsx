"use client"

import { X, Music } from "lucide-react"

interface PlaylistsPopupProps {
  onClose: () => void
  onPlaylistSelect: (id: string) => void
  currentPlaylist: string
}

export default function PlaylistsPopup({ onClose, onPlaylistSelect, currentPlaylist }: PlaylistsPopupProps) {
  const playlists = [
    { id: "PLhK5MCJLYPpcXgj7BI009xIrcLg8rZ2Jl", name: "Lofi Hip Hop - Beats to Relax/Study to" },
    { id: "PLQkQfzsIUwRZ9FVWVE8KpIOVkQsUZH9t8", name: "Lofi Coffee Shop" },
    { id: "PLOzDu-MXXLliO9fBNZOQTBDddQBrX0vTc", name: "Aesthetic Lofi Mix" },
    { id: "PLvTTekbgYTB-rRpEyNdPQVYwOSxISHLMc", name: "Ambient Study Music" },
    { id: "PLOfcuKHGZ0eO9nLAL6OjhZ27AEH21Zk0-", name: "Chill Gaming Mix" },
  ]

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
      <div className="bg-gray-800/80 backdrop-blur-xl text-white p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lofi Playlists</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                ${currentPlaylist === playlist.id ? "bg-white/20" : "bg-black/20 hover:bg-black/30"}
              `}
              onClick={() => onPlaylistSelect(playlist.id)}
            >
              <Music className="h-5 w-5 flex-shrink-0" />
              <span className="text-left">{playlist.name}</span>
              {currentPlaylist === playlist.id && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">Playing</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <button className="w-full p-2 text-sm rounded-md bg-white/10 hover:bg-white/20">
            Add Custom YouTube Playlist...
          </button>
        </div>
      </div>
    </div>
  )
}

