import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { categoryService } from "@/services/api/categoryService"
import { cn } from "@/utils/cn"

const CategoryGrid = ({ className, title = "Shop by Category" }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getFeatured()
      setCategories(data)
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">{title}</h2>
          <Loading variant="category-grid" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">{title}</h2>
          <Error message={error} onRetry={loadCategories} />
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of premium products across all categories
          </p>
        </motion.div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/category/${category.slug}`}
                className="card card-hover group p-6 text-center transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 border-2 hover:border-primary/20"
              >
                {/* Category Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300 group-hover:scale-110">
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>

                {/* Product Count */}
                <p className="text-sm text-gray-600 mb-4">
                  {category.productCount.toLocaleString()} products
                </p>

                {/* Arrow Icon */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <ApperIcon name="ArrowRight" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid