import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/Tabs"
import RatingStars from "@/components/molecules/RatingStars"
import PriceDisplay from "@/components/molecules/PriceDisplay"
import ImageLightbox from "@/components/molecules/ImageLightbox"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { brandService } from "@/services/api/brandService"
import { reviewService } from "@/services/api/reviewService"
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
  const [activeTab, setActiveTab] = useState("description")
  const [reviews, setReviews] = useState([])
  const [ratingSummary, setRatingSummary] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewFilter, setReviewFilter] = useState("all")
  const [reviewSort, setReviewSort] = useState("helpful")
  const [lightboxImages, setLightboxImages] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [expandedReviews, setExpandedReviews] = useState({})
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

      // Load reviews and rating summary
      loadReviews(data.Id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async (productId) => {
    try {
      setReviewsLoading(true)
      const [reviewsData, summaryData] = await Promise.all([
        reviewService.getByProductId(productId, { filter: reviewFilter, sortBy: reviewSort }),
        reviewService.getRatingSummary(productId)
      ])
      setReviews(reviewsData)
      setRatingSummary(summaryData)
    } catch (err) {
      console.log("Error loading reviews:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    if (product?.Id) {
      loadReviews(product.Id)
    }
  }, [reviewFilter, reviewSort])

  const handleMarkHelpful = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId)
      setReviews(prev => prev.map(review => 
        review.Id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ))
      toast.success("Thanks for your feedback!")
    } catch (err) {
      toast.error("Failed to mark as helpful")
    }
  }

  const openLightbox = (images, index) => {
    setLightboxImages(images)
    setLightboxIndex(index)
  }

  const toggleReviewExpanded = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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

{/* Product Details Tabs Section */}
        <div id="product-details" className="mt-16">
          <Tabs value={activeTab} className="w-full">
            <TabsList className="w-full border-b border-gray-200">
              <TabsTrigger
                active={activeTab === "description"}
                onClick={() => setActiveTab("description")}
              >
                <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger
                active={activeTab === "reviews"}
                onClick={() => setActiveTab("reviews")}
              >
                <ApperIcon name="Star" className="w-4 h-4 mr-2" />
                Reviews ({ratingSummary?.totalReviews || 0})
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className={activeTab === "description" ? "block" : "hidden"}>
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-8">
                {/* Product Description */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                  <div 
                    className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: product.description || `
                        <p>Experience unparalleled performance and reliability with this premium product. Designed with cutting-edge technology and built to last, it delivers exceptional results for both personal and professional use.</p>
                        <p>Key highlights include:</p>
                        <ul>
                          <li>Superior build quality with premium materials</li>
                          <li>Advanced features for enhanced productivity</li>
                          <li>Energy-efficient design for extended use</li>
                          <li>Backed by comprehensive warranty and support</li>
                        </ul>
                        <p>Whether you're a professional seeking top-tier performance or an enthusiast demanding the best, this product exceeds expectations in every way.</p>
                      `
                    }}
                  />
                </div>

                {/* Specifications */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
                  <div className="space-y-6">
                    {/* Technical Specs */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Specifications</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900 w-1/3">Processor</td>
                              <td className="py-3 px-4 text-gray-700">Intel Core i7-12700H (12th Gen)</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">RAM</td>
                              <td className="py-3 px-4 text-gray-700">16GB DDR5</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Storage</td>
                              <td className="py-3 px-4 text-gray-700">512GB NVMe SSD</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Graphics</td>
                              <td className="py-3 px-4 text-gray-700">NVIDIA GeForce RTX 3050 Ti</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Display</td>
                              <td className="py-3 px-4 text-gray-700">15.6" FHD IPS (1920x1080)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Physical Specs */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Physical Dimensions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900 w-1/3">Weight</td>
                              <td className="py-3 px-4 text-gray-700">1.8 kg (3.97 lbs)</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Dimensions</td>
                              <td className="py-3 px-4 text-gray-700">35.8 x 24.4 x 1.99 cm</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Color</td>
                              <td className="py-3 px-4 text-gray-700">Space Gray</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Additional Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900 w-1/3">Battery</td>
                              <td className="py-3 px-4 text-gray-700">56Wh, up to 8 hours</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Connectivity</td>
                              <td className="py-3 px-4 text-gray-700">WiFi 6, Bluetooth 5.2</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Ports</td>
                              <td className="py-3 px-4 text-gray-700">2x USB-C, 2x USB-A, HDMI, Audio Jack</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Operating System</td>
                              <td className="py-3 px-4 text-gray-700">Windows 11 Pro</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 bg-gray-50 font-medium text-gray-900">Warranty</td>
                              <td className="py-3 px-4 text-gray-700">2 Years Manufacturer Warranty</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <ApperIcon name="Package" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">What's in the Box</p>
                        <p className="text-sm">Laptop, Power Adapter, User Manual, Warranty Card</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ApperIcon name="Shield" className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Warranty Coverage</p>
                        <p className="text-sm">2-year manufacturer warranty covering all hardware defects. Extended warranty available for purchase.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ApperIcon name="Truck" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Shipping Information</p>
                        <p className="text-sm">Free shipping on orders over $500. Delivery within 3-5 business days.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ApperIcon name="RotateCcw" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Return Policy</p>
                        <p className="text-sm">30-day hassle-free returns. Product must be in original condition with all accessories.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className={activeTab === "reviews" ? "block" : "hidden"}>
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-8">
                {ratingSummary && (
                  <>
                    {/* Rating Summary */}
                    <div className="grid md:grid-cols-2 gap-8 pb-8 border-b border-gray-200">
                      {/* Overall Rating */}
                      <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {ratingSummary.averageRating}
                        </div>
                        <RatingStars rating={ratingSummary.averageRating} size={24} className="mb-2 justify-center md:justify-start" />
                        <p className="text-gray-600">Based on {ratingSummary.totalReviews} reviews</p>
                      </div>

                      {/* Rating Distribution */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingSummary.distribution[star] || 0
                          const percentage = ratingSummary.totalReviews > 0 
                            ? (count / ratingSummary.totalReviews) * 100 
                            : 0
                          
                          return (
                            <div key={star} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-12">
                                <span className="text-sm font-medium text-gray-700">{star}</span>
                                <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                              </div>
                              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12 text-right">
                                {count}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-gray-200">
                      {/* Filter Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={reviewFilter === "all" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setReviewFilter("all")}
                        >
                          All Reviews
                        </Button>
                        <Button
                          variant={reviewFilter === "withPhotos" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setReviewFilter("withPhotos")}
                        >
                          <ApperIcon name="Image" className="w-4 h-4 mr-1" />
                          With Photos
                        </Button>
                        <Button
                          variant={reviewFilter === "verified" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setReviewFilter("verified")}
                        >
                          <ApperIcon name="BadgeCheck" className="w-4 h-4 mr-1" />
                          Verified Purchase
                        </Button>
                      </div>

                      {/* Sort Dropdown */}
                      <select
                        value={reviewSort}
                        onChange={(e) => setReviewSort(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 bg-white"
                      >
                        <option value="helpful">Most Helpful</option>
                        <option value="recent">Most Recent</option>
                        <option value="highestRating">Highest Rating</option>
                        <option value="lowestRating">Lowest Rating</option>
                      </select>
                    </div>

                    {/* Reviews List */}
                    {reviewsLoading ? (
                      <div className="flex justify-center py-12">
                        <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No reviews match your filters</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => {
                          const isExpanded = expandedReviews[review.Id]
                          const shouldTruncate = review.content.length > 200
                          const displayContent = shouldTruncate && !isExpanded
                            ? review.content.substring(0, 200) + "..."
                            : review.content

                          return (
                            <motion.div
                              key={review.Id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border-b border-gray-200 pb-6 last:border-0"
                            >
                              {/* Review Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">
                                      {review.reviewerName}
                                    </span>
                                    {review.verifiedPurchase && (
                                      <Badge variant="success" size="sm">
                                        <ApperIcon name="BadgeCheck" className="w-3 h-3 mr-1" />
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <RatingStars rating={review.rating} size={14} />
                                    <span>{formatDate(review.date)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Review Title */}
                              <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>

                              {/* Review Content */}
                              <p className="text-gray-700 mb-3 leading-relaxed">
                                {displayContent}
                              </p>
                              {shouldTruncate && (
                                <button
                                  onClick={() => toggleReviewExpanded(review.Id)}
                                  className="text-primary hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                                >
                                  {isExpanded ? "Read less" : "Read more"}
                                </button>
                              )}

                              {/* Review Images */}
                              {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-4 mt-4 overflow-x-auto scrollbar-hide">
                                  {review.images.slice(0, 4).map((image, index) => (
                                    <button
                                      key={index}
                                      onClick={() => openLightbox(review.images, index)}
                                      className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-all duration-200 group"
                                    >
                                      <img
                                        src={image}
                                        alt={`Review ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                                    </button>
                                  ))}
                                  {review.images.length > 4 && (
                                    <button
                                      onClick={() => openLightbox(review.images, 4)}
                                      className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 hover:border-primary flex items-center justify-center text-sm font-medium text-gray-700 transition-all duration-200"
                                    >
                                      +{review.images.length - 4}
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Review Actions */}
                              <div className="flex items-center gap-4 mt-4">
                                <button
                                  onClick={() => handleMarkHelpful(review.Id)}
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                                >
                                  <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                                  <span>Helpful ({review.helpfulCount})</span>
                                </button>
                                <button
                                  onClick={() => toast.info("Report functionality coming soon")}
                                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-error transition-colors duration-200"
                                >
                                  <ApperIcon name="Flag" className="w-4 h-4" />
                                  <span>Report</span>
                                </button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImages && (
          <ImageLightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxImages(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductPage