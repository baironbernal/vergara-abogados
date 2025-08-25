import { useState, useMemo } from "react"
import { MapPin, Search, Filter } from "lucide-react"
import SecondaryLayout from "@/Layouts/SecondaryLayout"
import { BannerInformative, MainButton } from "@/Components"
import { Link } from '@inertiajs/react'

const ITEMS_PER_PAGE = 6

export default function Properties({ states, properties, municipalities }) {
  const [currentPage, setCurrentPage] = useState(1)
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

  return (
    <SecondaryLayout>
      <div className="min-h-screen bg-whiteki">
       

        <div className="px-4 py-12 mx-auto max-w-7xl">
          {/* Filters Section */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <aside className="flex-shrink-0 lg:w-80">
              <div className="sticky p-8 bg-white border shadow-lg border-softGrey top-4">
                <h2 className="flex items-center gap-3 mb-8 text-xl font-medium text-darki font-dmsans">
                  <Filter className="w-6 h-6 text-golden" />
                  Filtros de Búsqueda
                </h2>

                <div className="space-y-6">
                  {/* State Filter */}
                  <div>
                    <label className="block mb-3 text-sm font-medium text-darki font-dmsans">Departamento</label>
                    <select 
                      value={filters.state_id} 
                      onChange={(e) => handleFilterChange("state_id", e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans"
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
                    <label className="block mb-3 text-sm font-medium text-darki font-dmsans">Municipio</label>
                    <select 
                      value={filters.municipality_id} 
                      onChange={(e) => handleFilterChange("municipality_id", e.target.value)}
                      disabled={!filters.state_id}
                      className="w-full px-4 py-3 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden disabled:bg-softGrey disabled:cursor-not-allowed font-dmsans"
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
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-darki font-dmsans">Rango de Precio</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Precio mínimo"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        className="px-4 py-3 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans"
                      />
                      <input
                        type="number"
                        placeholder="Precio máximo"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        className="px-4 py-3 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans"
                      />
                    </div>
                  </div>

                  {/* Property Type Filter */}
                  <div>
                    <label className="block mb-3 text-sm font-medium text-darki font-dmsans">Tipo de Propiedad</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans"
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
                  <div className="pt-6 text-sm border-t border-softGrey text-greyki font-dmsans">
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

            {/* Main Content */}
            <main className="flex-1">
              {/* Property Grid */}
              <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 xl:grid-cols-3">
                {paginatedProperties.map((property) => (
                  <div key={property.id} className="bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    <div className="relative">
                      <img
                        src={property.thumbnail ? `/storage/${property.thumbnail}` : "/placeholder.svg"}
                        alt={property.name}
                        className="object-cover w-full h-56"
                      />
                      <span className="absolute px-3 py-1 text-xs font-medium shadow-lg top-4 right-4 bg-golden text-whiteki font-dmsans">
                        {property.type}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-3 text-xl font-medium leading-tight text-darki font-dmsans">{property.name}</h3>
                      <p className="mb-4 text-2xl font-bold text-golden font-prata">{formatPrice(property.price)}</p>

                      <div className="flex items-center mb-4 text-greyki">
                        <MapPin className="w-5 h-5 mr-2 text-golden" />
                        <span className="text-sm font-dmsans">
                          {getMunicipalityName(property.municipality_id)}, {getStateName(property.state_id)}
                        </span>
                      </div>

                      {property.size && (
                        <div className="mb-4 text-sm text-greyki font-dmsans">
                          <strong>Área:</strong> {property.size} m²
                        </div>
                      )}

                      {property.description && (
                        <p className="mb-6 text-sm leading-relaxed text-greyki line-clamp-3 font-dmsans">
                          {property.description}
                        </p>
                      )}
                    </div>

                    <div className="px-6 pb-6">
                      <MainButton as={Link} href={`/inmobiliaria/${property.id}`} className="w-full">
                        Ver Detalles
                      </MainButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <MainButton
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-3 text-sm disabled:bg-softGrey disabled:cursor-not-allowed"
                  >
                    Anterior
                  </MainButton>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[44px] px-4 py-3 text-sm font-medium font-dmsans transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-golden text-whiteki shadow-lg scale-110'
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
                    className="px-5 py-3 text-sm disabled:bg-softGrey disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </MainButton>
                </div>
              )}

              {/* No Results */}
              {filteredProperties.length === 0 && (
                <div className="py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="mb-4 text-2xl font-medium text-darki font-prata">No se encontraron propiedades</h3>
                    <p className="mb-8 text-lg text-greyki font-dmsans">No hay propiedades que coincidan con tus criterios de búsqueda</p>
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
                      className="px-8 py-4 shadow-lg"
                    >
                      Limpiar Todos los Filtros
                    </MainButton>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </SecondaryLayout>
  )
}