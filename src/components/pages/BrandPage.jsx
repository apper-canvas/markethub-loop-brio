import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import ProductCard from "@/components/organisms/ProductCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { brandService } from "@/services/api/brandService"
import { productService } from "@/services/api/productService"

const BrandPage = () => {
  const { slug } = useParams()
  const [brand, setBrand] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBrandData()
  }, [slug])

  const loadBrandData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [brandData, allProducts] = await Promise.all([
        brandService.getBySlug(slug),
        productService.getAll()
      ])
      
      setBrand(brandData)
      // Filter products by brand
      const brandProducts = allProducts.filter(product => product.brandId === slug)
      setProducts(brandProducts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
          <Error message={error} onRetry={loadBrandData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <Link to="/brands" className="hover:text-primary">Brands</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{brand?.name}</span>
        </nav>

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-12 text-center mb-12 bg-gradient-to-br from-gray-50 to-white border-2"
        >
          <img
            src={brand?.logoUrl}
            alt={brand?.name}
            className="h-20 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {brand?.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium products from {brand?.name}, featuring quality craftsmanship 
            and innovative designs that meet the highest standards.
          </p>
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {brand?.name} Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <Empty
              message="No products available"
              description={`We're working on adding more ${brand?.name} products soon!`}
              icon="Package"
            />
          ) : (
            <div className="product-grid">
              {products.map((product, index) => (
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
            </div>
          )}
        </motion.div>

        {/* Brand Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Award" className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Every product meets strict quality standards and is built to last.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Truck" className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600">
              Free shipping on all {brand?.name} products over $50.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Shield" className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Warranty</h3>
            <p className="text-gray-600">
              Extended warranty coverage on all {brand?.name} products.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BrandPage