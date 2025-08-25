
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Scale } from "lucide-react"
import { MainButton } from "@/Components";
import { Link } from "@inertiajs/react"

const carouselImages = [
  "/images/banner/classical-courthouse.png",
  "/images/banner/supreme-court-pillars.png",
]

export const MainBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={carouselImages[currentImageIndex] || "/placeholder.svg"}
              alt="Legal building"
              className="object-cover w-full h-full"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-sm font-medium tracking-wide text-white/90 md:text-base"
          >
            # Vergara Abogados
          </motion.p>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-light leading-relaxed tracking-tight text-white md:text-6xl lg:text-7xl font-prata">
              <span className="inline-block mr-4 text-transparent bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text">
                Somos 
              </span>

              <span className="inline-flex items-center px-4 py-2 mx-4 border rounded-lg bg-amber-600/20 backdrop-blur-sm border-amber-400/30">
                <Scale className="w-8 h-8 mr-2 md:w-12 md:h-12 text-amber-400" />
                <span className="text-2xl font-bold text-amber-200 md:text-4xl lg:text-5xl"> nosotros </span>
              </span>
              <br />
              <span className="text-white">Profesional respaldo Juridico</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-2xl mb-12 text-lg leading-relaxed text-white/80 md:text-xl"
          >
            Haz realidad tus sueños de vivienda con respaldo legal y confianza.
            Experiencia que guía, compromiso que acompaña, tranquilidad que perdura.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}>
            <MainButton as={Link} className={'max-w-[12rem] py-4'} href="/contacto">
                Contactanos
                <ArrowRight className="w-5 h-5 ml-2" />
            </MainButton>
            
          </motion.div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute z-20 transform -translate-x-1/2 bottom-8 left-1/2">
        <div className="flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-golden scale-125" : "bg-red hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
