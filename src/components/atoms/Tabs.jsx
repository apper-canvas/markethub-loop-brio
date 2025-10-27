import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Tabs = forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      className={cn("w-full", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

const TabsList = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-12 items-center justify-start rounded-lg bg-gray-100 p-1 text-gray-600 w-full sm:w-auto overflow-x-auto scrollbar-hide",
        className
      )}
      {...props}
    />
  )
})

const TabsTrigger = forwardRef(({ className, active, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        className
      )}
      {...props}
    />
  )
})

const TabsContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
})

Tabs.displayName = "Tabs"
TabsList.displayName = "TabsList"
TabsTrigger.displayName = "TabsTrigger"
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }