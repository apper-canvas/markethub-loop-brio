import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const SearchBar = ({ className, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState("")
const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      setQuery("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex", className)}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-r-none pr-12"
      />
      <Button
        type="submit"
        variant="primary"
        className="rounded-l-none px-4"
        disabled={!query.trim()}
      >
        <ApperIcon name="Search" className="w-4 h-4" />
      </Button>
    </form>
  )
}

export default SearchBar