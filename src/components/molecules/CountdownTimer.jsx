import { useCountdown } from "@/hooks/useCountdown"
import { cn } from "@/utils/cn"

const CountdownTimer = ({ targetDate, className, title = "Sale ends in:" }) => {
  const timeLeft = useCountdown(targetDate)

  if (timeLeft.total <= 0) {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-lg font-semibold text-gray-600">Sale Ended</p>
      </div>
    )
  }

  const timeUnits = [
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ]

  return (
    <div className={cn("text-center", className)}>
      {title && (
        <p className="text-lg font-semibold text-gray-900 mb-4">{title}</p>
      )}
      <div className="flex items-center justify-center space-x-4">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center space-x-4">
            <div className="text-center">
              <div 
                className={cn(
                  "w-16 h-16 bg-gradient-to-b from-accent to-amber-600 rounded-lg flex items-center justify-center shadow-lg",
                  timeLeft.total <= 10000 && "animate-pulse-ring"
                )}
              >
                <span className="text-2xl font-bold text-white">
                  {unit.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-gray-600 mt-1">{unit.label}</span>
            </div>
            {index < timeUnits.length - 1 && (
              <span className="text-2xl font-bold text-accent">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountdownTimer