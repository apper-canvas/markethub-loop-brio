import reviewsData from "@/services/mockData/reviews.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reviewService = {
  async getByProductId(productId, options = {}) {
    await delay(400)
    const {
      filter = "all", // all, withPhotos, verified
      sortBy = "helpful" // helpful, recent, highestRating, lowestRating
    } = options

    let reviews = reviewsData.filter(review => review.productId === parseInt(productId))

    // Apply filters
    if (filter === "withPhotos") {
      reviews = reviews.filter(review => review.images && review.images.length > 0)
    } else if (filter === "verified") {
      reviews = reviews.filter(review => review.verifiedPurchase === true)
    }

    // Apply sorting
    switch (sortBy) {
      case "helpful":
        reviews.sort((a, b) => b.helpfulCount - a.helpfulCount)
        break
      case "recent":
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "highestRating":
        reviews.sort((a, b) => b.rating - a.rating)
        break
      case "lowestRating":
        reviews.sort((a, b) => a.rating - b.rating)
        break
      default:
        break
    }

    return [...reviews]
  },

  async getRatingSummary(productId) {
    await delay(300)
    const reviews = reviewsData.filter(review => review.productId === parseInt(productId))
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    const distribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1
      return acc
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      distribution
    }
  },

  async markHelpful(reviewId) {
    await delay(200)
    // In real app, this would update the backend
    // For mock, we just simulate success
    return { success: true }
  }
}