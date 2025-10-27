const LoadingSkeleton = ({ count = 24 }) => {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card overflow-hidden">
          {/* Image skeleton */}
          <div className="skeleton aspect-square" />
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
            
            {/* Rating */}
            <div className="skeleton h-3 w-24" />
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <div className="skeleton h-5 w-16" />
              <div className="skeleton h-4 w-12" />
            </div>
            
            {/* Button */}
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton