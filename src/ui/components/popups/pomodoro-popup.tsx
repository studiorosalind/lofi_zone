"use client"

import { useState, useEffect } from "react"
import { X, Play, Pause, RotateCcw } from "lucide-react"

interface PomodoroPopupProps {
  onClose: () => void
}

export default function PomodoroPopup({ onClose }: PomodoroPopupProps) {
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus")
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)

  const durations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  }

  useEffect(() => {
    setSecondsLeft(durations[mode])
  }, [mode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1)
      }, 1000)
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false)

      if (mode === "focus") {
        setCompletedSessions((prev) => prev + 1)
        if (completedSessions % 4 === 3) {
          setMode("longBreak")
        } else {
          setMode("shortBreak")
        }
      } else {
        setMode("focus")
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, secondsLeft, mode, completedSessions])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setSecondsLeft(durations[mode])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
      <div className="bg-gray-800/80 backdrop-blur-xl text-white p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
          <button
            className={`px-3 py-1 rounded-md text-sm ${mode === "focus" ? "bg-white/20" : "bg-white/5"}`}
            onClick={() => {
              setIsActive(false)
              setMode("focus")
            }}
          >
            Focus
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${mode === "shortBreak" ? "bg-white/20" : "bg-white/5"}`}
            onClick={() => {
              setIsActive(false)
              setMode("shortBreak")
            }}
          >
            Short Break
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${mode === "longBreak" ? "bg-white/20" : "bg-white/5"}`}
            onClick={() => {
              setIsActive(false)
              setMode("longBreak")
            }}
          >
            Long Break
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold mb-8">{formatTime(secondsLeft)}</div>

          <div className="flex space-x-4">
            <button
              onClick={toggleTimer}
              className="h-12 w-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full"
            >
              {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="h-12 w-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-300">Sessions completed today: {completedSessions}</div>
      </div>
    </div>
  )
}

