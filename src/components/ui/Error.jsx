import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className,
  showIcon = true 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {showIcon && (
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary px-6 py-3"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default Error