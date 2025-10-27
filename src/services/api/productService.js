import productsData from "@/services/mockData/products.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(400)
    return [...productsData]
  },

  async getById(id) {
    await delay(200)
    const product = productsData.find(product => product.Id === parseInt(id))
    if (!product) {
      throw new Error(`Product with id ${id} not found`)
    }
    return { ...product }
  },

  async getBySlug(slug) {
    await delay(200)
    const product = productsData.find(product => product.slug === slug)
    if (!product) {
      throw new Error(`Product with slug ${slug} not found`)
    }
    return { ...product }
  },

  async getByCategory(categoryId) {
    await delay(350)
    return productsData.filter(product => product.categoryId === categoryId)
  },

  async getBestSellers(category = null) {
    await delay(300)
    let products = [...productsData]
    
    if (category && category !== "overall") {
      products = products.filter(product => product.categoryId === category)
    }

    return products
      .filter(product => product.tags?.includes("bestseller"))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  },

  async getDeals() {
    await delay(300)
    return productsData
      .filter(product => product.tags?.includes("deal"))
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 8)
  },

  async getNewArrivals() {
    await delay(300)
    return productsData
      .filter(product => product.tags?.includes("new"))
      .slice(0, 8)
  },

  async getRecommendedProducts() {
    await delay(350)
    // Simulate personalized recommendations
    return productsData
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
  },

async search(query) {
    await delay(400)
    const lowercaseQuery = query.toLowerCase()
    return productsData.filter(product => 
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  },

  async getFiltered(options = {}) {
    await delay(400)
    const {
      category = null,
      brand = null,
      minPrice = 0,
      maxPrice = Infinity,
      search = "",
      sortBy = "relevance",
      page = 1,
      perPage = 24
    } = options

    let filtered = [...productsData]

    // Category filter
    if (category) {
      filtered = filtered.filter(product => product.categoryId === category)
    }

    // Brand filter
    if (brand) {
      filtered = filtered.filter(product => product.brandId === brand)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )

    // Search filter
    if (search) {
      const lowercaseQuery = search.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered = filtered.filter(p => p.tags?.includes("new"))
        break
      default:
        // Relevance - keep original order
        break
    }

    // Pagination
    const total = filtered.length
    const start = (page - 1) * perPage
    const end = start + perPage
    const products = filtered.slice(start, end)

    return {
      products,
      total,
      page,
      perPage,
totalPages: Math.ceil(total / perPage)
    }
  },

  async getBrandById(brandId) {
    await delay(200)
    try {
      const { brandService } = await import("@/services/api/brandService")
      return await brandService.getById(brandId)
    } catch (err) {
      throw new Error(`Brand with id ${brandId} not found`)
    }
  }
}