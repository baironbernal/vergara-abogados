import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MainButton, MotionWrapper } from "@/Components"
import { LawyerCard } from "./LawyerCard"
import { Link } from "@inertiajs/react"

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
    <section className="py-20 bg-whiteki">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <MotionWrapper>
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="mb-4 text-4xl font-medium md:text-5xl text-darki font-prata">
                Nuestro Equipo
              </h2>
              <p className="max-w-3xl text-lg text-greyki font-dmsans">
                Contamos con amplia experiencia en todas las industrias. Brindamos a cada cliente
                una combinación de conocimiento profundo de la industria y perspectivas expertas
                para ofrecer ideas frescas y soluciones innovadoras.
              </p>
            </div>
            <div className="hidden md:block">
              <Link href="/acerca" className="flex items-center gap-2 text-lg transition-colors duration-300 text-golden hover:text-darki font-dmsans">
                Ver Todos
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </MotionWrapper>

        {/* Desktop Layout - Professional Grid */}
        <MotionWrapper delay={0.2}>
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-0">
            {lawyers.slice(0, 3).map((lawyer, index) => (
              <MotionWrapper key={lawyer.id || index} delay={index * 0.1}>
                <LawyerCard lawyer={lawyer} />
              </MotionWrapper>
            ))}
          </div>
        </MotionWrapper>

        {/* Mobile Layout - Professional Carousel */}
        <MotionWrapper delay={0.2}>
          <div className="relative lg:hidden">
            <div className="overflow-hidden rounded-none">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {lawyers.map((lawyer, index) => (
                  <div key={lawyer.id || index} className="flex-shrink-0 w-full">
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
                className="absolute z-10 p-3 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-darki text-whiteki hover:bg-golden"
                aria-label="Anterior abogado"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute z-10 p-3 transition-all duration-300 transform -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-darki text-whiteki hover:bg-golden"
                aria-label="Siguiente abogado"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-3">
                {lawyers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
        </MotionWrapper>

        {/* Call to Action */}
        <MotionWrapper delay={0.4}>
          {lawyers.length > 3 && (
            <div className="mt-12 text-center">
              <MainButton as={Link} href="/acerca" className="px-8 py-4">
                Ver Todo el Equipo
              </MainButton>
            </div>
          )}
        </MotionWrapper>
      </div>
    </section>
  )
}

export default LawyersSection
