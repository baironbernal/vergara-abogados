import { useState } from "react"
import { Search, Calendar, User, Clock, ArrowRight, Filter } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { BannerInformative, MainButton, MotionWrapper } from "@/Components"
import { useSeoManager } from "@/hooks/useSeoManager"

const ITEMS_PER_PAGE = 9

export default function BlogIndex({ blogs, filters, seo }) {
  useSeoManager(seo)
  const [searchTerm, setSearchTerm] = useState(filters.search || "")
  const [showFeatured, setShowFeatured] = useState(filters.featured === 'true')

  const handleSearch = (e) => {
    e.preventDefault()
    router.get('/blog', {
      search: searchTerm || undefined,
      featured: showFeatured ? 'true' : undefined
    }, { preserveState: true })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setShowFeatured(false)
    router.get('/blog', {}, { preserveState: true })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      {/* Banner */}
      <MotionWrapper>
        <BannerInformative
          picture="/images/shared/background-title.webp"
          title="Blog"
          description="Artículos, noticias y consejos sobre bienes raíces y derecho inmobiliario"
        />
      </MotionWrapper>

      <div className="min-h-screen bg-whiteki">
        <div className="px-4 py-8 mx-auto max-w-7xl lg:py-12">

          {/* Search and Filters */}
          <section className="mb-8 lg:mb-12">
            <MotionWrapper>
              <div className="p-6 shadow-lg lg:p-8">
                <form onSubmit={handleSearch} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-darki font-dmsans lg:mb-3">
                      Buscar artículos
                    </label>
                    <div className="relative">
                      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-greyki lg:w-5 lg:h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por título, contenido..."
                        className="w-full py-2 pl-10 pr-4 transition-all duration-200 border border-graykiSecondary focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden font-dmsans lg:py-3 lg:pl-12"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFeatured}
                        onChange={(e) => setShowFeatured(e.target.checked)}
                        className="w-4 h-4 mr-2 transition-colors duration-200 border-2 border-golden text-golden focus:ring-golden focus:ring-2 lg:w-5 lg:h-5 lg:mr-3"
                      />
                      <span className="text-sm font-medium text-darki font-dmsans">
                        Solo destacados
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <MainButton type="submit" className="px-6 py-2 lg:px-8 lg:py-3">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </MainButton>

                    {(searchTerm || showFeatured) && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 transition-colors duration-200 border text-greyki hover:text-darki font-dmsans border-graykiSecondary hover:border-darki lg:px-6 lg:py-3"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </MotionWrapper>
          </section>

          {/* Blog Grid */}
          <section>
            {blogs.data.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:gap-8 lg:grid-cols-3">
                  {blogs.data.map((blog) => (
                    <MotionWrapper key={blog.id}>
                      <article className="bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="relative">
                          <img
                            src={blog.featured_image ? `/storage/${blog.featured_image}` : "/placeholder.svg"}
                            alt={blog.title}
                            className="object-cover w-full h-40 sm:h-48"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        <div className="p-4 lg:p-6">
                          <h3 className="mb-2 text-lg font-medium line-clamp-2 text-darki font-prata lg:mb-3 lg:text-xl">
                            {blog.title}
                          </h3>

                          <p className="mb-3 text-sm text-greyki line-clamp-3 font-dmsans lg:mb-4 lg:text-base">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between mb-3 text-xs text-greyki lg:mb-4 lg:text-sm">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                              <span className="font-dmsans">{blog.user.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                              <span className="font-dmsans">{blog.reading_time} min</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-greyki lg:text-sm">
                              <Calendar className="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                              <span className="font-dmsans">
                                {formatDate(blog.published_at)}
                              </span>
                            </div>
                            <Link
                              href={`/blog/${blog.slug}`}
                              className="inline-flex items-center px-3 py-1 text-xs transition-colors duration-200 bg-golden text-whiteki hover:bg-darki font-dmsans lg:px-4 lg:py-2 lg:text-sm"
                            >
                              Leer más
                              <ArrowRight className="w-3 h-3 ml-1 lg:w-4 lg:h-4 lg:ml-2" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    </MotionWrapper>
                  ))}
                </div>

                {/* Pagination */}
                {blogs.last_page > 1 && (
                  <MotionWrapper>
                    <div className="flex flex-col items-center justify-center gap-4 mt-8 lg:flex-row lg:gap-3 lg:mt-12">
                      {blogs.prev_page_url && (
                        <Link
                          href={blogs.prev_page_url}
                          className="px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3"
                        >
                          Anterior
                        </Link>
                      )}

                      <div className="flex flex-wrap justify-center gap-1 lg:gap-2">
                        {Array.from({ length: blogs.last_page }, (_, i) => i + 1).map((page) => (
                          <Link
                            key={page}
                            href={`/blog?page=${page}`}
                            className={`min-w-[36px] px-3 py-2 text-sm font-medium font-dmsans transition-all duration-300 lg:min-w-[44px] lg:px-4 lg:py-3 ${
                              blogs.current_page === page
                                ? 'bg-golden text-whiteki shadow-lg scale-110'
                                : 'border border-graykiSecondary bg-white hover:bg-darki hover:text-whiteki'
                            }`}
                          >
                            {page}
                          </Link>
                        ))}
                      </div>

                      {blogs.next_page_url && (
                        <Link
                          href={blogs.next_page_url}
                          className="px-4 py-2 text-sm transition-colors duration-200 border border-golden text-golden hover:bg-golden hover:text-whiteki font-dmsans lg:px-5 lg:py-3"
                        >
                          Siguiente
                        </Link>
                      )}
                    </div>
                  </MotionWrapper>
                )}
              </>
            ) : (
              <MotionWrapper>
                <div className="py-12 text-center lg:py-16">
                  <div className="max-w-md mx-auto">
                    <h3 className="mb-4 text-xl font-medium text-darki font-prata lg:text-2xl">
                      No se encontraron artículos
                    </h3>
                    <p className="mb-6 text-base text-greyki font-dmsans lg:mb-8 lg:text-lg">
                      No hay artículos que coincidan con tus criterios de búsqueda
                    </p>
                    <MainButton onClick={clearFilters} className="px-6 py-3 m-auto shadow-lg lg:px-8 lg:py-4">
                      Ver todos los artículos
                    </MainButton>
                  </div>
                </div>
              </MotionWrapper>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
