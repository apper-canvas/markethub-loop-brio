import categoriesData from "@/services/mockData/categories.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const categoryService = {
  async getAll() {
    await delay(300)
    return [...categoriesData]
  },

  async getFeatured() {
    await delay(250)
    return categoriesData.filter(category => category.featured).slice(0, 12)
  },

  async getById(id) {
    await delay(200)
    const category = categoriesData.find(cat => cat.Id === parseInt(id))
    if (!category) {
      throw new Error(`Category with id ${id} not found`)
    }
    return { ...category }
  },

async getBySlug(slug) {
    await delay(200)
    const category = categoriesData.find(cat => cat.slug === slug)
    if (!category) {
      throw new Error(`Category with slug ${slug} not found`)
    }
    return { ...category }
  },

  async getCategoryTree() {
    await delay(250)
    // Return hierarchical category structure
    // In real app, this would come from database with parent-child relationships
    return categoriesData.map(category => ({
      ...category,
      subcategories: [] // Placeholder for future subcategory support
    }))
  }
}