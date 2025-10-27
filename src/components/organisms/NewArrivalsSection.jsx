import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import ProductCard from "@/components/organisms/ProductCard"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { productService } from "@/services/api/productService"
import { cn } from "@/utils/cn"

const NewArrivalsSection = ({ className }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    loadNewArrivals()
  }, [])

  const loadNewArrivals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getNewArrivals()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const itemsPerSlide = getItemsPerSlide()
      const maxIndex = Math.max(0, products.length - itemsPerSlide)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const itemsPerSlide = getItemsPerSlide()
      const maxIndex = Math.max(0, products.length - itemsPerSlide)
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 4
      if (window.innerWidth >= 768) return 3
      return 1
    }
    return 4
  }

  if (loading) {
    return (
      <section className={cn("py-16 bg-gray-50", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">✨ New Arrivals</h2>
          <Loading variant="product-grid" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={cn("py-16 bg-gray-50", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">✨ New Arrivals</h2>
          <Error message={error} onRetry={loadNewArrivals} />
        </div>
      </section>
    )
  }

  if (!products.length) {
    return (
      <section className={cn("py-16 bg-gray-50", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">✨ New Arrivals</h2>
          <Empty
            message="No new arrivals yet"
            description="Stay tuned for exciting new products coming soon!"
            icon="Package"
          />
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16 bg-gray-50", className)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-12"
        >
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ✨ New Arrivals
            </h2>
            <p className="text-lg text-gray-600">
              Fresh picks just added to our collection
            </p>
          </div>
          
          <Button variant="outline" size="lg" asChild>
            <Link to="/new-arrivals" className="inline-flex items-center">
              See All
              <ApperIcon name="ArrowRight" className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Products Carousel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / getItemsPerSlide())}%)`
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.Id}
                  className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard 
                      product={product} 
                      showQuickView 
                      imageSize="large"
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {products.length > getItemsPerSlide() && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-200 z-10"
              >
                <ApperIcon name="ChevronLeft" className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:bg-gray-50 transition-all duration-200 z-10"
              >
                <ApperIcon name="ChevronRight" className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewArrivalsSection