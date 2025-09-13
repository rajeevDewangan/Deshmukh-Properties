"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/components/ui/use-mobile"

interface UpcomingStripProps {
  className?: string
  text?: string
}

export const UpcomingStrip: React.FC<UpcomingStripProps> = ({
  className,
  text = "UPCOMING"
}) => {
  const isMobile = useIsMobile()
  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      {/* Diagonal strip background */}
      <div 
        className={`absolute bg-neutral-300 opacity-95 flex items-center justify-center text-neutral-500 font-bold text-xl font-outfit ${isMobile ? 'shadow-[inset_4px_0_8px_rgba(0,0,0,0.2),inset_-4px_0_8px_rgba(0,0,0,0.3)]' : 'shadow-lg'}`}
        style={{
          transform: isMobile ? 'rotate(0deg)' : 'rotate(315deg)',
          width: isMobile ? '150%' : '141.42%', // Reduced width for mobile to fit within card
          height: '64px',
          left: isMobile ? '75%' : '50%',
          top: isMobile ? '40%' : '50%',
          transformOrigin: 'center',
          marginLeft: isMobile ? '-75%' : '-70.71%', // half of width to center
          marginTop: '-32px', // half of height to center
          fontSize: '24px',
          letterSpacing: '1px',
          fontWeight: '800'
        }}
      >
        {text}
      </div>
    </div>
  )
}
