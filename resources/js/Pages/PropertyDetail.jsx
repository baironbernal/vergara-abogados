import { useState } from "react"
import { MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, Home, Maximize, Calendar } from "lucide-react"
import SecondaryLayout from "@/Layouts/SecondaryLayout"
import { MainButton } from "@/Components"
import { Link } from '@inertiajs/react'

export default function PropertyDetail({ property, auth }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const images = [
    property.thumbnail ? `/storage/${property.thumbnail}` : "/placeholder.svg",
    ...(property.gallery || []).map(image => `/storage/${image}`)
  ]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <SecondaryLayout>
      <div className="min-h-screen bg-whiteki">
        {/* Back Navigation */}
        <div className="bg-white border-b border-softGrey">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Link 
              href="/inmobiliaria" 
              className="inline-flex items-center text-greyki hover:text-golden transition-colors duration-200 font-dmsans"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Propiedades
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={images[selectedImageIndex]}
                  alt={property.name}
                  className="w-full h-96 lg:h-[500px] object-cover border border-softGrey cursor-pointer"
                  onClick={() => setIsGalleryOpen(true)}
                />
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="absolute top-4 right-4 bg-darki text-whiteki px-3 py-2 text-sm font-dmsans hover:bg-golden transition-colors duration-200 flex items-center gap-2"
                >
                  <Maximize className="w-4 h-4" />
                  Ver Galería
                </button>
                
                {/* Navigation arrows for main image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-darki/80 text-whiteki p-2 hover:bg-golden transition-colors duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-darki/80 text-whiteki p-2 hover:bg-golden transition-colors duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
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
                      className={`w-full h-20 object-cover cursor-pointer border-2 transition-all duration-200 ${
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
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-golden text-whiteki px-4 py-1 text-sm font-medium font-dmsans">
                    {property.type}
                  </span>
                  <span className="text-3xl font-bold text-golden font-prata">
                    {formatPrice(property.price)}
                  </span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-medium text-darki font-prata mb-4">
                  {property.name}
                </h1>
                
                <div className="flex items-center text-greyki mb-6">
                  <MapPin className="w-5 h-5 mr-2 text-golden" />
                  <span className="font-dmsans">
                    {property.municipality?.name}, {property.state?.name || 'Colombia'}
                  </span>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-softGrey">
                {property.size && (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Home className="w-6 h-6 text-golden" />
                    </div>
                    <div className="text-2xl font-bold text-darki font-prata">{property.size}</div>
                    <div className="text-sm text-greyki font-dmsans">m² construidos</div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6 text-golden" />
                  </div>
                  <div className="text-2xl font-bold text-darki font-prata">Disponible</div>
                  <div className="text-sm text-greyki font-dmsans">Para visita</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-xl font-medium text-darki font-dmsans mb-4">
                    Descripción
                  </h3>
                  <p className="text-greyki font-dmsans leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Contact Actions */}
              <div className="space-y-4 pt-6 border-t border-softGrey">
                <MainButton className="w-full py-4 text-lg">
                  Agendar Visita
                </MainButton>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="px-6 py-3 border border-golden text-golden hover:bg-golden hover:text-whiteki transition-all duration-300 font-medium font-dmsans">
                    Solicitar Información
                  </button>
                  <button className="px-6 py-3 border border-darki text-darki hover:bg-darki hover:text-whiteki transition-all duration-300 font-medium font-dmsans">
                    Contactar Asesor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Gallery Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-6 right-6 bg-darki text-whiteki p-3 hover:bg-golden transition-colors duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={images[selectedImageIndex]}
                alt={property.name}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-darki text-whiteki p-4 hover:bg-golden transition-colors duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-darki text-whiteki p-4 hover:bg-golden transition-colors duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-darki text-whiteki px-4 py-2 font-dmsans">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </SecondaryLayout>
  )
}