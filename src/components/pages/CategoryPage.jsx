import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const CategoryPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to products page with category filter
    navigate(`/products?category=${slug}`, { replace: true })
  }, [slug, navigate])

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="skeleton h-8 w-64 mb-8"></div>
        <div className="flex gap-8">
          <div className="hidden lg:block w-64">
            <div className="skeleton h-96"></div>
          </div>
          <div className="flex-1">
            <div className="product-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage