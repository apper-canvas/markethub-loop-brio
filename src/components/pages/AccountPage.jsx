import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { useLocalStorage } from "@/hooks/useLocalStorage"

const AccountPage = () => {
  const [cart] = useLocalStorage("cart", [])
  const [wishlist] = useLocalStorage("wishlist", [])

  const menuItems = [
    {
      icon: "Package",
      title: "Orders",
      description: "Track your orders and view order history",
      badge: "3 Active"
    },
    {
      icon: "Heart",
      title: "Wishlist",
      description: "Items you've saved for later",
      badge: `${wishlist.length} items`
    },
    {
      icon: "User",
      title: "Profile",
      description: "Manage your personal information"
    },
    {
      icon: "MapPin",
      title: "Addresses",
      description: "Manage your shipping addresses"
    },
    {
      icon: "CreditCard",
      title: "Payment Methods",
      description: "Manage your payment options"
    },
    {
      icon: "Settings",
      title: "Settings",
      description: "Account preferences and notifications"
    }
  ]

  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      total: 129.99,
      status: "Delivered",
      items: 3
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-20",
      total: 79.99,
      status: "Shipped",
      items: 2
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-22",
      total: 199.99,
      status: "Processing",
      items: 1
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-success bg-success/10"
      case "Shipped":
        return "text-info bg-info/10"
      case "Processing":
        return "text-warning bg-warning/10"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-lg text-gray-600">
            Manage your orders, wishlist, and account settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Menu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Welcome back!</h3>
                  <p className="text-gray-600">Manage your account</p>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon 
                        name={item.icon} 
                        className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors duration-200" 
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Package" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
                <p className="text-gray-600">Total Orders</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="ShoppingCart" className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{cart.length}</h3>
                <p className="text-gray-600">Items in Cart</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Heart" className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{wishlist.length}</h3>
                <p className="text-gray-600">Wishlist Items</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.id}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()} • {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total}</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="primary" size="lg" className="justify-start">
                  <ApperIcon name="Package" className="w-5 h-5 mr-3" />
                  Track an Order
                </Button>
                <Button variant="outline" size="lg" className="justify-start">
                  <ApperIcon name="RotateCcw" className="w-5 h-5 mr-3" />
                  Return an Item
                </Button>
                <Button variant="outline" size="lg" className="justify-start">
                  <ApperIcon name="MessageCircle" className="w-5 h-5 mr-3" />
                  Contact Support
                </Button>
                <Button variant="outline" size="lg" className="justify-start">
                  <ApperIcon name="Download" className="w-5 h-5 mr-3" />
                  Download Invoice
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage