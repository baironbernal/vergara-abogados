
import { useContactForm } from "@/hooks/useContactForm"
import { MainButton } from "@/Components";

export const ContactForm = ({ lawyers = null, onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting, isSubmitSuccessful } = useContactForm(onSuccess)

  return (
    <div className="mx-auto ">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="flex justify-between">
        <div>
          <input
            {...register("name")}
            placeholder="Tu nombre"
            className="w-full px-4 transition-colors bg-transparent border-2 h-14 border-golden focus:outline-none focus:border-blueki placeholder:text-gray-500"
          />
          {errors.name && <p className="mt-2 text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Tu email"
            className="w-full px-4 transition-colors bg-transparent border-2 h-14 border-golden focus:outline-none focus:border-blueki placeholder:text-gray-500"
          />
          {errors.email && <p className="mt-2 text-red-600">{errors.email.message}</p>}
        </div>
        </section>

        <div>
          <input
            {...register("phone")}
            placeholder="Tu teléfono"
            className="w-full px-4 transition-colors bg-transparent border-2 h-14 border-golden focus:outline-none focus:border-blueki placeholder:text-gray-500"
          />
          {errors.phone && <p className="mt-2 text-red-600">{errors.phone.message}</p>}
        </div>

        {lawyers && (
          <div>
            <select
              {...register("lawyer_id")}
              className="w-full px-4 text-gray-500 transition-colors bg-transparent border-2 h-14 border-golden focus:outline-none focus:border-blueki"
            >
              <option value="" className="text-gray-500">Selecciona un abogado</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.id}>
                  {lawyer.name}
                </option>
              ))}
            </select>
            {errors.lawyer && <p className="mt-2 text-red-600">{errors.lawyer.message}</p>}
          </div>
        )}

        <div>
          <textarea
            {...register("observations")}
            placeholder="Cuentanos tu historia"
            rows={5}
            className="w-full px-4 py-4 transition-colors bg-transparent border-2 resize-none border-golden focus:outline-none focus:border-blueki placeholder:text-gray-500"
          />
          {errors.observations && <p className="mt-2 text-red-600">{errors.observations.message}</p>}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("agree")}
            className="w-5 h-5 border-2 rounded text-golden border-golden focus:ring-golden"
          />
          <span className="text-sm text-gray-700">Acepto la política de privacidad</span>
        </label>
        {errors.agree && <p className="mt-2 text-red-600">{errors.agree.message}</p>}


       
        <MainButton type="submit" 
            disabled={isSubmitting}
            className={'mx-auto w-full py-4'}>
                Enviar
          </MainButton>

        {isSubmitSuccessful && <p className="font-semibold text-center text-green-600">¡Gracias por contactarnos!</p>}
      </form>
    </div>
  )
}
