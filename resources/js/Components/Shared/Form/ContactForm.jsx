
import { useContactForm } from "@/hooks/useContactForm"
import { MainButton } from "@/Components";

export const ContactForm = ({ lawyers = null, onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting, isSubmitSuccessful } = useContactForm(onSuccess)

  return (
    <div className="w-full max-w-4xl mx-auto 2xl:max-w-6xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-darki font-dmsans">
            Información Personal
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-darki font-dmsans">
                Nombre completo *
              </label>
              <input
                {...register("name")}
                placeholder="Ingresa tu nombre completo"
                className="w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 font-dmsans">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-darki font-dmsans">
                Correo electrónico *
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-dmsans">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-darki font-dmsans">
                Teléfono *
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+57 300 123 4567"
                className="w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 font-dmsans">{errors.phone.message}</p>
              )}
            </div>

            {lawyers && (
              <div>
                <label className="block mb-1 text-sm font-medium text-darki font-dmsans">
                  Abogado preferido
                </label>
                <select
                  {...register("lawyer_id")}
                  className="w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden focus:outline-none focus:border-blueki text-darki font-dmsans"
                >
                  <option value="" className="text-greyki">Selecciona un abogado</option>
                  <option value="cualquiera" className="text-darki">Cualquiera disponible</option>
                  {lawyers.map((lawyer) => (
                    <option key={lawyer.id} value={lawyer.id} className="text-darki">
                      {lawyer.name} - {lawyer.profession || 'Abogado'}
                    </option>
                  ))}
                </select>
                {errors.lawyer && (
                  <p className="mt-1 text-xs text-red-600 font-dmsans">{errors.lawyer.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Case Details */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-darki font-dmsans">
            Detalles del Caso
          </h3>

          <div>
            <label className="block mb-1 text-sm font-medium text-darki font-dmsans">
              Cuéntanos tu situación *
            </label>
            <textarea
              {...register("observations")}
              placeholder="Describe brevemente tu caso o consulta legal..."
              rows={4}
              className="w-full px-3 py-2 text-sm transition-all duration-200 bg-transparent border-2 border-golden resize-none focus:outline-none focus:border-blueki placeholder:text-greyki font-dmsans"
            />
            {errors.observations && (
              <p className="mt-1 text-xs text-red-600 font-dmsans">{errors.observations.message}</p>
            )}
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-softGrey/20">
            <input
              type="checkbox"
              {...register("agree")}
              className="w-4 h-4 mt-1 border-2 text-golden border-golden focus:ring-golden"
            />
            <div>
              <label className="text-sm font-medium text-darki font-dmsans cursor-pointer">
                Acepto la política de privacidad *
              </label>
              <p className="mt-1 text-xs text-greyki font-dmsans">
                Al enviar este formulario, aceptas que procesemos tu información de acuerdo con nuestra política de privacidad.
              </p>
            </div>
          </div>
          {errors.agree && (
            <p className="text-xs text-red-600 font-dmsans">{errors.agree.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <MainButton
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </MainButton>
        </div>

        {/* Success Message */}
        {isSubmitSuccessful && (
          <div className="p-4 text-center bg-green-50 border border-green-200">
            <p className="text-sm font-semibold text-green-700 font-dmsans">
              ¡Gracias por contactarnos! Te responderemos pronto.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
