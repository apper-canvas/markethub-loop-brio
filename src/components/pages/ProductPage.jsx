import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import RatingStars from "@/components/molecules/RatingStars"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { brandService } from "@/services/api/brandService"
import { useLocalStorage } from "@/hooks/useLocalStorage"

const ProductPage = () => {
  const { slug } = useParams()
const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useLocalStorage("cart", [])
  const [wishlist, setWishlist] = useLocalStorage("wishlist", [])
  const [addingToCart, setAddingToCart] = useState(false)
  const [pincode, setPincode] = useState("")
  const [checkingDelivery, setCheckingDelivery] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [imageZoom, setImageZoom] = useState(false)
useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getBySlug(slug)
      setProduct(data)
      
      // Load brand details if brandId exists
      if (data.brandId) {
        try {
          const brandData = await brandService.getById(data.brandId)
          setBrand(brandData)
        } catch (err) {
          console.log("Brand not found:", err)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkDelivery = async () => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode")
      return
    }

    setCheckingDelivery(true)
    try {
      // Simulate API call for delivery check
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock delivery information
      const estimatedDate = new Date()
      estimatedDate.setDate(estimatedDate.getDate() + Math.floor(Math.random() * 5) + 3)
      
      setDeliveryInfo({
        available: true,
        estimatedDelivery: estimatedDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        shippingCharge: product.price >= 500 ? 0 : 50,
        freeShippingThreshold: 500
      })
      
      toast.success("Delivery available to your location")
    } catch (err) {
      toast.error("Failed to check delivery availability")
    } finally {
      setCheckingDelivery(false)
    }
  }

  const handleVariantChange = (type, value) => {
    const newVariant = { ...selectedVariant, [type]: value }
    setSelectedVariant(newVariant)
    
    // Update price based on variant if applicable
    if (product.variants) {
      const variantOption = product.variants[type]?.find(v => v.value === value)
      if (variantOption?.priceModifier) {
        // Price modifier logic would go here
      }
    }
  }

const addToCart = async () => {
    if (!product) return
    
    // Validate stock
    if (!product.inStock) {
      toast.error("Product is out of stock")
      return
    }
    
    if (quantity > (product.stockQuantity || 10)) {
      toast.error(`Only ${product.stockQuantity || 10} items available`)
      return
    }
    
    setAddingToCart(true)
    
    try {
      const cartItem = {
        ...product,
        quantity,
        selectedVariant: selectedVariant || null
      }
      
      const existingItem = cart.find(item => 
        item.Id === product.Id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
      )
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.Id === product.Id && 
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ))
        toast.success(`Updated ${product.title} quantity in cart`)
      } else {
        setCart([...cart, cartItem])
        toast.success(`${product.title} added to cart`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const buyNow = async () => {
    if (!product || !product.inStock) {
      toast.error("Product is not available")
      return
    }

    // Add to cart first
    await addToCart()
    
    // Navigate to checkout
    setTimeout(() => {
      navigate("/checkout")
    }, 600)
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

const stockQuantity = product.stockQuantity || 10
  const stockStatus = !product.inStock ? "Out of Stock" : 
                      stockQuantity <= 3 ? `Only ${stockQuantity} left` : 
                      "In Stock"
  const stockColor = !product.inStock ? "text-error" : 
                     stockQuantity <= 3 ? "text-warning" : 
                     "text-success"
  
  const savings = product.originalPrice ? product.originalPrice - product.price : 0

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <Link to={`/category/${product.categoryId}`} className="hover:text-primary capitalize transition-colors">
            {product.categoryId.replace("-", " ")}
          </Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery (50%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image with Zoom */}
            <div 
              className="relative bg-white rounded-2xl overflow-hidden shadow-md"
              style={{ minHeight: '600px' }}
              onMouseEnter={() => setImageZoom(true)}
              onMouseLeave={() => setImageZoom(false)}
            >
              <div className="aspect-square relative">
                <img
                  src={product.images?.[selectedImage] || product.imageUrl}
                  alt={product.title}
                  className={`w-full h-full object-contain transition-transform duration-300 ${
                    imageZoom ? 'scale-150 cursor-zoom-in' : 'scale-100'
                  }`}
                />
              </div>
              
              {product.discountPercentage > 0 && (
                <Badge 
                  variant="discount" 
                  className="absolute top-4 right-4 z-10 font-bold shadow-lg text-lg px-4 py-2"
                >
                  -{product.discountPercentage}%
                </Badge>
              )}

              {imageZoom && (
                <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
                  Hover to zoom
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? "border-primary shadow-md ring-2 ring-primary ring-offset-2" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {/* Video Thumbnail Placeholder */}
                {product.videoUrl && (
                  <button
                    onClick={() => toast.info("Video playback coming soon")}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 bg-gray-100 flex items-center justify-center"
                  >
                    <ApperIcon name="Play" className="w-8 h-8 text-primary" />
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column - Product Information (50%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Brand Name */}
            {brand && (
              <Link 
                to={`/brand/${brand.slug}`}
                className="inline-block text-primary hover:text-blue-700 font-medium text-sm transition-colors"
              >
                {brand.name}
              </Link>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating with Reviews Link */}
            <div className="flex items-center gap-3">
              <RatingStars 
                rating={product.rating} 
                showCount={false}
                size={20}
              />
              <button 
                onClick={() => {
                  document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <span className="font-medium">{product.rating}</span> stars ({product.reviewCount?.toLocaleString() || 0} ratings)
              </button>
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-500">
              Product ID: <span className="font-mono">{product.Id}</span>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="discount" className="text-base font-bold">
                      -{product.discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">Inclusive of all taxes</p>
              {savings > 0 && (
                <p className="text-sm font-medium text-success">
                  You save ${savings.toFixed(2)}
                </p>
              )}
            </div>

            {/* Availability Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <ApperIcon 
                  name={product.inStock ? "CheckCircle" : "XCircle"} 
                  className={`w-5 h-5 ${stockColor}`} 
                />
                <span className={`font-semibold ${stockColor}`}>
                  {stockStatus}
                </span>
              </div>

              {/* Out of Stock Notify Button */}
              {!product.inStock && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("We'll notify you when this item is back in stock")}
                >
                  <ApperIcon name="Bell" className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              )}

              {/* Delivery Information */}
              {product.inStock && (
                <>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="flex-1"
                        maxLength={6}
                      />
                      <Button 
                        variant="outline"
                        onClick={checkDelivery}
                        disabled={checkingDelivery || pincode.length !== 6}
                        loading={checkingDelivery}
                      >
                        Check
                      </Button>
                    </div>

                    {deliveryInfo && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-success">
                          <ApperIcon name="Truck" className="w-4 h-4" />
                          <span>Delivery by {deliveryInfo.estimatedDelivery}</span>
                        </div>
                        
                        {/* Shipping Charges */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Shipping charges:</span>
                          <span className={deliveryInfo.shippingCharge === 0 ? "text-success font-medium" : "text-gray-900"}>
                            {deliveryInfo.shippingCharge === 0 ? "FREE" : `$${deliveryInfo.shippingCharge}`}
                          </span>
                        </div>

                        {/* Free Shipping Progress */}
                        {deliveryInfo.shippingCharge > 0 && product.price < deliveryInfo.freeShippingThreshold && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Add ${(deliveryInfo.freeShippingThreshold - product.price).toFixed(2)} more for FREE shipping</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-success h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(product.price / deliveryInfo.freeShippingThreshold) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Seller Information */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600">Sold by</p>
                        <p className="font-medium text-gray-900">MarketHub Official</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                        </div>
                        <p className="text-xs text-gray-600">30-day returns</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Variant Selection - Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantChange('size', size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedVariant?.size === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-gray-400 text-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selection - Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantChange('color', color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        selectedVariant?.color === color.name
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <ApperIcon name="Minus" className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-2 font-semibold min-w-[60px] text-center text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= stockQuantity}
                  >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                  </button>
                </div>
                {quantity >= stockQuantity && (
                  <span className="text-sm text-warning">Maximum available</span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={addToCart}
                disabled={!product.inStock || addingToCart}
                variant="primary"
                size="lg"
                className="flex-1 text-lg py-6"
                loading={addingToCart}
              >
                {addingToCart ? (
                  "Adding..."
                ) : isInCart ? (
                  <>
                    <ApperIcon name="Check" className="w-6 h-6 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ApperIcon name="ShoppingCart" className="w-6 h-6 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                onClick={buyNow}
                disabled={!product.inStock || addingToCart}
                variant="secondary"
                size="lg"
                className="flex-1 text-lg py-6"
              >
                <ApperIcon name="Zap" className="w-6 h-6 mr-2" />
                Buy Now
              </Button>

              <Button
                onClick={toggleWishlist}
                variant={isInWishlist ? "accent" : "outline"}
                size="lg"
                className="px-6"
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`} 
                />
              </Button>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Features */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3">Why Buy From Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <ApperIcon name="Truck" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <ApperIcon name="RotateCcw" className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <ApperIcon name="Shield" className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">2-Year Warranty</p>
                    <p className="text-sm text-gray-600">Manufacturer warranty included</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section Anchor */}
        <div id="reviews-section" className="mt-16 scroll-mt-8">
          {/* Reviews will be added here in future enhancement */}
        </div>
      </div>
    </div>
  )
}

export default ProductPage