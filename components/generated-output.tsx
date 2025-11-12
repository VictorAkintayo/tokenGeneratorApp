"use client"

import { useState, useEffect } from "react"

interface GeneratedOutputProps {
  value: string
}

export function GeneratedOutput({ value }: GeneratedOutputProps) {
  const [displayValue, setDisplayValue] = useState("")
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    setIsAnimating(true)
    setDisplayValue("")

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= value.length) {
        setDisplayValue(value.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative p-4 rounded-lg border border-primary/20 bg-muted/40 backdrop-blur-sm">
        <div className="font-mono text-sm md:text-base break-all text-foreground leading-relaxed">
          {displayValue}
          {isAnimating && <span className="inline-block w-0.5 h-4 md:h-5 bg-primary animate-pulse ml-0.5" />}
        </div>
      </div>
    </div>
  )
}
