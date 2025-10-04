import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, MapPin, Home, Maximize, Calendar, Eye, Heart } from "lucide-react"
import { Link } from "@inertiajs/react"
import { MainButton } from "@/Components"

export default function PropertyModal({ property, isOpen, onClose, states, municipalities }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Reset image index when property changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [property?.id])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !property) {
    return null
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStateName = (stateId) => {
    const state = states.find(s => s.id === stateId)
    return state ? state.name : ''
  }

  const getMunicipalityName = (municipalityId) => {
    const municipality = municipalities.find(m => m.id === municipalityId)
    return municipality ? municipality.name : ''
  }

  // Create images array using the proper storage URL accessors
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full h-full max-w-6xl max-h-[95vh] mx-4 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-softGrey bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-darki font-prata line-clamp-1">
              {property.name}
            </h2>
            <span className="px-3 py-1 text-sm font-medium bg-golden text-whiteki font-dmsans">
              {property.type_spanish}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 transition-colors duration-200 text-greyki hover:text-darki hover:bg-softGrey"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={images[selectedImageIndex]}
                  alt={property.name}
                  className="w-full h-80 lg:h-96 object-cover border border-softGrey"
                />
                
                {/* Image Navigation */}
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
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-darki/80 text-whiteki px-3 py-1 text-sm font-dmsans">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 8).map((image, index) => (
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
                  {images.length > 8 && (
                    <div className="w-full h-20 bg-softGrey border-2 border-softGrey flex items-center justify-center text-sm text-greyki font-dmsans">
                      +{images.length - 8} más
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Property Info */}
            <div className="space-y-6">
              {/* Price and Location */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-golden font-prata">
                    {formatPrice(property.price)}
                  </span>
                </div>
                
                <div className="flex items-center text-greyki mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-golden" />
                  <span className="font-dmsans">
                    {getMunicipalityName(property.municipality_id)}, {getStateName(property.state_id)}
                  </span>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-softGrey">
                {property.size && (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Home className="w-6 h-6 text-golden" />
                    </div>
                    <div className="text-xl font-bold text-darki font-prata">{property.size}</div>
                    <div className="text-sm text-greyki font-dmsans">m² construidos</div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6 text-golden" />
                  </div>
                  <div className="text-xl font-bold text-darki font-prata">Disponible</div>
                  <div className="text-sm text-greyki font-dmsans">Para visita</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-lg font-medium text-darki font-dmsans mb-3">
                    Descripción
                  </h3>
                  <p className="text-greyki font-dmsans leading-relaxed line-clamp-4">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-softGrey">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center px-4 py-2 border border-golden text-golden hover:bg-golden hover:text-whiteki transition-all duration-300 font-medium font-dmsans">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorito
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-darki text-darki hover:bg-darki hover:text-whiteki transition-all duration-300 font-medium font-dmsans">
                    <Eye className="w-4 h-4 mr-2" />
                    Contactar
                  </button>
                </div>
                
                <MainButton 
                  as={Link} 
                  href={`/inmobiliaria/${property.id}`}
                  className="w-full py-3 text-center"
                  onClick={onClose}
                >
                  Ver Detalles Completos
                </MainButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}