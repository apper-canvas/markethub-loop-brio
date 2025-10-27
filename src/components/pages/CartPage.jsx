import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Empty from "@/components/ui/Empty"
import { useLocalStorage } from "@/hooks/useLocalStorage"

const CartPage = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useLocalStorage("cart", [])
  const [updatingItems, setUpdatingItems] = useState(new Set())

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdatingItems(prev => new Set(prev).add(productId))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setCart(cart.map(item => 
        item.Id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ))
      
      toast.success("Quantity updated")
    } catch (error) {
      toast.error("Failed to update quantity")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const removeItem = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const removedItem = cart.find(item => item.Id === productId)
      setCart(cart.filter(item => item.Id !== productId))
      
      toast.success(`${removedItem?.title} removed from cart`)
    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const clearCart = () => {
    setCart([])
    toast.success("Cart cleared")
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.08 // 8% tax
  }

  const calculateShipping = (subtotal) => {
    return subtotal >= 50 ? 0 : 9.99
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = subtotal + tax + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <Empty
            message="Your cart is empty"
            description="Add some products to get started with your shopping"
            actionText="Continue Shopping"
            onAction={() => navigate("/")}
            icon="ShoppingCart"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-error hover:text-error hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card p-6 transition-all duration-300 ${
                  updatingItems.has(item.Id) ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/product/${item.slug}`}
                      className="font-semibold text-gray-900 hover:text-primary transition-colors duration-200 line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.Id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItems.has(item.Id)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="Minus" className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.Id, item.quantity + 1)}
                      disabled={item.quantity >= 10 || updatingItems.has(item.Id)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.Id)}
                    disabled={updatingItems.has(item.Id)}
                    className="p-2 text-gray-400 hover:text-error transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ApperIcon name="ArrowRight" className="ml-2 w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full mt-3"
                asChild
              >
                <Link to="/">
                  <ApperIcon name="ArrowLeft" className="mr-2 w-5 h-5" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CartPage