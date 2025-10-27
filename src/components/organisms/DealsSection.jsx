import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CountdownTimer from "@/components/molecules/CountdownTimer"
import ProductCard from "@/components/organisms/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { productService } from "@/services/api/productService"
import { dealTimerService } from "@/services/api/dealTimerService"
import { cn } from "@/utils/cn"

const DealsSection = ({ className }) => {
  const [dealProducts, setDealProducts] = useState([])
  const [dealTimer, setDealTimer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <section className={cn("py-16", className)}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Flash Deals</h2>
            <div className="skeleton h-24 w-80 mx-auto mb-8"></div>
          </div>
          <Loading variant="product-grid" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Flash Deals</h2>
          <Error message={error} onRetry={loadDealsData} />
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-16 bg-gradient-to-br from-accent/5 to-orange-500/5", className)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🔥 Flash Deals
          </h2>
          {dealTimer && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-lg border border-accent/20">
              <CountdownTimer
                targetDate={dealTimer.endDate}
                title="⚡ Limited Time Offer!"
              />
            </div>
          )}
        </motion.div>

        {/* Products Grid - Responsive Horizontal Scroll */}
        <div className="relative">
          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {dealProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} showQuickView />
              </motion.div>
            ))}
          </div>

          {/* Tablet Grid */}
          <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6">
            {dealProducts.slice(0, 2).map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} showQuickView />
              </motion.div>
            ))}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin pb-4">
              {dealProducts.slice(0, 4).map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-none w-72"
                >
                  <ProductCard product={product} showQuickView />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        {dealProducts.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="btn btn-accent px-8 py-3 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              View All Deals
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default DealsSection