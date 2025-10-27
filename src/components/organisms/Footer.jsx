import { Link } from "react-router-dom"
import Logo from "@/components/atoms/Logo"
import ApperIcon from "@/components/ApperIcon"

const Footer = () => {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", path: "/products" },
        { name: "Categories", path: "/categories" },
        { name: "Brands", path: "/brands" },
        { name: "Deals", path: "/deals" },
        { name: "New Arrivals", path: "/new-arrivals" }
      ]
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "FAQ", path: "/faq" },
        { name: "Shipping Info", path: "/shipping" },
        { name: "Returns", path: "/returns" },
        { name: "Size Guide", path: "/size-guide" }
      ]
    },
    {
      title: "About",
      links: [
        { name: "Our Story", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Sustainability", path: "/sustainability" },
        { name: "Affiliate Program", path: "/affiliate" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Accessibility", path: "/accessibility" }
      ]
    }
  ]

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    { name: "Youtube", icon: "Youtube", url: "https://youtube.com" }
  ]

  const paymentMethods = [
    "Visa", "Mastercard", "American Express", "PayPal", "Apple Pay", "Google Pay"
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="font-bold text-xl text-white">MarketHub</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your premier destination for quality products, unbeatable deals, and exceptional shopping experience.
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200"
                  >
                    <ApperIcon name={social.icon} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-400">
                © {new Date().getFullYear()} MarketHub. All rights reserved.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-4">We accept:</span>
              <div className="flex items-center space-x-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method}
                    className="w-12 h-8 bg-white rounded flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {method.includes(" ") ? method.split(" ").map(w => w[0]).join("") : method.slice(0, 4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer