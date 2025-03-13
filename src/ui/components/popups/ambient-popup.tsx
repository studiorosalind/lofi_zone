"use client"

import { useState } from "react"
import { X, Volume2, VolumeX } from "lucide-react"

interface AmbientPopupProps {
  onClose: () => void
}

export default function AmbientPopup({ onClose }: AmbientPopupProps) {
  const [masterVolume, setMasterVolume] = useState(70)

  const ambientSounds = [
    { id: "rain", name: "Rain", active: true, volume: 50 },
    { id: "thunder", name: "Thunder", active: false, volume: 40 },
    { id: "cafe", name: "Cafe Ambience", active: true, volume: 30 },
    { id: "keyboard", name: "Keyboard Typing", active: false, volume: 60 },
    { id: "forest", name: "Forest Sounds", active: false, volume: 50 },
    { id: "waves", name: "Ocean Waves", active: false, volume: 40 },
  ]

  const [sounds, setSounds] = useState(ambientSounds)

  const toggleSound = (id: string) => {
    setSounds(sounds.map((sound) => (sound.id === id ? { ...sound, active: !sound.active } : sound)))
  }

  const updateVolume = (id: string, volume: number) => {
    setSounds(sounds.map((sound) => (sound.id === id ? { ...sound, volume } : sound)))
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
      <div className="bg-gray-800/80 backdrop-blur-xl text-white p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ambient Sounds</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              <span>Master Volume</span>
            </div>
            <span className="text-sm">{masterVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number.parseInt(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="space-y-4">
          {sounds.map((sound) => (
            <div key={sound.id} className="p-3 bg-black/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{sound.name}</span>
                <button
                  onClick={() => toggleSound(sound.id)}
                  className={`p-1 rounded-md ${sound.active ? "bg-white/20" : "bg-white/5"}`}
                >
                  {sound.active ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sound.volume}
                onChange={(e) => updateVolume(sound.id, Number.parseInt(e.target.value))}
                className={`w-full ${sound.active ? "accent-white" : "accent-gray-600"}`}
                disabled={!sound.active}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

