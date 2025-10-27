import { cn } from "@/utils/cn"

const Loading = ({ className, variant = "default" }) => {
  if (variant === "product-grid") {
    return (
      <div className={cn("product-grid", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card p-4">
            <div className="skeleton h-48 mb-4"></div>
            <div className="skeleton h-4 mb-2"></div>
            <div className="skeleton h-4 w-3/4 mb-2"></div>
            <div className="skeleton h-6 w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "category-grid") {
    return (
      <div className={cn("category-grid", className)}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="card p-6 text-center">
            <div className="skeleton w-16 h-16 mx-auto mb-4 rounded-full"></div>
            <div className="skeleton h-4 mb-2"></div>
            <div className="skeleton h-3 w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "hero-carousel") {
    return (
      <div className={cn("w-full h-[500px] skeleton", className)}></div>
    )
  }

  if (variant === "brands") {
    return (
      <div className={cn("grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6", className)}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="card p-6">
            <div className="skeleton h-12"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("animate-spin rounded-full h-8 w-8 border-b-2 border-primary", className)}></div>
  )
}

export default Loading