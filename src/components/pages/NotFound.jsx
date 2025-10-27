import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <div className="container max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ApperIcon name="Search" className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to shopping!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <Button variant="primary" size="lg" asChild>
              <Link to="/">
                <ApperIcon name="Home" className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <Link to="/deals">
                <ApperIcon name="Percent" className="w-5 h-5 mr-2" />
                View Deals
              </Link>
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-t border-gray-200 pt-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Categories
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                to="/category/electronics" 
                className="text-primary hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Electronics
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/category/fashion" 
                className="text-primary hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Fashion
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/category/home-garden" 
                className="text-primary hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Home & Garden
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                to="/category/sports" 
                className="text-primary hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sports
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound