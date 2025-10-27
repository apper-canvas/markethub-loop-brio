import { useState, useEffect, useCallback } from "react"

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date()
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      }
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const updateTimer = useCallback(() => {
    setTimeLeft(calculateTimeLeft())
  }, [targetDate])

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [updateTimer])

  return timeLeft
}