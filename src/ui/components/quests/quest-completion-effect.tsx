import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";

interface QuestCompletionEffectProps {
  show: boolean;
  onComplete: () => void;
}

export function QuestCompletionEffect({ show, onComplete }: QuestCompletionEffectProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Only run this effect when show changes from false to true
    if (show) {
      setIsVisible(true);
      
      // Create particles
      const particles: HTMLDivElement[] = [];
      const container = document.createElement("div");
      containerRef.current = container;
      
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
      
      // Create 50 particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = [
          "#FFD700", // Gold
          "#FF6347", // Tomato
          "#4169E1", // RoyalBlue
          "#32CD32", // LimeGreen
          "#FF69B4", // HotPink
        ][Math.floor(Math.random() * 5)];
        particle.style.borderRadius = "50%";
        
        // Random starting position near center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        // Random animation
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 50;
        const duration = Math.random() * 1 + 1; // 1-2 seconds
        
        particle.style.transition = `all ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1)`;
        
        container.appendChild(particle);
        particles.push(particle);
        
        // Start animation after a small delay
        setTimeout(() => {
          particle.style.transform = "scale(0)";
          particle.style.left = `${centerX + Math.cos(angle) * distance}px`;
          particle.style.top = `${centerY + Math.sin(angle) * distance}px`;
        }, 10);
      }
      
      // Remove the effect after animation completes
      animationTimerRef.current = setTimeout(() => {
        cleanup();
      }, 2000);
    }
    
    return () => {
      // Clean up if component unmounts
      cleanup();
    };
  }, [show, onComplete]);
  
  // Separate cleanup function to ensure consistent cleanup logic
  const cleanup = () => {
    // Clear the animation timer
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    // Remove the container element if it exists
    if (containerRef.current && document.body.contains(containerRef.current)) {
      document.body.removeChild(containerRef.current);
      containerRef.current = null;
    }
    
    // Reset visibility state
    setIsVisible(false);
    
    // Call onComplete callback
    onComplete();
  };
  
  // Only render the checkmark when isVisible is true
  if (!isVisible) {
    return null;
  }
  
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className="bg-green-500 rounded-full p-6 shadow-lg"
          style={{
            animation: "pulse 1s infinite, scale-up 0.5s ease-out"
          }}
        >
          <Check className="h-12 w-12 text-white" />
        </div>
      </div>
      
      {/* Add keyframes for the animations */}
      <style>
        {`
          @keyframes scale-up {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
          }
        `}
      </style>
    </>
  );
}