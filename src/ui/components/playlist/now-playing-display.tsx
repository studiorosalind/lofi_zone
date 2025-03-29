/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react";
import { Music } from "lucide-react";

interface NowPlayingDisplayProps {
    trackName: string;
}
  
export default function NowPlayingDisplay({ trackName }: NowPlayingDisplayProps) {
    return (
      <div className="flex items-center space-x-2 overflow-hidden">
        {/* <span className="animate-bounce text-cyan-300">♪</span> */}
        <span className="font-pixel text-xs text-cyan-300" style={{ textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00" }}>currently playing...</span>
  
        {/* Marquee Container */}
        <div className="relative w-[160px] overflow-hidden whitespace-nowrap">
          <div className={`font-pixel text-xs text-cyan-300 inline-block animate-marquee gap-4`}style={{ minWidth: "100%", textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00" }}>
            <span className="whitespace-nowrap">{trackName || "Nothing playing"}</span>
            &nbsp;&nbsp;&nbsp;
            <span className="whitespace-nowrap">{trackName || "Nothing playing"}</span>
          </div>
        </div>
        <span className="animate-bounce text-cyan-300" style={{ textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00" }}>♪</span> 
        <span className="ml-2 animate-bounce text-cyan-300" style={{ textShadow: "0 0 4px #00FF00, 0 0 8px #00FF00" }}>♫</span>
      </div>
    );
  }
  
