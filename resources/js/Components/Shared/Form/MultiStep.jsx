import { useSteps } from "../../../hooks/useStep"
import { ContactForm } from "@/Components/Shared/Form/ContactForm"
import { Calendar } from "@/Components/Shared/Calendar/Calendar"

export const MultiStep = ({ citations , lawyers}) => {

    const { isFirstStep, isLastStep, next, back } = useSteps(2)

  return (
    <section className="w-full h-full max-w-3xl ">
        <div className="flex flex-col items-start justify-end w-full mx-auto">
          <h1 className="text-2xl tracking-normal ">
            Reserva tu cita
          </h1>
          <p className="mt-2 mb-10 text-sm text-gray-600">
          Miventore veritatis et quasi architecto beatae vitae dicta sunt nemo enim consequuntur magni dolores eos.
          </p>
        </div>
        {/* Step Content */}
          {isFirstStep  && (
            <ContactForm lawyers={lawyers} onSuccess={() => next()}/>
          )}

          {isLastStep && (
            <Calendar citations={citations} back={back}  />
          )}
      
    </section>
  )
}


