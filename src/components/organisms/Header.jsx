import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "@/components/atoms/Logo"
import SearchBar from "@/components/molecules/SearchBar"
import CartButton from "@/components/molecules/CartButton"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Categories", path: "/categories", hasDropdown: true },
    { name: "Deals", path: "/deals" },
    { name: "New Arrivals", path: "/new-arrivals" },
    { name: "Brands", path: "/brands" },
    { name: "Sale", path: "/sale" }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Logo />

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <ApperIcon name="Search" className="w-6 h-6" />
            </button>

            {/* Account */}
            <Link
              to="/account"
              className="hidden sm:flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="User" className="w-6 h-6" />
              <span className="hidden md:inline text-sm font-medium">Account</span>
            </Link>

            {/* Cart */}
            <CartButton />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative flex items-center space-x-1 text-gray-700 hover:text-primary font-medium transition-colors duration-200 group"
            >
              <span>{item.name}</span>
              {item.hasDropdown && (
                <ApperIcon name="ChevronDown" className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <SearchBar className="w-full" />
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>

            {/* Mobile Account */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <Link
                to="/account"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ApperIcon name="User" className="w-6 h-6 text-gray-600" />
                <span className="font-medium text-gray-900">My Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header