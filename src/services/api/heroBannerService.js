import heroBannersData from "@/services/mockData/heroBanners.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const heroBannerService = {
  async getAll() {
    await delay(300)
    return [...heroBannersData].sort((a, b) => a.order - b.order)
  },

  async getById(id) {
    await delay(200)
    const banner = heroBannersData.find(banner => banner.Id === parseInt(id))
    if (!banner) {
      throw new Error(`Hero banner with id ${id} not found`)
    }
    return { ...banner }
  }
}