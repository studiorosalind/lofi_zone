import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Define the track interface
export interface Track {
  id: string;
  title: string;
  source_type: "YOUTUBE"; // For now, just YouTube
}

// Define the playlist interface
export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

// Context type
interface PlaylistContextType {
  playlists: Playlist[];
  currentPlaylistId: string;
  currentTrackIndex: number;
  currentTrack: Track | null;
  setCurrentPlaylistId: (id: string) => void;
  setCurrentTrackIndex: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  getPlaylistById: (id: string) => Playlist | undefined;
}

// Create context
const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

// Sample data for testing
const samplePlaylists: Playlist[] = [
  {
    id: "PLhK5MCJLYPpcXgj7BI009xIrcLg8rZ2Jl",
    name: "LOFI GIRL",
    tracks: [
      { id: "jfKfPfyJRdk", title: "LOFI GIRL - beats to relax/study to", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLQkQfzsIUwRZ9FVWVE8KpIOVkQsUZH9t8",
    name: "Lofi Coffee Shop",
    tracks: [
      { id: "0H87zumc8DU", title: "Coffee Shop Radio • 24/7 lofi & jazzy hip-hop beats", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLOzDu-MXXLliO9fBNZOQTBDddQBrX0vTc",
    name: "SynthWave",
    tracks: [
      { id: "4xDzrJKXOOY", title: "SYNTHWAVE • GAME & FOCUS", source_type: "YOUTUBE" },
      // { id: "lTRiuFIWV54", title: "1 A.M Study Session • lofi hip hop/chill beats", source_type: "YOUTUBE" },
      // { id: "BTYAsjAVa3I", title: "Rainy Night Coffee Shop • lofi hip hop mix", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLvTTekbgYTB-rRpEyNdPQVYwOSxISHLMc",
    name: "Tokyo CityPop Lofi",
    tracks: [
      { id: "bJt8lSOMQ4k", title: "Tokyo CityPop Lofi • Focus and Concentration", source_type: "YOUTUBE" },
      // { id: "tNkZsRW7h2c", title: "Space Ambient Music • Deep Focus and Relaxation", source_type: "YOUTUBE" },
      // { id: "77ZozI0rw7w", title: "Ambient Music for Studying • Improve Focus and Concentration", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLOfcuKHGZ0eO9nLAL6OjhZ27AEH21Zk0-",
    name: "LOFI HIPHOP",
    tracks: [
      // { id: "c9VQye6P8k0", title: "Chill Gaming Music Mix • Relaxing Background Music", source_type: "YOUTUBE" },
      // { id: "qEHZOJZQfGE", title: "Gaming Music Mix • Electronic & Chill Beats", source_type: "YOUTUBE" },
      { id: "n61ULEU7CO0", title: "LOFI HIPHOP • STUDY and FOCUS", source_type: "YOUTUBE" },
    ]
  },
];

// Provider component
export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(samplePlaylists);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string>(samplePlaylists[0].id);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // Get a playlist by ID
  const getPlaylistById = (id: string) => {
    return playlists.find((playlist) => playlist.id === id);
  };

  // Update current track when playlist or track index changes
  useEffect(() => {
    const playlist = getPlaylistById(currentPlaylistId);
    if (playlist && playlist.tracks.length > 0) {
      // Ensure track index is within bounds
      const safeIndex = Math.min(currentTrackIndex, playlist.tracks.length - 1);
      setCurrentTrack(playlist.tracks[safeIndex]);
      
      // Update track index if it was out of bounds
      if (safeIndex !== currentTrackIndex) {
        setCurrentTrackIndex(safeIndex);
      }
    } else {
      setCurrentTrack(null);
    }
  }, [currentPlaylistId, currentTrackIndex, playlists]);

  // Next track function - changes to the next playlist
  const nextTrack = () => {
    const currentPlaylistIndex = playlists.findIndex(playlist => playlist.id === currentPlaylistId);
    if (currentPlaylistIndex !== -1) {
      // Move to the next playlist in the array
      const nextPlaylistIndex = (currentPlaylistIndex + 1) % playlists.length;
      setCurrentPlaylistId(playlists[nextPlaylistIndex].id);
      // Reset track index to 0 for the new playlist
      setCurrentTrackIndex(0);
    }
  };

  // Previous track function - changes to the previous playlist
  const prevTrack = () => {
    const currentPlaylistIndex = playlists.findIndex(playlist => playlist.id === currentPlaylistId);
    if (currentPlaylistIndex !== -1) {
      // Move to the previous playlist in the array
      const prevPlaylistIndex = (currentPlaylistIndex - 1 + playlists.length) % playlists.length;
      setCurrentPlaylistId(playlists[prevPlaylistIndex].id);
      // Reset track index to 0 for the new playlist
      setCurrentTrackIndex(0);
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        currentPlaylistId,
        currentTrackIndex,
        currentTrack,
        setCurrentPlaylistId,
        setCurrentTrackIndex,
        nextTrack,
        prevTrack,
        getPlaylistById,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom hook for using the playlist context
export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
