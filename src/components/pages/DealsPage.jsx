import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import CountdownTimer from "@/components/molecules/CountdownTimer"
import ProductCard from "@/components/organisms/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { productService } from "@/services/api/productService"
import { dealTimerService } from "@/services/api/dealTimerService"

const DealsPage = () => {
  const [dealProducts, setDealProducts] = useState([])
  const [dealTimer, setDealTimer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("discount")

  useEffect(() => {
    loadDealsData()
  }, [])

  const loadDealsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [products, timers] = await Promise.all([
        productService.getDeals(),
        dealTimerService.getActive()
      ])
      
      setDealProducts(products)
      setDealTimer(timers[0] || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sortOptions = [
    { value: "discount", label: "Highest Discount" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" }
  ]

  const getSortedProducts = () => {
    let sorted = [...dealProducts]
    
    switch (sortBy) {
      case "discount":
        return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage)
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      default:
        return sorted
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="skeleton h-8 w-64 mb-8"></div>
          <div className="skeleton h-32 w-full mb-8"></div>
          <Loading variant="product-grid" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <Error message={error} onRetry={loadDealsData} />
        </div>
      </div>
    )
  }

  const sortedProducts = getSortedProducts()

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Deals</span>
        </nav>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🔥 Flash Deals & Special Offers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Don't miss out on incredible savings! Limited time offers on your favorite products.
          </p>
          
          {dealTimer && (
            <div className="bg-gradient-to-br from-accent/10 to-orange-500/10 rounded-2xl p-8 inline-block border border-accent/20">
              <CountdownTimer
                targetDate={dealTimer.endDate}
                title="⚡ Sale Ends In:"
              />
            </div>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
        >
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{sortedProducts.length}</span> deals available
          </p>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <Empty
            message="No deals available"
            description="Check back later for amazing deals and discounts!"
            icon="Percent"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="product-grid"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard 
                  product={product} 
                  showQuickView 
                  imageSize="large"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Deal Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary to-accent text-white rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Shop Our Deals?</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Get the best value for your money with our carefully curated deals and special offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Percent" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Up to 70% Off</h3>
              <p className="text-white/80">
                Massive savings on premium products from top brands.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Clock" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Limited Time</h3>
              <p className="text-white/80">
                Exclusive deals available for a limited time only.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Truck" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-white/80">
                Free shipping on all deal items over $50.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DealsPage