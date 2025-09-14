import { useState, useMemo } from "react"
import { MapPin, Search, Filter, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { BannerInformative, MainButton, SEOHead, MotionWrapper } from "@/Components"
import PropertyModal from "@/Components/Properties/PropertyModal"
import { Link } from '@inertiajs/react'

const ITEMS_PER_PAGE = 6

export default function Properties({ states, properties, municipalities, seo }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    municipality_id: "",
    state_id: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
  })

  // Get unique property types from properties data
  const propertyTypes = [...new Set(properties.map((p) => p.type))]

  // Get municipalities filtered by selected state
  const availableMunicipalities = useMemo(() => {
    if (!filters.state_id) return municipalities
    return municipalities.filter(m => m.state_id === parseInt(filters.state_id))
  }, [municipalities, filters.state_id])

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesMunicipality = !filters.municipality_id || property.municipality_id === parseInt(filters.municipality_id)
      const matchesState = !filters.state_id || property.state_id === parseInt(filters.state_id)
      const matchesMinPrice = !filters.minPrice || property.price >= Number.parseInt(filters.minPrice)
      const matchesMaxPrice = !filters.maxPrice || property.price <= Number.parseInt(filters.maxPrice)
      const matchesType = !filters.propertyType || property.type === filters.propertyType

      return (
        matchesMunicipality && matchesState && matchesMinPrice && matchesMaxPrice && matchesType
      )
    })
  }, [properties, filters])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to first page when filters change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset municipality when state changes
      ...(key === 'state_id' && { municipality_id: '' })
    }))
    setCurrentPage(1)
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

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  return (
    <>
      <SEOHead seo={seo} />
      <div className="min-h-screen bg-whiteki">


        <div className="px-4 py-8 mx-auto max-w-7xl lg:py-12">
          {/* Mobile Filters Toggle */}
          <MotionWrapper>
            <div className="mb-6 lg:hidden">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center justify-between w-full p-4 text-left bg-white border shadow-lg border-softGrey"
              >
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-golden" />
                  <span className="font-medium text-darki font-dmsans">Filtros de Búsqueda</span>
                </div>
                {isFiltersOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </MotionWrapper>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <MotionWrapper delay={0.1}>
              <aside className={`lg:flex-shrink-0 lg:w-80 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="p-6 bg-white border shadow-lg lg:sticky lg:top-4 border-softGrey lg:p-8">
                <h2 className="flex items-center gap-3 mb-6 text-lg font-medium text-darki font-dmsans lg:mb-8 lg:text-xl">
                  <Filter className="w-5 h-5 text-golden lg:w-6 lg:h-6" />
                  Filtros de Búsqueda
                </h2>

                <div className="space-y-4 lg:space-y-6">
                  {/* State Filter */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">Departamento</label>
                    <select
                      value={filters.state_id}
                      onChange={(e) => handleFilterChange("state_id", e.target.value)}
                      className="w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3"
                    >
                      <option value="">Todos los departamentos</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Municipality Filter */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">Municipio</label>
                    <select
                      value={filters.municipality_id}
                      onChange={(e) => handleFilterChange("municipality_id", e.target.value)}
                      disabled={!filters.state_id}
                      className="w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden disabled:bg-softGrey disabled:cursor-not-allowed font-dmsans lg:px-4 lg:py-3"
                    >
                      <option value="">Todos los municipios</option>
                      {availableMunicipalities.map((municipality) => (
                        <option key={municipality.id} value={municipality.id}>
                          {municipality.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2 lg:space-y-3">
                    <label className="block text-sm font-medium text-darki font-dmsans">Rango de Precio</label>
                    <div className="grid grid-cols-2 gap-2 lg:gap-3">
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        className="px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3"
                      />
                      <input
                        type="number"
                        placeholder="Máximo"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        className="px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3"
                      />
                    </div>
                  </div>

                  {/* Property Type Filter */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">Tipo de Propiedad</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                      className="w-full px-3 py-2 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:px-4 lg:py-3"
                    >
                      <option value="">Todos los tipos</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="pt-4 text-sm border-t border-softGrey text-greyki font-dmsans lg:pt-6">
                    Mostrando {filteredProperties.length} propiedades
                  </div>

                  {/* Clear Filters Button */}
                  <MainButton
                    onClick={() => {
                      setFilters({
                        municipality_id: "",
                        state_id: "",
                        minPrice: "",
                        maxPrice: "",
                        propertyType: "",
                      })
                      setCurrentPage(1)
                    }}
                    className="w-full"
                  >
                    Limpiar Filtros
                  </MainButton>
                </div>
              </div>
              </aside>
            </MotionWrapper>

            {/* Main Content */}
            <MotionWrapper delay={0.2}>
              <main className="flex-1">
                {/* Property Grid */}
                <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:gap-8 lg:mb-12 xl:grid-cols-3">

                  {paginatedProperties.map((property, index) => (

                    <MotionWrapper key={property.id} delay={index * 0.1}>
                      <div className="flex flex-col h-full bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    <div className="relative">

                      <img
                        src={property.thumbnail ? `/storage/${property.thumbnail}` : "/placeholder.svg"}
                        alt={property.name}
                        className="object-cover w-full h-48 sm:h-56"
                      />
                      <span className="absolute px-2 py-1 text-xs font-medium shadow-lg top-3 right-3 bg-golden text-whiteki font-dmsans lg:top-4 lg:right-4 lg:px-3 lg:py-1">
                        {property.type}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="flex flex-col flex-grow p-4 lg:p-6">
                      <h3 className="mb-2 text-lg font-medium leading-tight text-darki font-dmsans lg:mb-3 lg:text-xl">{property.name}</h3>
                      <p className="mb-3 text-xl font-bold text-golden font-prata lg:mb-4 lg:text-2xl">{formatPrice(property.price)}</p>

                      <div className="flex items-center mb-3 text-greyki lg:mb-4">
                        <MapPin className="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                        <span className="text-xs font-dmsans lg:text-sm">
                          {getMunicipalityName(property.municipality_id)}, {getStateName(property.state_id)}
                        </span>
                      </div>

                      {property.size && (
                        <div className="mb-3 text-xs text-greyki font-dmsans lg:mb-4 lg:text-sm">
                          <strong>Área:</strong> {property.size} m²
                        </div>
                      )}

                      {property.description && (
                        <p className="flex-grow mb-4 text-xs leading-relaxed text-greyki line-clamp-3 font-dmsans lg:mb-6 lg:text-sm">
                          {property.description}
                        </p>
                      )}
                    </div>

                    <div className="px-4 pb-4 mt-auto lg:px-6 lg:pb-6">
                      <MainButton as={Link} href={`/inmobiliaria/${property.id}`} className="w-full">
                        Ver Detalles
                      </MainButton>
                    </div>
                      </div>
                    </MotionWrapper>
                  ))}
              </div>

                {/* Pagination */}
                <MotionWrapper delay={0.3}>
                  {totalPages > 1 && (
                    <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-3">
                  <MainButton
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm disabled:bg-softGrey disabled:cursor-not-allowed lg:px-5 lg:py-3"
                  >
                    Anterior
                  </MainButton>

                  <div className="flex flex-wrap justify-center gap-1 lg:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] px-3 py-2 text-sm font-medium font-dmsans transition-all duration-300 lg:min-w-[44px] lg:px-4 lg:py-3 ${
                          currentPage === page
                            ? 'bg-darki text-whiteki shadow-lg scale-110'
                            : 'border border-graykiSecondary bg-white hover:bg-darki hover:text-whiteki'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <MainButton
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm disabled:bg-softGrey disabled:cursor-not-allowed lg:px-5 lg:py-3"
                  >
                    Siguiente
                  </MainButton>
                    </div>
                  )}
                </MotionWrapper>

                {/* No Results */}
                <MotionWrapper delay={0.4}>
                  {filteredProperties.length === 0 && (
                    <div className="w-full py-12 text-center lg:py-16">
                      <div className="w-full max-w-4xl px-4 mx-auto">
                        <h3 className="mb-4 text-xl font-medium text-darki font-prata lg:text-2xl">No se encontraron propiedades</h3>
                        <p className="mb-6 text-base text-greyki font-dmsans lg:mb-8 lg:text-lg">No hay propiedades que coincidan con tus criterios de búsqueda</p>
                        <MainButton
                          onClick={() => {
                            setFilters({
                              municipality_id: "",
                              state_id: "",
                              minPrice: "",
                              maxPrice: "",
                              propertyType: "",
                            })
                            setCurrentPage(1)
                          }}
                          className="px-6 py-3 mx-auto shadow-lg lg:px-8 lg:py-4"
                        >
                          Limpiar Todos los Filtros
                        </MainButton>
                      </div>
                    </div>
                  )}
                </MotionWrapper>
              </main>
            </MotionWrapper>
          </div>
        </div>
      </div>
    </>
  )
}
