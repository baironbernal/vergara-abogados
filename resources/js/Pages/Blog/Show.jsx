import { useState } from "react"
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react"
import { Link } from "@inertiajs/react"
import { MainButton, MotionWrapper } from "@/Components"
import { useSeoManager } from "@/hooks/useSeoManager"

export default function BlogShow({ blog, relatedBlogs, seo }) {
  useSeoManager(seo)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content) => {
    return { __html: content }
  }

  const shareUrl = window.location.href
  const shareTitle = blog.title

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-whiteki">
        {/* Back Navigation */}
        <div className="bg-white border-b border-softGrey">
          <div className="px-4 py-4 mx-auto max-w-7xl">
            <Link 
              href="/blog" 
              className="inline-flex items-center transition-colors duration-200 text-greyki hover:text-golden font-dmsans"
            >
              <ArrowLeft className="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
              Volver al Blog
            </Link>
          </div>
        </div>

        <article className="px-4 py-8 mx-auto max-w-4xl lg:py-12">
          {/* Article Header */}
          <MotionWrapper>
            <header className="mb-8 text-center lg:mb-12">
              <h1 className="mb-4 text-2xl font-bold leading-tight text-darki font-prata sm:text-3xl md:text-4xl lg:text-5xl">
                {blog.title}
              </h1>
              
              <div className="flex flex-col items-center justify-center gap-3 mb-6 text-greyki sm:flex-row sm:gap-6 lg:mb-8">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                  <span className="text-sm font-dmsans lg:text-base">{blog.user.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                  <span className="text-sm font-dmsans lg:text-base">{formatDate(blog.published_at)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-golden lg:w-5 lg:h-5" />
                  <span className="text-sm font-dmsans lg:text-base">{blog.reading_time} min de lectura</span>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <span className="text-sm font-medium text-darki font-dmsans">
                  Compartir:
                </span>
                <div className="flex gap-2 lg:gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 transition-colors duration-200 border-2 border-golden text-golden hover:bg-golden hover:text-whiteki lg:w-10 lg:h-10"
                        aria-label={`Compartir en ${social.name}`}
                      >
                        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </header>
          </MotionWrapper>

          {/* Featured Image */}
          {blog.featured_image && (
            <MotionWrapper>
              <div className="mb-8 lg:mb-12">
                <img
                  src={`/storage/${blog.featured_image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg sm:h-64 lg:h-80"
                />
              </div>
            </MotionWrapper>
          )}

          {/* Article Content */}
          <MotionWrapper>
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-base leading-relaxed text-greyki font-dmsans lg:text-lg"
                dangerouslySetInnerHTML={formatContent(blog.content)}
              />
            </div>
          </MotionWrapper>

          {/* Related Articles */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <MotionWrapper>
              <section className="mt-12 lg:mt-16">
                <h2 className="mb-6 text-2xl font-bold text-darki font-prata lg:mb-8 lg:text-3xl">
                  Artículos Relacionados
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedBlogs.map((relatedBlog) => (
                    <article key={relatedBlog.id} className="bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      <div className="relative">
                        <img
                          src={relatedBlog.featured_image ? `/storage/${relatedBlog.featured_image}` : "/placeholder.svg"}
                          alt={relatedBlog.title}
                          className="object-cover w-full h-40 sm:h-48"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      
                      <div className="p-4 lg:p-6">
                        <h3 className="mb-2 text-lg font-medium line-clamp-2 text-darki font-prata lg:mb-3 lg:text-xl">
                          {relatedBlog.title}
                        </h3>
                        
                        <p className="mb-3 text-sm text-greyki line-clamp-3 font-dmsans lg:mb-4 lg:text-base">
                          {relatedBlog.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-greyki lg:text-sm">
                            <Calendar className="w-3 h-3 mr-1 text-golden lg:w-4 lg:h-4 lg:mr-2" />
                            <span className="font-dmsans">
                              {formatDate(relatedBlog.published_at)}
                            </span>
                          </div>
                          <Link
                            href={`/blog/${relatedBlog.slug}`}
                            className="inline-flex items-center px-3 py-1 transition-colors duration-200 bg-golden text-whiteki hover:bg-darki font-dmsans text-xs lg:px-4 lg:py-2 lg:text-sm"
                          >
                            Leer más
                            <ArrowRight className="w-3 h-3 ml-1 lg:w-4 lg:h-4 lg:ml-2" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </MotionWrapper>
          )}

          {/* Back to Blog Button */}
          <MotionWrapper>
            <div className="mt-12 text-center lg:mt-16">
              <MainButton as={Link} href="/blog" className="px-8 py-3 shadow-lg lg:px-10 lg:py-4">
                Volver al Blog
              </MainButton>
            </div>
          </MotionWrapper>
        </article>
      </div>
    </>
  )
}