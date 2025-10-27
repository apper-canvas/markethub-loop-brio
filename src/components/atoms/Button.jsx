import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseStyles = "btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 hover:scale-105 focus:ring-primary shadow-md hover:shadow-lg",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:scale-105 focus:ring-gray-500",
    accent: "bg-accent text-white hover:bg-amber-600 hover:scale-105 focus:ring-accent shadow-md hover:shadow-lg",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:scale-105 focus:ring-primary",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105",
    danger: "bg-error text-white hover:bg-red-700 hover:scale-105 focus:ring-error shadow-md hover:shadow-lg"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button