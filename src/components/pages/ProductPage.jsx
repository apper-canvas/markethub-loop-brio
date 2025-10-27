import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import RatingStars from "@/components/molecules/RatingStars"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { useLocalStorage } from "@/hooks/useLocalStorage"

const ProductPage = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useLocalStorage("cart", [])
  const [wishlist, setWishlist] = useLocalStorage("wishlist", [])
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getBySlug(slug)
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    
    try {
      const existingItem = cart.find(item => item.Id === product.Id)
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.Id === product.Id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ))
        toast.success(`Updated ${product.title} quantity in cart`)
      } else {
        setCart([...cart, { ...product, quantity }])
        toast.success(`${product.title} added to cart`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const toggleWishlist = () => {
    if (!product) return
    
    const isInWishlist = wishlist.some(item => item.Id === product.Id)
    
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.Id !== product.Id))
      toast.success("Removed from wishlist")
    } else {
      setWishlist([...wishlist, product])
      toast.success("Added to wishlist")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="skeleton h-96"></div>
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4"></div>
              <div className="skeleton h-6 w-1/2"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-12 w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <Error message={error} onRetry={loadProduct} />
        </div>
      </div>
    )
  }

  if (!product) return null

  const isInWishlist = wishlist.some(item => item.Id === product.Id)
  const isInCart = cart.some(item => item.Id === product.Id)

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <Link to={`/category/${product.categoryId}`} className="hover:text-primary capitalize">
            {product.categoryId.replace("-", " ")}
          </Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
              <img
                src={product.images?.[selectedImage] || product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {product.discountPercentage > 0 && (
                <Badge 
                  variant="discount" 
                  className="absolute top-4 right-4 z-10 font-bold shadow-lg text-lg px-3 py-2"
                >
                  -{product.discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? "border-primary shadow-md" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Rating */}
            <RatingStars 
              rating={product.rating} 
              showCount 
              count={product.reviewCount}
              size={18}
            />

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercentage={product.discountPercentage}
              priceSize="xl"
              className="text-2xl"
            />

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={product.inStock ? "Check" : "X"} 
                className={`w-5 h-5 ${product.inStock ? "text-success" : "text-error"}`} 
              />
              <span className={`font-medium ${product.inStock ? "text-success" : "text-error"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                  disabled={quantity <= 1}
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                  disabled={quantity >= 10}
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={addToCart}
                disabled={!product.inStock || addingToCart}
                variant={isInCart ? "secondary" : "primary"}
                size="lg"
                className="flex-1"
                loading={addingToCart}
              >
                {isInCart ? (
                  <>
                    <ApperIcon name="Check" className="w-5 h-5 mr-2" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                onClick={toggleWishlist}
                variant={isInWishlist ? "accent" : "outline"}
                size="lg"
                className="px-4"
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} 
                />
              </Button>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Truck" className="w-5 h-5 text-accent" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="RotateCcw" className="w-5 h-5 text-accent" />
                <span>30-day easy returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" className="w-5 h-5 text-accent" />
                <span>2-year warranty included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage