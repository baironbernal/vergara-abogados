import { Link } from "@inertiajs/react"

export const LawyerCard = ({ lawyer }) => {
  return (
    <Link href={`/abogados/${lawyer.slug}`} className="relative block overflow-hidden cursor-pointer group bg-softGrey h-96">
      {/* Lawyer Image - Grayscale with hover transition */}
      <div className="relative w-full h-full">
        {lawyer.image ? (
          <img
            src={`/storage/${lawyer.image}`}
            alt={lawyer.name}
            className="object-cover w-full h-full transition-all duration-500 filter grayscale group-hover:grayscale-0"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-softGrey to-graykiSecondary">
            <div className="flex items-center justify-center w-32 h-32 text-6xl rounded-full bg-whiteki text-darki font-prata">
              {lawyer.name?.charAt(0) || '?'}
            </div>
          </div>
        )}

        {/* Bottom Text Container with Background */}
        <div className="absolute bottom-0 left-0 right-0 p-6 overflow-hidden bg-gradient-to-t from-darki/90 via-darki/50 to-transparent">

          {/* Name and Profession - Always Visible, gets pushed up by additional info on hover */}
          <div className="text-left transition-transform duration-500 transform group-hover:-translate-y-20">
            <h3 className="mb-1 text-xl font-light text-whiteki font-prata">
              {lawyer.name}
            </h3>
            <p className="text-sm font-medium text-golden font-dmsans">
              {lawyer.profession || 'Owner, Partner'}
            </p>
          </div>

          {/* Additional Information - Hidden by default, appears from below on hover */}
          <div className="absolute text-left transition-transform duration-500 transform translate-y-full bottom-6 left-6 right-6 group-hover:translate-y-0">
            {/* Address Information */}
            <div className="mb-3 text-sm text-whiteki font-dmsans">
              <p>Cl. 12 #8 05, Suite 1400</p>
              <p>Soacha, Cundinamarca 10018</p>
            </div>

            {/* Contact Information with separators */}
            <div className="text-sm text-whiteki font-dmsans">
              {lawyer.phone && (
                <div className="mb-2">
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="transition-colors duration-200 hover:text-golden"
                  >
                    {lawyer.phone}
                  </a>
                </div>
              )}

              {lawyer.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-greyki">|</span>
                  <button className="transition-colors duration-200 hover:text-golden">
                    vCard
                  </button>
                  <span className="text-greyki">|</span>
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="transition-colors duration-200 hover:text-golden"
                  >
                    E-Mail
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}

export default LawyerCard
