import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import ProductCard from "@/components/organisms/ProductCard"
import FilterAccordion from "@/components/molecules/FilterAccordion"
import PriceRangeSlider from "@/components/molecules/PriceRangeSlider"
import Pagination from "@/components/molecules/Pagination"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { productService } from "@/services/api/productService"
import { categoryService } from "@/services/api/categoryService"
import { brandService } from "@/services/api/brandService"

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Extract filters from URL
  const selectedCategory = searchParams.get("category") || ""
  const selectedBrands = searchParams.get("brands")?.split(",").filter(Boolean) || []
  const minPrice = parseInt(searchParams.get("minPrice") || "0")
  const maxPrice = parseInt(searchParams.get("maxPrice") || "1000")
  const searchQuery = searchParams.get("search") || ""
  const sortBy = searchParams.get("sort") || "relevance"
  const currentPage = parseInt(searchParams.get("page") || "1")

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [searchParams])

  const loadInitialData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoryService.getCategoryTree(),
        brandService.getAll()
      ])
      setCategories(categoriesData)
      setBrands(brandsData)
    } catch (err) {
      console.error("Failed to load filter data:", err)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await productService.getFiltered({
        category: selectedCategory || null,
        brand: selectedBrands.length > 0 ? selectedBrands[0] : null,
        minPrice,
        maxPrice,
        search: searchQuery,
        sortBy,
        page: currentPage,
        perPage: 24
      })

      setProducts(result.products)
      setTotalResults(result.total)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    // Reset to page 1 when filters change
    if (key !== "page") {
      newParams.set("page", "1")
    }
    setSearchParams(newParams)
  }

  const updateMultiFilter = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    // Reset to page 1 when filters change
    if (!updates.page) {
      newParams.set("page", "1")
    }
    setSearchParams(newParams)
  }

  const clearAllFilters = () => {
    setSearchParams({})
  }

  const toggleBrand = (brandId) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId]
    updateFilter("brands", newBrands.join(","))
  }

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" }
  ]

  const activeFiltersCount = [
    selectedCategory,
    selectedBrands.length > 0,
    minPrice > 0 || maxPrice < 1000,
    searchQuery
  ].filter(Boolean).length

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Active Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-blue-700"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-primary rounded-full">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => updateFilter("category", "")}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrands.map(brandId => (
              <span key={brandId} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-primary rounded-full">
                {brands.find(b => b.Id === parseInt(brandId))?.name}
                <button onClick={() => toggleBrand(brandId)}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(minPrice > 0 || maxPrice < 1000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-primary rounded-full">
                ${minPrice} - ${maxPrice}
                <button onClick={() => updateMultiFilter({ minPrice: "", maxPrice: "" })}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-primary rounded-full">
                "{searchQuery}"
                <button onClick={() => updateFilter("search", "")}>
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <FilterAccordion title="Categories" defaultOpen>
        <div className="space-y-2">
          {categories.map(category => (
            <label
              key={category.Id}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.slug}
                onChange={() => updateFilter("category", category.slug)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {category.name}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      {/* Price Range */}
      <FilterAccordion title="Price Range" defaultOpen>
        <PriceRangeSlider
          min={0}
          max={1000}
          value={[minPrice, maxPrice]}
          onChange={(values) => updateMultiFilter({
            minPrice: values[0].toString(),
            maxPrice: values[1].toString()
          })}
        />
      </FilterAccordion>

      {/* Brands */}
      <FilterAccordion title="Brands">
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {brands.slice(0, 20).map(brand => (
            <label
              key={brand.Id}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.Id.toString())}
                onChange={() => toggleBrand(brand.Id.toString())}
                className="w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterAccordion>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <Error message={error} onRetry={loadProducts} />
        </div>
      </div>
    )
  }

  const startResult = totalResults > 0 ? (currentPage - 1) * 24 + 1 : 0
  const endResult = Math.min(currentPage * 24, totalResults)

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Products</span>
          {selectedCategory && (
            <>
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                {categories.find(c => c.slug === selectedCategory)?.name}
              </span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          </h1>
          <p className="text-gray-600">
            Showing {startResult}-{endResult} of {totalResults.toLocaleString()} results
          </p>
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <ApperIcon name="SlidersHorizontal" className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 hidden sm:block">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto lg:hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ApperIcon name="X" className="w-5 h-5" />
                      </button>
                    </div>
                    <FilterSidebar />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSkeleton count={24} />
            ) : products.length === 0 ? (
              <Empty
                icon="Package"
                message="No products found"
                description={
                  activeFiltersCount > 0
                    ? "Try adjusting your filters or clearing them to see more results"
                    : "We couldn't find any products matching your search"
                }
                action={
                  activeFiltersCount > 0 ? (
                    <Button onClick={clearAllFilters} className="mt-4">
                      Clear All Filters
                    </Button>
                  ) : null
                }
              />
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="product-grid"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} showQuickView />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => updateFilter("page", page.toString())}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage