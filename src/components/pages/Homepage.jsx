import HeroCarousel from "@/components/organisms/HeroCarousel"
import CategoryGrid from "@/components/organisms/CategoryGrid"
import DealsSection from "@/components/organisms/DealsSection"
import BestSellersSection from "@/components/organisms/BestSellersSection"
import NewArrivalsSection from "@/components/organisms/NewArrivalsSection"
import BrandsSection from "@/components/organisms/BrandsSection"
import BenefitsBar from "@/components/organisms/BenefitsBar"
import NewsletterSection from "@/components/organisms/NewsletterSection"
import { motion } from "framer-motion"

const Homepage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container py-8"
      >
        <HeroCarousel />
      </motion.section>

      {/* Category Showcase */}
      <CategoryGrid />

      {/* Flash Deals Section */}
      <DealsSection />

      {/* Benefits Bar */}
      <BenefitsBar />

      {/* Best Sellers Section */}
      <BestSellersSection />

      {/* New Arrivals Section */}
      <NewArrivalsSection />

      {/* Featured Brands */}
      <BrandsSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

export default Homepage