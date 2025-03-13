"use client"

import { ClipboardList, Clock, Palette, Music, Volume2 } from "lucide-react"

interface DockProps {
  onItemClick: (item: string) => void
  activeItem: string | null
}

export default function Dock({ onItemClick, activeItem }: DockProps) {
  const items = [
    { id: "quests", icon: <ClipboardList className="h-6 w-6" />, label: "Quests" },
    { id: "pomodoro", icon: <Clock className="h-6 w-6" />, label: "Pomodoro" },
    { id: "theme", icon: <Palette className="h-6 w-6" />, label: "Theme" },
    { id: "playlists", icon: <Music className="h-6 w-6" />, label: "Playlists" },
    { id: "ambient", icon: <Volume2 className="h-6 w-6" />, label: "Ambient" },
  ]

  return (
    <div className="flex gap-4 px-6 py-2 bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-2xl">
      {items.map((item) => (
        <button
          key={item.id}
          className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-white/20 ${
            activeItem === item.id ? "bg-white/20" : ""
          }`}
          onClick={() => onItemClick(item.id)}
        >
          <div className="text-white">{item.icon}</div>
          <span className="text-white text-xs mt-1">{item.label}</span>
          {activeItem === item.id && <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-white"></div>}
        </button>
      ))}
    </div>
  )
}

