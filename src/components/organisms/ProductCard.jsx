import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import RatingStars from "@/components/molecules/RatingStars"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { cn } from "@/utils/cn"

const ProductCard = ({ 
  product, 
  className, 
  showQuickView = false,
  imageSize = "large" 
}) => {
  const [cart, setCart] = useLocalStorage("cart", [])
  const [wishlist, setWishlist] = useLocalStorage("wishlist", [])
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const isInWishlist = wishlist.some(item => item.Id === product.Id)
  const isInCart = cart.some(item => item.Id === product.Id)

  const imageHeights = {
    small: "h-32",
    medium: "h-40",
    large: "h-48",
    xlarge: "h-56"
  }

  const addToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setAddingToCart(true)
    
    try {
      const existingItem = cart.find(item => item.Id === product.Id)
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.Id === product.Id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
        toast.success(`Updated ${product.title} quantity in cart`)
      } else {
        setCart([...cart, { ...product, quantity: 1 }])
        toast.success(`${product.title} added to cart`)
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.Id !== product.Id))
      toast.success("Removed from wishlist")
    } else {
      setWishlist([...wishlist, product])
      toast.success("Added to wishlist")
    }
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.info("Quick view functionality coming soon!")
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="card card-hover relative overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
          {/* Product Image */}
          <div className={cn("relative overflow-hidden bg-gray-100", imageHeights[imageSize])}>
            <img
              src={product.imageUrl}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-300 group-hover:scale-110",
                !isImageLoaded && "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Image Loading Placeholder */}
            {!isImageLoaded && (
              <div className="absolute inset-0 skeleton"></div>
            )}

            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <Badge 
                variant="discount" 
                className="absolute top-3 right-3 z-10 font-bold shadow-lg"
              >
                -{product.discountPercentage}%
              </Badge>
            )}

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={cn(
                "absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 z-10",
                isInWishlist && "bg-red-500 text-white hover:bg-red-600"
              )}
            >
              <ApperIcon 
                name={isInWishlist ? "Heart" : "Heart"} 
                className={cn("w-5 h-5", isInWishlist && "fill-current")} 
              />
            </button>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="flex space-x-2">
                {showQuickView && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleQuickView}
                    className="bg-white/95 hover:bg-white shadow-lg"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="error" size="lg">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Rating */}
            <div className="mb-2">
              <RatingStars 
                rating={product.rating} 
                showCount 
                count={product.reviewCount}
                size={14}
              />
            </div>

            {/* Product Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h3>

            {/* Price */}
            <div className="mb-4">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                discountPercentage={product.discountPercentage}
                priceSize="lg"
              />
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={addToCart}
              disabled={!product.inStock || addingToCart}
              variant={isInCart ? "secondary" : "primary"}
              className="w-full group-hover:scale-105 transition-all duration-200"
              loading={addingToCart}
            >
              {isInCart ? (
                <>
                  <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                  In Cart
                </>
              ) : (
                <>
                  <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard