import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const BenefitsBar = ({ className }) => {
  const benefits = [
    {
      icon: "Truck",
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: "RotateCcw",
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: "HeadphonesIcon",
      title: "24/7 Support",
      description: "Expert customer service"
    },
    {
      icon: "Shield",
      title: "Secure Payments",
      description: "SSL encrypted checkout"
    }
  ]

  return (
    <section className={cn("py-16 bg-gradient-to-r from-primary to-accent text-white", className)}>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                <ApperIcon name={benefit.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-white/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsBar