import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  discountPercentage, 
  className,
  showBadge = true,
  priceSize = "lg"
}) => {
  const hasDiscount = originalPrice && originalPrice > price && discountPercentage > 0

  const priceSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-2">
        <span className={cn("font-bold text-gray-900", priceSizes[priceSize])}>
          ${price.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-sm text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      {hasDiscount && showBadge && (
        <Badge variant="discount" size="sm">
          -{discountPercentage}%
        </Badge>
      )}
    </div>
  )
}

export default PriceDisplay