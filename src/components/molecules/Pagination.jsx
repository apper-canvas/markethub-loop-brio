import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const Pagination = ({ currentPage, totalPages, onPageChange, maxVisible = 7 }) => {
  const generatePageNumbers = () => {
    const pages = []
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate range around current page
      const start = Math.max(2, currentPage - Math.floor((maxVisible - 3) / 2))
      const end = Math.min(totalPages - 1, start + maxVisible - 4)
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...")
      }
      
      // Add pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  const pages = generatePageNumbers()

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3"
      >
        <ApperIcon name="ChevronLeft" className="w-4 h-4" />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => (
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-[44px] h-11 px-3 rounded-lg font-medium transition-all duration-200",
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3"
      >
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default Pagination