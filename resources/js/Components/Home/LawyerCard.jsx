export const LawyerCard = ({ lawyer }) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden bg-softGrey h-96">
      {/* Lawyer Image - Grayscale with hover transition */}
      <div className="relative h-full w-full">
        {lawyer.image ? (
          <img
            src={lawyer.image}
            alt={lawyer.name}
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-softGrey to-graykiSecondary">
            <div className="w-32 h-32 bg-whiteki text-darki flex items-center justify-center text-6xl font-prata rounded-full">
              {lawyer.name?.charAt(0) || '?'}
            </div>
          </div>
        )}
        
        {/* Bottom Text Container with Background */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-darki/90 via-darki/50 to-transparent overflow-hidden">
          
          {/* Name and Profession - Always Visible, gets pushed up by additional info on hover */}
          <div className="transform group-hover:-translate-y-20 transition-transform duration-500 text-left">
            <h3 className="text-xl font-light text-whiteki font-prata mb-1">
              {lawyer.name}
            </h3>
            <p className="text-golden font-dmsans text-sm font-medium">
              {lawyer.profession || 'Owner, Partner'}
            </p>
          </div>

          {/* Additional Information - Hidden by default, appears from below on hover */}
          <div className="absolute bottom-6 left-6 right-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 text-left">
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
                    className="hover:text-golden transition-colors duration-200"
                  >
                    {lawyer.phone}
                  </a>
                </div>
              )}
              
              {lawyer.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-greyki">|</span>
                  <button className="hover:text-golden transition-colors duration-200">
                    vCard
                  </button>
                  <span className="text-greyki">|</span>
                  <a 
                    href={`mailto:${lawyer.email}`}
                    className="hover:text-golden transition-colors duration-200"
                  >
                    E-Mail
                  </a>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default LawyerCard