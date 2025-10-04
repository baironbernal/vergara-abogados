import { MotionWrapper } from "@/Components"
import { LawyerCard } from "@/Components/Home/LawyerCard"

export const ServiceLawyersSection = ({ lawyers = [] }) => {
  if (!lawyers || lawyers.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-whiteki lg:py-20">
      <div className="px-4 mx-auto max-w-7xl lg:px-8">
        <MotionWrapper>
          <div className="mb-12 text-center lg:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-darki font-prata lg:text-4xl">
              Nuestro Equipo
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-greyki font-dmsans lg:text-xl">
              Conoce a nuestros abogados especialistas en derecho inmobiliario
            </p>
            <div className="w-16 h-1 mx-auto mt-6 bg-golden lg:w-24"></div>
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-1 gap-8 mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer, index) => (
            <MotionWrapper key={lawyer.id} delay={index * 0.1}>
              <LawyerCard lawyer={lawyer} />
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceLawyersSection
