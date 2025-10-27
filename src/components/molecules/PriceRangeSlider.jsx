import { useState, useEffect } from "react"
import { cn } from "@/utils/cn"

const PriceRangeSlider = ({ min = 0, max = 1000, value = [0, 1000], onChange }) => {
  const [localValues, setLocalValues] = useState(value)

  useEffect(() => {
    setLocalValues(value)
  }, [value])

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value)
    if (newMin <= localValues[1]) {
      const newValues = [newMin, localValues[1]]
      setLocalValues(newValues)
    }
  }

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value)
    if (newMax >= localValues[0]) {
      const newValues = [localValues[0], newMax]
      setLocalValues(newValues)
    }
  }

  const handleMouseUp = () => {
    onChange?.(localValues)
  }

  const minPercent = ((localValues[0] - min) / (max - min)) * 100
  const maxPercent = ((localValues[1] - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="relative pt-2 pb-8">
        {/* Track background */}
        <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full" />
        
        {/* Active track */}
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValues[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValues[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Value display */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Min:</span>
          <span className="font-medium text-gray-900">${localValues[0]}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Max:</span>
          <span className="font-medium text-gray-900">${localValues[1]}</span>
        </div>
      </div>
    </div>
  )
}

export default PriceRangeSlider