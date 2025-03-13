"use client"

import { X, Check } from "lucide-react"

interface QuestsPopupProps {
  onClose: () => void
}

export default function QuestsPopup({ onClose }: QuestsPopupProps) {
  const quests = [
    { id: 1, title: "Study for 2 hours", completed: true, reward: "50 XP" },
    { id: 2, title: "Complete 3 Pomodoro sessions", completed: false, reward: "100 XP" },
    { id: 3, title: "Read 30 pages", completed: false, reward: "75 XP" },
    { id: 4, title: "Write 500 words", completed: false, reward: "120 XP" },
  ]

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
      <div className="bg-gray-800/80 backdrop-blur-xl text-white p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daily Quests</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {quests.map((quest) => (
            <div key={quest.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
              <div
                className={`
                h-6 w-6 rounded-full flex items-center justify-center border
                ${quest.completed ? "bg-green-500/20 border-green-500" : "border-gray-400"}
              `}
              >
                {quest.completed && <Check className="h-4 w-4 text-green-500" />}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${quest.completed ? "line-through opacity-70" : ""}`}>{quest.title}</div>
                <div className="text-xs text-gray-300">Reward: {quest.reward}</div>
              </div>
              {!quest.completed && (
                <button className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-md">Complete</button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between">
          <div className="text-sm text-gray-300">Daily progress: 1/4</div>
          <div className="text-sm font-semibold">50/345 XP</div>
        </div>
      </div>
    </div>
  )
}

