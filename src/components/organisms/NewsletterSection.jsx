import { motion } from "framer-motion"
import NewsletterForm from "@/components/molecules/NewsletterForm"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const NewsletterSection = ({ className }) => {
  return (
    <section className={cn("py-16 bg-gradient-to-br from-accent/10 to-orange-500/10", className)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ApperIcon name="Mail" className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get 10% Off Your First Order!
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions.
          </p>

          {/* Newsletter Form */}
          <NewsletterForm />

          {/* Additional Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Gift" className="w-4 h-4 text-accent" />
              <span>Exclusive deals</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Bell" className="w-4 h-4 text-accent" />
              <span>Early access</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Star" className="w-4 h-4 text-accent" />
              <span>Product updates</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsletterSection