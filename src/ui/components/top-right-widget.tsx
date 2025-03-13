"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, Moon } from "lucide-react"

export default function TopRightWidget() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [weather, setWeather] = useState({
    temp: "68°F",
    condition: "Cloudy",
    icon: <Cloud className="h-4 w-4" />,
  })
  const [location, setLocation] = useState("San Francisco, CA")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)

    // Mock weather API call
    const mockWeather = () => {
      const conditions = [
        { temp: "68°F", condition: "Cloudy", icon: <Cloud className="h-4 w-4" /> },
        { temp: "72°F", condition: "Sunny", icon: <Sun className="h-4 w-4" /> },
        { temp: "65°F", condition: "Rainy", icon: <CloudRain className="h-4 w-4" /> },
        { temp: "60°F", condition: "Night", icon: <Moon className="h-4 w-4" /> },
      ]
      setWeather(conditions[Math.floor(Math.random() * conditions.length)])
    }
    mockWeather()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-4">
      <div className="flex flex-col items-end">
        <div className="text-lg font-semibold">{time}</div>
        <div className="text-xs opacity-80">{date}</div>
      </div>
      <div className="h-6 w-px bg-white/20"></div>
      <div className="flex items-center gap-1">
        {weather.icon}
        <span className="text-sm">{weather.temp}</span>
      </div>
      <div className="h-6 w-px bg-white/20"></div>
      <div className="text-xs">{location}</div>
    </div>
  )
}

