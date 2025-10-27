import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"

const Logo = ({ className }) => {
  return (
    <Link to="/" className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-lg">M</span>
      </div>
      <span className="font-bold text-xl text-gray-900">MarketHub</span>
    </Link>
  )
}

export default Logo