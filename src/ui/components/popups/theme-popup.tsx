"use client"

import { X, PaintBucket, Moon, Sun } from "lucide-react"

interface ThemePopupProps {
  onClose: () => void
  onBackgroundSelect: () => void
}

export default function ThemePopup({ onClose, onBackgroundSelect }: ThemePopupProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
      <div className="bg-gray-800/80 backdrop-blur-xl text-white p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Theme Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={onBackgroundSelect}
            className="w-full flex items-center gap-3 p-4 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
          >
            <PaintBucket className="h-5 w-5" />
            <span>Change Background</span>
          </button>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5" />
              <span>UI Brightness</span>
            </div>
            <input type="range" min="0" max="100" defaultValue="70" className="accent-white" />
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </div>
            <div className="relative inline-block w-12 h-6 bg-black/30 rounded-full cursor-pointer">
              <div className="absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

