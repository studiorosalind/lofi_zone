// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from "react";

interface NowPlayingDisplayProps {
  trackName: string;
}

export default function NowPlayingDisplay({ trackName }: NowPlayingDisplayProps) {
  return (
    <div className="flex items-center space-x-2 overflow-hidden">
      <span 
        className="text-xs text-cyan-300" 
        style={{ 
          fontFamily: "'Press Start 2P', cursive", 
          textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00",
          fontSize: "8px" 
        }}
      >
        currently playing...
      </span>

      {/* Marquee Container */}
      <div className="relative w-[160px] overflow-hidden whitespace-nowrap">
        <div 
          className="inline-block animate-marquee gap-4 text-cyan-300"
          style={{ 
            fontFamily: "'Press Start 2P', cursive", 
            minWidth: "100%", 
            textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00",
            fontSize: "8px"
          }}
        >
          <span className="whitespace-nowrap">{trackName || "Nothing playing"}</span>
          &nbsp;&nbsp;&nbsp;
          <span className="whitespace-nowrap">{trackName || "Nothing playing"}</span>
        </div>
      </div>
      <span 
        className="animate-bounce text-cyan-300" 
        style={{ textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00" }}
      >
        ♪
      </span> 
      <span 
        className="ml-2 animate-bounce text-cyan-300" 
        style={{ textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00" }}
      >
        ♫
      </span>
    </div>
  );
}