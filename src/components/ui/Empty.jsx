import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Empty = ({ 
  message = "No items found", 
  description = "Try adjusting your search or browse our categories",
  actionText,
  onAction,
  className,
  icon = "Package"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary px-6 py-3"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default Empty