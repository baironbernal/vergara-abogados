import { useState } from "react"
import { useSteps } from "@/hooks/useStep"
import { ContactForm, Calendar } from "@/Components"

export const MultiStep = ({ citations, lawyers }) => {
  const { currentStep, isFirstStep, isLastStep, next, back } = useSteps(3)
  const [citationId, setCitationId] = useState(null)
  const [formData, setFormData] = useState(null)

  const handleFormSuccess = (values, savedCitationId) => {
    setFormData(values)
    setCitationId(savedCitationId)
    next()
  }

  // Get selected lawyer info
  const getSelectedLawyer = () => {
    if (!formData || !formData.lawyer_id) return null;
    if (formData.lawyer_id === 'cualquiera') return { name: 'Cualquiera' };
    return lawyers.find(lawyer => lawyer.id == formData.lawyer_id);
  }

  const handleCalendarSuccess = () => {
    next() // Go to confirmation step
  }

  return (
    <section className="w-full h-full max-w-3xl">
      {/* Step Content */}
      {currentStep === 0 && (
        <section>
          <ContactForm lawyers={lawyers} onSuccess={handleFormSuccess}/>
        </section>
      )}

      {currentStep === 1 && (
        <Calendar
          citations={citations}
          back={back}
          citationId={citationId}
          onSuccess={handleCalendarSuccess}
          selectedLawyerId={formData?.lawyer_id}
        />
      )}

      {currentStep === 2 && (
        <ConfirmationStep formData={formData} selectedLawyer={getSelectedLawyer()} />
      )}
    </section>
  )
}

// Confirmation Step Component
const ConfirmationStep = ({ formData, selectedLawyer }) => {
  return (
    <div className="text-center">
      <div className="max-w-md mx-auto">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Thank You Message */}
        <h2 className="mb-4 text-2xl font-medium text-darki font-prata">
          ¡Gracias por tu reserva!
        </h2>

        <p className="mb-6 text-lg text-greyki font-dmsans">
          Estaremos contactando contigo pronto
        </p>

        {formData && (
          <div className="p-6 text-left border bg-whiteki border-softGrey">
            <h3 className="mb-3 font-medium text-darki font-dmsans">Datos de tu reserva:</h3>
            <div className="space-y-2 text-sm text-greyki font-dmsans">
              <p><strong>Nombre:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Teléfono:</strong> {formData.phone}</p>
              {selectedLawyer && (
                <p><strong>Abogado seleccionado:</strong> {selectedLawyer.name}</p>
              )}
              {formData.observations && (
                <p><strong>Observaciones:</strong> {formData.observations}</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 font-medium transition-colors duration-300 bg-golden text-whiteki hover:bg-darki font-dmsans"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}


