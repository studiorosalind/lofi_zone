"use client"
import { X } from "lucide-react"

// Define the background map type
interface BackgroundMap {
  [key: string]: string; // key: background name, value: background URL
}

interface BackgroundSelectorProps {
  backgrounds: BackgroundMap
  currentBackground: string // This should be the key of the selected background
  onSelect: (backgroundKey: string) => void
  onClose: () => void
}

export default function BackgroundSelector({
  backgrounds,
  currentBackground,
  onSelect,
  onClose,
}: BackgroundSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900/80 backdrop-blur-xl text-white p-6 rounded-xl w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Background</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(backgrounds).map(([key, url]) => (
            <div
              key={key}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden h-40
                ${currentBackground === key ? "ring-2 ring-white" : ""}
              `}
              onClick={() => onSelect(url)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${url})`,
                  filter: currentBackground === key ? "brightness(1.2)" : "brightness(0.8)",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-medium capitalize">
                  {key.replace(/-/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}