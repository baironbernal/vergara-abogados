import { useSeoManager } from "@/hooks/useSeoManager"
import { Mail, Phone, MapPin, Clock, Linkedin, Facebook, Twitter, Instagram, GraduationCap, Briefcase, Award, Scale } from "lucide-react"
import { MainButton, MotionWrapper } from "@/Components"
import { Link } from "@inertiajs/react"

export default function LawyerDetail({ lawyer, seo }) {
    useSeoManager(seo)

    return (
        <div className="min-h-screen bg-whiteki">
            {/* Header Section */}
            <MotionWrapper>
                <div className="bg-darki">
                    <div className="px-4 py-16 mx-auto max-w-7xl lg:py-24">
                        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
                            {/* Profile Image */}
                            <div className="lg:col-span-1">
                                <div className="overflow-hidden border-4 aspect-square border-golden">
                                    <img
                                        src={lawyer.image ? `/storage/${lawyer.image}` : "/placeholder.svg"}
                                        alt={lawyer.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="lg:col-span-2">
                                <h1 className="mb-2 text-3xl font-bold text-whiteki font-prata lg:text-5xl">
                                    {lawyer.name}
                                </h1>
                                {lawyer.title && (
                                    <p className="mb-4 text-xl text-golden font-dmsans lg:text-2xl">
                                        {lawyer.title}
                                    </p>
                                )}
                                <p className="mb-6 text-lg text-graykiSecondary font-dmsans">
                                    {lawyer.profession}
                                </p>
                                {lawyer.description && (
                                    <p className="mb-8 text-base leading-relaxed text-whiteki font-dmsans lg:text-lg">
                                        {lawyer.description}
                                    </p>
                                )}

                                {/* Contact Info */}
                                <div className="grid gap-4 mb-8 sm:grid-cols-2">
                                    {lawyer.phone && (
                                        <div className="flex items-center gap-3 text-whiteki">
                                            <Phone className="w-5 h-5 text-golden" />
                                            <span className="font-dmsans">{lawyer.phone}</span>
                                        </div>
                                    )}
                                    {lawyer.email && (
                                        <div className="flex items-center gap-3 text-whiteki">
                                            <Mail className="w-5 h-5 text-golden" />
                                            <span className="font-dmsans">{lawyer.email}</span>
                                        </div>
                                    )}
                                    {lawyer.office_location && (
                                        <div className="flex items-center gap-3 text-whiteki">
                                            <MapPin className="w-5 h-5 text-golden" />
                                            <span className="font-dmsans">{lawyer.office_location}</span>
                                        </div>
                                    )}
                                    {lawyer.office_hours && (
                                        <div className="flex items-center gap-3 text-whiteki">
                                            <Clock className="w-5 h-5 text-golden" />
                                            <span className="font-dmsans">{lawyer.office_hours}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Social Media */}
                                {(lawyer.linkedin || lawyer.facebook || lawyer.twitter || lawyer.instagram) && (
                                    <div className="flex gap-4">
                                        {lawyer.linkedin && (
                                            <a href={lawyer.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {lawyer.facebook && (
                                            <a href={lawyer.facebook} target="_blank" rel="noopener noreferrer" className="p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki">
                                                <Facebook className="w-5 h-5" />
                                            </a>
                                        )}
                                        {lawyer.twitter && (
                                            <a href={lawyer.twitter} target="_blank" rel="noopener noreferrer" className="p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki">
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {lawyer.instagram && (
                                            <a href={lawyer.instagram} target="_blank" rel="noopener noreferrer" className="p-2 transition-colors border-2 border-golden text-golden hover:bg-golden hover:text-darki">
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </MotionWrapper>

            {/* Stats Section */}
            {(lawyer.years_experience || lawyer.cases_won || lawyer.specializations?.length > 0) && (
                <MotionWrapper delay={0.2}>
                    <div className="px-4 py-12 bg-white lg:py-16">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {lawyer.years_experience && (
                                    <div className="p-6 text-center border-2 border-golden lg:p-8">
                                        <div className="mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl">
                                            {lawyer.years_experience}+
                                        </div>
                                        <div className="text-lg text-darki font-dmsans">Años de Experiencia</div>
                                    </div>
                                )}
                                {lawyer.cases_won && (
                                    <div className="p-6 text-center border-2 border-golden lg:p-8">
                                        <div className="mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl">
                                            {lawyer.cases_won}+
                                        </div>
                                        <div className="text-lg text-darki font-dmsans">Casos Ganados</div>
                                    </div>
                                )}
                                {lawyer.specializations && lawyer.specializations.length > 0 && (
                                    <div className="p-6 text-center border-2 border-golden lg:p-8 sm:col-span-2 lg:col-span-1">
                                        <div className="mb-4 text-4xl font-bold text-golden font-prata lg:text-5xl">
                                            {lawyer.specializations.length}
                                        </div>
                                        <div className="text-lg text-darki font-dmsans">Especializaciones</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </MotionWrapper>
            )}

            <div className="px-4 py-12 mx-auto max-w-7xl lg:py-16">
                <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Biography */}
                        {lawyer.bio && (
                            <MotionWrapper delay={0.3}>
                                <section className="mb-12">
                                    <h2 className="mb-6 text-2xl font-bold text-darki font-prata lg:text-3xl">
                                        Sobre Mí
                                    </h2>
                                    <div
                                        className="prose prose-lg max-w-none text-greyki font-dmsans"
                                        dangerouslySetInnerHTML={{ __html: lawyer.bio }}
                                    />
                                </section>
                            </MotionWrapper>
                        )}

                        {/* Education */}
                        {lawyer.education && lawyer.education.length > 0 && (
                            <MotionWrapper delay={0.4}>
                                <section className="mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <GraduationCap className="w-8 h-8 text-golden" />
                                        <h2 className="text-2xl font-bold text-darki font-prata lg:text-3xl">
                                            Educación
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        {lawyer.education.map((edu, index) => (
                                            <div key={index} className="p-6 border-l-4 border-golden bg-softGrey">
                                                <h3 className="mb-2 text-xl font-bold text-darki font-prata">
                                                    {edu.degree}
                                                </h3>
                                                <p className="mb-1 text-lg text-golden font-dmsans">
                                                    {edu.institution}
                                                </p>
                                                {edu.year && (
                                                    <p className="text-greyki font-dmsans">{edu.year}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </MotionWrapper>
                        )}

                        {/* Experience */}
                        {lawyer.experience && lawyer.experience.length > 0 && (
                            <MotionWrapper delay={0.5}>
                                <section className="mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Briefcase className="w-8 h-8 text-golden" />
                                        <h2 className="text-2xl font-bold text-darki font-prata lg:text-3xl">
                                            Experiencia Profesional
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        {lawyer.experience.map((exp, index) => (
                                            <div key={index} className="p-6 border-l-4 border-golden bg-softGrey">
                                                <h3 className="mb-2 text-xl font-bold text-darki font-prata">
                                                    {exp.position}
                                                </h3>
                                                <p className="mb-1 text-lg text-golden font-dmsans">
                                                    {exp.company}
                                                </p>
                                                {exp.period && (
                                                    <p className="mb-3 text-greyki font-dmsans">{exp.period}</p>
                                                )}
                                                {exp.description && (
                                                    <p className="text-greyki font-dmsans">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </MotionWrapper>
                        )}

                        {/* Achievements */}
                        {lawyer.achievements && lawyer.achievements.length > 0 && (
                            <MotionWrapper delay={0.6}>
                                <section className="mb-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Award className="w-8 h-8 text-golden" />
                                        <h2 className="text-2xl font-bold text-darki font-prata lg:text-3xl">
                                            Logros y Reconocimientos
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {lawyer.achievements.map((achievement, index) => (
                                            <div key={index} className="p-6 bg-white border-2 border-golden">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-golden">
                                                        <Award className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="mb-1 text-lg font-bold text-darki font-prata">
                                                            {achievement.title}
                                                        </h3>
                                                        {achievement.year && (
                                                            <p className="mb-2 text-golden font-dmsans">{achievement.year}</p>
                                                        )}
                                                        {achievement.description && (
                                                            <p className="text-greyki font-dmsans">{achievement.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </MotionWrapper>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Specializations */}
                        {lawyer.specializations && lawyer.specializations.length > 0 && (
                            <MotionWrapper delay={0.7}>
                                <section className="mb-8">
                                    <div className="p-6 bg-white border-2 border-golden lg:p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Scale className="w-6 h-6 text-golden" />
                                            <h2 className="text-xl font-bold text-darki font-prata lg:text-2xl">
                                                Áreas de Especialización
                                            </h2>
                                        </div>
                                        <div className="space-y-6">
                                            {lawyer.specializations.map((spec, index) => (
                                                <div key={index}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-darki font-dmsans">{spec.area}</span>
                                                        {spec.percentage && (
                                                            <span className="text-golden font-dmsans">{spec.percentage}%</span>
                                                        )}
                                                    </div>
                                                    {spec.percentage && (
                                                        <div className="w-full h-2 overflow-hidden bg-softGrey">
                                                            <div
                                                                className="h-full transition-all duration-500 bg-golden"
                                                                style={{ width: `${spec.percentage}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </MotionWrapper>
                        )}

                        {/* Contact CTA */}
                        <MotionWrapper delay={0.8}>
                            <section className="p-6 bg-darki lg:p-8">
                                <h2 className="mb-4 text-xl font-bold text-whiteki font-prata lg:text-2xl">
                                    ¿Necesitas Asesoría Legal?
                                </h2>
                                <p className="mb-6 text-graykiSecondary font-dmsans">
                                    Agenda una consulta para discutir tu caso con nuestro equipo de expertos.
                                </p>
                                <MainButton as={Link} href="/contacto" className="w-full">
                                    Agendar Consulta
                                </MainButton>
                            </section>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}
