import { useState } from "react"
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, X } from "lucide-react"
import { MainButton } from "@/Components"
import { router } from "@inertiajs/react"

export default function VisitForm({ property, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visit_date: '',
    visit_time: '',
    observations: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido'
    if (!formData.visit_date) newErrors.visit_date = 'La fecha es requerida'
    if (!formData.visit_time) newErrors.visit_time = 'La hora es requerida'

    // Validate that the selected date is not in the past
    const selectedDate = new Date(formData.visit_date + 'T' + formData.visit_time)
    const now = new Date()
    if (selectedDate < now) {
      newErrors.visit_date = 'La fecha y hora deben ser futuras'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        },
        body: JSON.stringify({
          ...formData,
          property_id: property.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({
            name: '',
            email: '',
            phone: '',
            visit_date: '',
            visit_time: '',
            observations: ''
          })
          onClose()
        }, 3000)
      } else {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.message || 'Error al procesar la solicitud' })
        }
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Intente nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success screen
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative z-10 w-full max-w-md mx-4 bg-white shadow-2xl p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="mb-4 text-2xl font-medium text-darki font-prata">
            ¡Visita Agendada!
          </h2>
          
          <p className="mb-6 text-lg text-greyki font-dmsans">
            Nos contactaremos contigo pronto para confirmar los detalles.
          </p>
          
          <div className="p-4 text-left border bg-softGrey/20 border-softGrey rounded">
            <h3 className="mb-3 font-medium text-darki font-dmsans">Detalles de tu visita:</h3>
            <div className="space-y-2 text-sm text-greyki font-dmsans">
              <p><strong>Propiedad:</strong> {property.name}</p>
              <p><strong>Fecha:</strong> {new Date(formData.visit_date).toLocaleDateString('es-CO')}</p>
              <p><strong>Hora:</strong> {formData.visit_time}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] mx-4 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-softGrey">
          <div>
            <h2 className="text-2xl font-bold text-darki font-prata">Agendar Visita</h2>
            <p className="text-greyki font-dmsans">{property.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors duration-200 text-greyki hover:text-darki hover:bg-softGrey rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded">
                {errors.general}
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-darki font-dmsans flex items-center gap-2">
                <User className="w-5 h-5 text-golden" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darki font-dmsans mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${
                      errors.name ? 'border-red-300 focus:border-red-300' : 'border-graykiSecondary focus:border-golden'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-darki font-dmsans mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${
                      errors.phone ? 'border-red-300 focus:border-red-300' : 'border-graykiSecondary focus:border-golden'
                    }`}
                    placeholder="+57 300 123 4567"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-darki font-dmsans mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${
                    errors.email ? 'border-red-300 focus:border-red-300' : 'border-graykiSecondary focus:border-golden'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Visit Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-darki font-dmsans flex items-center gap-2">
                <Calendar className="w-5 h-5 text-golden" />
                Información de la Visita
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darki font-dmsans mb-2">
                    Fecha preferida *
                  </label>
                  <input
                    type="date"
                    name="visit_date"
                    value={formData.visit_date}
                    onChange={handleChange}
                    min={today}
                    className={`w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${
                      errors.visit_date ? 'border-red-300 focus:border-red-300' : 'border-graykiSecondary focus:border-golden'
                    }`}
                  />
                  {errors.visit_date && <p className="mt-1 text-sm text-red-600">{errors.visit_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-darki font-dmsans mb-2">
                    Hora preferida *
                  </label>
                  <input
                    type="time"
                    name="visit_time"
                    value={formData.visit_time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden ${
                      errors.visit_time ? 'border-red-300 focus:border-red-300' : 'border-graykiSecondary focus:border-golden'
                    }`}
                  />
                  {errors.visit_time && <p className="mt-1 text-sm text-red-600">{errors.visit_time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-darki font-dmsans mb-2">
                  Observaciones adicionales
                </label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-graykiSecondary transition-all duration-200 font-dmsans focus:outline-none focus:ring-2 focus:ring-golden focus:border-golden resize-none"
                  placeholder="¿Hay algo específico que te gustaría saber sobre la propiedad?"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-softGrey">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-graykiSecondary text-greyki hover:bg-softGrey transition-colors duration-300 font-medium font-dmsans"
              >
                Cancelar
              </button>
              <MainButton
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Enviando...' : 'Agendar Visita'}
              </MainButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}