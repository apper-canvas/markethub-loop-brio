import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Footer from "@/components/organisms/Footer"
import ScrollToTop from "@/components/organisms/ScrollToTop"

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Layout