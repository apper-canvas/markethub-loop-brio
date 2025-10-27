import brandsData from "@/services/mockData/brands.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const brandService = {
  async getAll() {
    await delay(300)
    return [...brandsData]
  },

  async getFeatured() {
    await delay(250)
    return brandsData.filter(brand => brand.featured)
  },

  async getById(id) {
    await delay(200)
    const brand = brandsData.find(brand => brand.Id === parseInt(id))
    if (!brand) {
      throw new Error(`Brand with id ${id} not found`)
    }
    return { ...brand }
  },

  async getBySlug(slug) {
    await delay(200)
    const brand = brandsData.find(brand => brand.slug === slug)
    if (!brand) {
      throw new Error(`Brand with slug ${slug} not found`)
    }
    return { ...brand }
  }
}