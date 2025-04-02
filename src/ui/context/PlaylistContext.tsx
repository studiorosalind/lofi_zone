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
    name: "Lofi Hip Hop - Beats to Relax/Study to",
    tracks: [
      { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", source_type: "YOUTUBE" },
      { id: "Kus75rHg930", title: "Chill Study Beats 4 • jazz & lofi hiphop", source_type: "YOUTUBE" },
      { id: "qH3fETPsqXU", title: "Lofi Coding Session • work & study music", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLQkQfzsIUwRZ9FVWVE8KpIOVkQsUZH9t8",
    name: "Lofi Coffee Shop",
    tracks: [
      { id: "dtVwR4uMnfg", title: "Coffee Shop Radio • 24/7 lofi & jazzy hip-hop beats", source_type: "YOUTUBE" },
      { id: "4xDzrJKXOOY", title: "Cozy Coffee Shop • Relaxing Jazz Music", source_type: "YOUTUBE" },
      { id: "B-8pRTqDhwQ", title: "Morning Coffee Jazz • Relaxing Bossa Nova Music", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLOzDu-MXXLliO9fBNZOQTBDddQBrX0vTc",
    name: "Aesthetic Lofi Mix",
    tracks: [
      { id: "bKKfFN7L6lc", title: "Aesthetic Lofi Mix • Chill & Relax", source_type: "YOUTUBE" },
      { id: "lTRiuFIWV54", title: "1 A.M Study Session • lofi hip hop/chill beats", source_type: "YOUTUBE" },
      { id: "BTYAsjAVa3I", title: "Rainy Night Coffee Shop • lofi hip hop mix", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLvTTekbgYTB-rRpEyNdPQVYwOSxISHLMc",
    name: "Ambient Study Music",
    tracks: [
      { id: "sjkrrmBnpGE", title: "Ambient Study Music • Focus and Concentration", source_type: "YOUTUBE" },
      { id: "tNkZsRW7h2c", title: "Space Ambient Music • Deep Focus and Relaxation", source_type: "YOUTUBE" },
      { id: "77ZozI0rw7w", title: "Ambient Music for Studying • Improve Focus and Concentration", source_type: "YOUTUBE" },
    ]
  },
  {
    id: "PLOfcuKHGZ0eO9nLAL6OjhZ27AEH21Zk0-",
    name: "Chill Gaming Mix",
    tracks: [
      { id: "c9VQye6P8k0", title: "Chill Gaming Music Mix • Relaxing Background Music", source_type: "YOUTUBE" },
      { id: "qEHZOJZQfGE", title: "Gaming Music Mix • Electronic & Chill Beats", source_type: "YOUTUBE" },
      { id: "7NOSDKb0HlU", title: "Synthwave Gaming Mix • Retrowave & Outrun", source_type: "YOUTUBE" },
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

  // Next track function
  const nextTrack = () => {
    const playlist = getPlaylistById(currentPlaylistId);
    if (playlist) {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.tracks.length);
    }
  };

  // Previous track function
  const prevTrack = () => {
    const playlist = getPlaylistById(currentPlaylistId);
    if (playlist) {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.tracks.length) % playlist.tracks.length);
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
