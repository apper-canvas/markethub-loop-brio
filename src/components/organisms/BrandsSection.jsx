import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { brandService } from "@/services/api/brandService"
import { cn } from "@/utils/cn"

const BrandsSection = ({ className }) => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await brandService.getFeatured()
      setBrands(data)
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Featured Brands</h2>
          <Loading variant="brands" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={cn("py-16", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Featured Brands</h2>
          <Error message={error} onRetry={loadBrands} />
        </div>
      </section>
    )
  }

  if (!brands.length) {
    return (
      <section className={cn("py-16", className)}>
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Featured Brands</h2>
          <Empty
            message="No brands available"
            description="We're working on featuring amazing brands for you"
            icon="Award"
          />
        </div>
      </section>
    )
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
            Featured Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shop from your favorite brands with exclusive deals and latest collections
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.Id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/brand/${brand.slug}`}
                className="card card-hover group p-6 flex items-center justify-center h-24 bg-white border border-gray-100 transition-all duration-300 hover:border-primary/20 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5"
              >
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandsSection