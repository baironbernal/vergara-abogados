import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MainButton } from "@/Components"
import { LawyerCard } from "./LawyerCard"

export const LawyersSection = ({ lawyers = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (isMobile && lawyers.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === lawyers.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000) // Change every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isMobile, lawyers.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === lawyers.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? lawyers.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (!lawyers || lawyers.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-whiteki">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium text-darki font-prata mb-4">
            Nuestro Equipo Legal
          </h2>
          <p className="text-lg text-greyki font-dmsans max-w-3xl mx-auto">
            Contamos con un equipo de abogados especializados en derecho inmobiliario, 
            listos para brindarle la mejor asesoría legal en sus transacciones.
          </p>
        </div>

        {/* Desktop Layout - Flex Grid */}
        <div className="hidden lg:flex lg:gap-8 lg:justify-start lg:flex-wrap">
          {lawyers.slice(0, 3).map((lawyer, index) => (
            <LawyerCard key={lawyer.id || index} lawyer={lawyer} />
          ))}
        </div>

        {/* Mobile Layout - Carousel */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {lawyers.map((lawyer, index) => (
                <div key={lawyer.id || index} className="w-full flex-shrink-0 px-4">
                  <LawyerCard lawyer={lawyer} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          {lawyers.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-golden text-whiteki p-3 shadow-lg hover:bg-darki transition-all duration-300 z-10"
                aria-label="Anterior abogado"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-golden text-whiteki p-3 shadow-lg hover:bg-darki transition-all duration-300 z-10"
                aria-label="Siguiente abogado"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {lawyers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-golden transform scale-125'
                        : 'bg-graykiSecondary hover:bg-golden'
                    }`}
                    aria-label={`Ir al abogado ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Call to Action */}
        {lawyers.length > 3 && (
          <div className="text-center mt-12">
            <MainButton className="px-8 py-4">
              Ver Todo el Equipo
            </MainButton>
          </div>
        )}
      </div>
    </section>
  )
}

export default LawyersSection