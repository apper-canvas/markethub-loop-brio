import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { cn } from "@/utils/cn"

const CartButton = ({ className }) => {
  const navigate = useNavigate()
  const [cart] = useLocalStorage("cart", [])
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleCartClick = () => {
    navigate("/cart")
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="md"
        onClick={handleCartClick}
        className="relative p-2"
      >
        <ApperIcon name="ShoppingCart" className="w-6 h-6" />
        {cartItemCount > 0 && (
          <Badge
            variant="accent"
            size="sm"
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center p-1"
          >
            {cartItemCount > 99 ? "99+" : cartItemCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}

export default CartButton