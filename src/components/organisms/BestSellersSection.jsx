import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProductCard from "@/components/organisms/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { productService } from "@/services/api/productService"
import { cn } from "@/utils/cn"

const BestSellersSection = ({ className }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overall")

  const tabs = [
    { id: "overall", label: "Overall", category: null },
    { id: "electronics", label: "Electronics", category: "electronics" },
    { id: "fashion", label: "Fashion", category: "fashion" },
    { id: "home", label: "Home", category: "home-garden" }
  ]

  useEffect(() => {
    loadBestSellers()
  }, [activeTab])

  const loadBestSellers = async () => {
    try {
      setLoading(true)
      setError(null)
      const activeTabData = tabs.find(tab => tab.id === activeTab)
      const data = await productService.getBestSellers(activeTabData?.category)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId)
    }
  }

  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🏆 Best Sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular products loved by thousands of customers
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <Loading variant="product-grid" />
          ) : error ? (
            <Error message={error} onRetry={loadBestSellers} />
          ) : products.length === 0 ? (
            <Empty
              message="No best sellers found"
              description="Check back later for popular products in this category"
              icon="TrendingUp"
            />
          ) : (
            <div className="product-grid">
              {products.map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard 
                    product={product} 
                    showQuickView 
                    imageSize="large"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default BestSellersSection