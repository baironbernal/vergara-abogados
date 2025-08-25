import { Mail, Phone, Star } from "lucide-react"
import { MainButton } from "@/Components"

export const LawyerCard = ({ lawyer }) => {
  return (
    <div className="bg-white shadow-lg border border-softGrey overflow-hidden hover:shadow-xl transition-all duration-300 w-full lg:w-auto lg:flex-1 lg:max-w-sm">
      {/* Lawyer Image */}
      <div className="relative h-64 bg-gradient-to-br from-golden to-darki">
        {lawyer.image ? (
          <img
            src={`/storage/${lawyer.image}`}
            alt={lawyer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-whiteki text-golden flex items-center justify-center text-4xl font-prata">
              {lawyer.name?.charAt(0) || '?'}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Lawyer Info */}
      <div className="p-6">
        <h3 className="text-xl font-medium text-darki font-dmsans mb-2">
          {lawyer.name}
        </h3>
        
        <p className="text-golden font-medium font-dmsans mb-4">
          {lawyer.profession || 'Abogado Especialista'}
        </p>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          {lawyer.email && (
            <div className="flex items-center text-greyki">
              <Mail className="w-4 h-4 mr-3 text-golden flex-shrink-0" />
              <a 
                href={`mailto:${lawyer.email}`}
                className="text-sm font-dmsans hover:text-golden transition-colors duration-200 truncate"
                title={lawyer.email}
              >
                {lawyer.email}
              </a>
            </div>
          )}
          
          {lawyer.phone && (
            <div className="flex items-center text-greyki">
              <Phone className="w-4 h-4 mr-3 text-golden flex-shrink-0" />
              <a 
                href={`tel:${lawyer.phone}`}
                className="text-sm font-dmsans hover:text-golden transition-colors duration-200"
              >
                {lawyer.phone}
              </a>
            </div>
          )}
        </div>

        {/* Rating Stars (placeholder) */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className="w-4 h-4 text-golden fill-current" 
            />
          ))}
        </div>

        {/* CTA Button */}
        <MainButton className="w-full text-sm">
          Agendar Cita
        </MainButton>
      </div>
    </div>
  )
}

export default LawyerCard