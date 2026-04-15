
import { usePage } from "@inertiajs/react"
import { useSeoManager } from "@/hooks/useSeoManager"
import { MainBanner, LawyersSection } from "../Components"
import { JsonLd } from "@/Components/Shared/JsonLd"

const Home = ({ lawyers, homeBanner, seo }) => {
  useSeoManager(seo)

  const { props } = usePage()
  const info = props.corporativeInfo || {}
  const canonical = props.canonicalUrl || ""

  // LocalBusiness + LegalService schema — the most important signal for
  // "abogados en Soacha" and "inmobiliaria Soacha Cundinamarca" searches.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LegalService", "RealEstateAgent"],
    "name": "Inmobiliaria Vergara y Abogados",
    "description":
      "Firma de abogados especializada en derecho inmobiliario en Soacha, Cundinamarca, Colombia. " +
      "Servicios legales de compra, venta, arriendo y asesoría jurídica de propiedades.",
    "url": canonical,
    "logo": `${canonical}/logo.png`,
    "image": `${canonical}/logo.png`,
    "telephone": info.corporative_whatsapp || "",
    "email": info.corporative_email || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": info.office_address || "Cl. 12 #8 05",
      "addressLocality": "Soacha",
      "addressRegion": "Cundinamarca",
      "postalCode": "250001",
      "addressCountry": "CO",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.5790,
      "longitude": -74.2172,
    },
    "areaServed": [
      { "@type": "City", "name": "Soacha" },
      { "@type": "State", "name": "Cundinamarca" },
      { "@type": "Country", "name": "Colombia" },
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "13:00",
      },
    ],
    "sameAs": [
      info.corporative_facebook,
      info.corporative_instagram,
      info.corporative_linkedin,
      info.corporative_twitter,
    ].filter(Boolean),
    "priceRange": "$$",
  }

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <MainBanner homeBanner={homeBanner} />
      <LawyersSection lawyers={lawyers} />
    </>
  )
}

export default Home
