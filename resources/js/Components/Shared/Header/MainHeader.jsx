import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Info } from "./Info"
import { Menu } from "./Menu"

export const MainHeader = ({ styles }) => {
  const [hideTopBar, setHideTopBar] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)
  const [isContactPage, setIsContactPage] = useState(false)

  // Check if we're on the contact page
  useEffect(() => {
    const path = window.location.pathname
    const isContact = path === '/contacto'
    setIsContactPage(isContact)

    // If on contact page, hide the top bar immediately
    if (isContact) {
      setHideTopBar(true)
    } else {
      setHideTopBar(false)
    }
  }, [])

  // Handle scroll behavior
  useEffect(() => {
    // Don't add scroll listener if on contact page
    if (isContactPage) {
      return
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY

      // Hide top bar when scrolling down and past 30px
      if (currentScroll > lastScroll && currentScroll > 30) {
        setHideTopBar(true)
      }
      // Only show top bar when at the very top of the page
      else if (currentScroll <= 30) {
        setHideTopBar(false)
      }
      // Keep hidden when scrolling up but not at the top

      setLastScroll(currentScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll, isContactPage])

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: hideTopBar ? -56 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* MainHeader 1 (top bar) */}
        <Info styles={styles}/>
        {/* MainHeader 2 (main menu) */}
        <Menu styles={styles}/>
      </motion.div>
    </header>
  )
}
