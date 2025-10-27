import dealTimersData from "@/services/mockData/dealTimers.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const dealTimerService = {
  async getAll() {
    await delay(200)
    return [...dealTimersData]
  },

  async getActive() {
    await delay(200)
    const now = new Date()
    return dealTimersData.filter(timer => new Date(timer.endDate) > now)
  },

  async getById(id) {
    await delay(150)
    const timer = dealTimersData.find(timer => timer.Id === parseInt(id))
    if (!timer) {
      throw new Error(`Deal timer with id ${id} not found`)
    }
    return { ...timer }
  }
}