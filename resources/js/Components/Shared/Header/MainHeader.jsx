import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Info } from "./Info"
import { Menu } from "./Menu"


export const MainHeader = () => {
  const [hideTopBar, setHideTopBar] = useState(false)
  const [lastScroll, setLastScroll] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll > lastScroll && currentScroll > 30) {
        setHideTopBar(true)
      } else {
        setHideTopBar(false)
      }

      setLastScroll(currentScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScroll])

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: hideTopBar ? -56 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* MainHeader 1 (top bar) */}
        <Info/>
        {/* MainHeader 2 (main menu) */}
        <Menu/>
      </motion.div>
    </header>
  )
}