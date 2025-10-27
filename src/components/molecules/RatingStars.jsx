import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const RatingStars = ({ rating = 0, maxRating = 5, showCount = false, count = 0, className, size = 16 }) => {
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starRating = index + 1
    const isFilled = starRating <= rating
    const isPartiallyFilled = starRating === Math.ceil(rating) && rating % 1 !== 0
    
    return (
      <div key={index} className="relative">
        <ApperIcon
          name="Star"
          size={size}
          className={cn(
            "transition-colors duration-200",
            isFilled ? "text-yellow-400 fill-current" : "text-gray-300"
          )}
        />
        {isPartiallyFilled && (
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${(rating % 1) * 100}%` }}
          >
            <ApperIcon
              name="Star"
              size={size}
              className="text-yellow-400 fill-current"
            />
          </div>
        )}
      </div>
    )
  })

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex items-center space-x-1">
        {stars}
      </div>
      {showCount && count > 0 && (
        <span className="text-sm text-gray-600 ml-2">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

export default RatingStars