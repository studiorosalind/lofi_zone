"use client"

import { X, Music } from "lucide-react"
import { usePlaylist } from "../../context/PlaylistContext"

interface PlaylistsPopupProps {
  onClose: () => void
}

export default function PlaylistsPopup({ onClose }: PlaylistsPopupProps) {
  const { 
    playlists, 
    currentPlaylistId, 
    setCurrentPlaylistId, 
    setCurrentTrackIndex 
  } = usePlaylist();

  const handlePlaylistSelect = (id: string) => {
    setCurrentPlaylistId(id);
    setCurrentTrackIndex(0); // Start from the first track when changing playlists
  };

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
                ${currentPlaylistId === playlist.id ? "bg-white/20" : "bg-black/20 hover:bg-black/30"}
              `}
              onClick={() => handlePlaylistSelect(playlist.id)}
            >
              <Music className="h-5 w-5 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="font-medium">{playlist.name}</div>
                <div className="text-xs text-gray-300">{playlist.tracks.length} tracks</div>
              </div>
              {currentPlaylistId === playlist.id && (
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
