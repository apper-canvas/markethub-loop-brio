import { useState } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const NewsletterForm = ({ className }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Successfully subscribed! Check your email for your 10% discount code.")
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("max-w-md mx-auto", className)}>
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button 
          type="submit" 
          variant="accent" 
          loading={loading}
          className="px-6"
        >
          Subscribe
        </Button>
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">
        <ApperIcon name="Lock" className="w-3 h-3 inline mr-1" />
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  )
}

export default NewsletterForm