import { useState } from "react"
import { MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, Home, Maximize, Calendar } from "lucide-react"
import { MainButton, SEOHead } from "@/Components"
import VisitForm from "@/Components/Properties/VisitForm"
import { Link } from '@inertiajs/react'

export default function PropertyDetail({ property, auth, seo }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const images = [
    property.thumbnail_url || "/placeholder.svg",
    ...(property.gallery_images || [])
  ]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleWhatsAppClick = (message) => {
    const phoneNumber = "+573115327297"
    const formattedNumber = phoneNumber.replace(/[\+\s\-\(\)]/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      <SEOHead seo={seo} />
      <div className="min-h-screen bg-whiteki">
        {/* Back Navigation */}
        <div className="px-4 py-4 mx-auto max-w-7xl">
            <Link
              href="/inmobiliaria"
              className="inline-flex items-center transition-colors duration-200 text-greyki hover:text-golden font-dmsans"
            >
              <ArrowLeft className="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
              Volver a Propiedades
            </Link>
          </div>

        <div className="px-4 py-6 mx-auto max-w-7xl lg:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={images[selectedImageIndex]}
                  alt={property.name}
                  className="w-full h-64 object-cover border border-softGrey cursor-pointer sm:h-80 lg:h-[500px]"
                  onClick={() => setIsGalleryOpen(true)}
                />
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="absolute flex items-center gap-2 px-2 py-1 text-xs transition-colors duration-200 top-3 right-3 bg-darki text-whiteki font-dmsans hover:bg-golden lg:top-4 lg:right-4 lg:px-3 lg:py-2 lg:text-sm"
                >
                  <Maximize className="w-3 h-3 lg:w-4 lg:h-4" />
                  Ver Galería
                </button>

                {/* Navigation arrows for main image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute p-1 transition-colors duration-200 transform -translate-y-1/2 left-2 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:left-4 lg:p-2"
                    >
                      <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute p-1 transition-colors duration-200 transform -translate-y-1/2 right-2 top-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:right-4 lg:p-2"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${property.name} - ${index + 1}`}
                      className={`w-full h-16 object-cover cursor-pointer border-2 transition-all duration-200 sm:h-20 lg:h-20 ${
                        selectedImageIndex === index
                          ? 'border-golden'
                          : 'border-softGrey hover:border-golden'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Property Info */}
            <div className="space-y-6 lg:space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="px-3 py-1 text-sm font-medium bg-golden text-whiteki font-dmsans w-fit">
                    {property.type}
                  </span>
                  <span className="text-2xl font-bold text-golden font-prata sm:text-3xl">
                    {formatPrice(property.price)}
                  </span>
                </div>

                <h1 className="mb-3 text-2xl font-medium text-darki font-prata sm:text-3xl lg:text-4xl">
                  {property.name}
                </h1>

                <div className="flex items-center mb-4 text-greyki lg:mb-6">
                  <MapPin className="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                  <span className="text-sm font-dmsans lg:text-base">
                    {property.municipality?.name}, {property.state?.name || 'Colombia'}
                  </span>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-softGrey sm:gap-6 sm:py-6">
                {property.size && (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Home className="w-5 h-5 text-golden lg:w-6 lg:h-6" />
                    </div>
                    <div className="text-xl font-bold text-darki font-prata lg:text-2xl">{property.size}</div>
                    <div className="text-xs text-greyki font-dmsans lg:text-sm">m² construidos</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-golden lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-xl font-bold text-darki font-prata lg:text-2xl">Disponible</div>
                  <div className="text-xs text-greyki font-dmsans lg:text-sm">Para visita</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="mb-3 text-lg font-medium text-darki font-dmsans lg:mb-4 lg:text-xl">
                    Descripción
                  </h3>
                  <p className="text-sm leading-relaxed text-greyki font-dmsans lg:text-base">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Contact Actions */}
              <div className="pt-4 space-y-4 border-t border-softGrey lg:pt-6">
                <MainButton
                  onClick={() => setIsVisitFormOpen(true)}
                  className="w-full py-3 text-base lg:py-4 lg:text-lg"
                >
                  Agendar Visita
                </MainButton>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => handleWhatsAppClick(`¡Hola! Me interesa obtener más información sobre la propiedad "${property.name}" (${formatPrice(property.price)}). ¿Podrían ayudarme con más detalles?`)}
                    className="px-4 py-2 font-medium transition-all duration-300 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans text-sm lg:px-6 lg:py-3 lg:text-base"
                  >
                    Solicitar Información
                  </button>
                  <button
                    onClick={() => handleWhatsAppClick(`¡Hola! Me interesa contactar con un asesor para la propiedad "${property.name}" (${formatPrice(property.price)}). ¿Podrían ayudarme?`)}
                    className="px-4 py-2 font-medium transition-all duration-300 border border-darki text-darki hover:bg-darki hover:text-whiteki font-dmsans text-sm lg:px-6 lg:py-3 lg:text-base"
                  >
                    Contactar Asesor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Gallery Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="relative flex items-center justify-center w-full h-full p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute z-10 p-2 transition-colors duration-200 top-4 right-4 bg-darki text-whiteki hover:bg-golden lg:top-6 lg:right-6 lg:p-3"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>

              {/* Main Image */}
              <img
                src={images[selectedImageIndex]}
                alt={property.name}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute p-2 transition-colors duration-200 left-4 top-1/2 transform -translate-y-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:left-8 lg:p-3"
                  >
                    <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute p-2 transition-colors duration-200 right-4 top-1/2 transform -translate-y-1/2 bg-darki/80 text-whiteki hover:bg-golden lg:right-8 lg:p-3"
                  >
                    <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-sm text-white bg-darki/80 rounded-lg lg:bottom-8 lg:text-base">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        )}

        {/* Visit Form Modal */}
        {isVisitFormOpen && (
          <VisitForm
            property={property}
            isOpen={isVisitFormOpen}
            onClose={() => setIsVisitFormOpen(false)}
          />
        )}
      </div>
    </>
  )
}
