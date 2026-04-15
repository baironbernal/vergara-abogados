
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";
import { usePage, Head } from "@inertiajs/react";

const SITE_NAME = "Inmobiliaria Vergara y Abogados";
const DEFAULT_TITLE = `${SITE_NAME} — Abogados Inmobiliarios en Soacha, Cundinamarca`;
const DEFAULT_DESCRIPTION =
  "Firma de abogados especializada en derecho inmobiliario en Soacha, Cundinamarca, Colombia. " +
  "Compra, venta, arriendo y asesoría jurídica de propiedades. Consulta hoy.";
const DEFAULT_OG_IMAGE = "/logo.png";

export default function DefaultLayout({ children }) {
  const { props } = usePage();

  const seo            = props.seo            || {};
  const canonicalUrl   = props.canonicalUrl   || "";
  const corporativeInfo = props.corporativeInfo || null;
  const latestBlogs    = props.latestBlogs    || [];

  const title       = seo.title       || DEFAULT_TITLE;
  const description = seo.description || DEFAULT_DESCRIPTION;
  const keywords    = seo.keywords    || "";
  const ogImage     = seo.og_image    || DEFAULT_OG_IMAGE;

  return (
    <div className="font-sans text-sm md:text-base">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow" />

        {/* Canonical — prevents duplicate content from query-string URLs */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph — used by Facebook, WhatsApp previews */}
        <meta property="og:site_name"   content={SITE_NAME} />
        <meta property="og:type"        content="website" />
        <meta property="og:locale"      content="es_CO" />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:image"       content={ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={ogImage} />

        {/* Geographic targeting — signals Soacha location to search engines */}
        <meta name="geo.region"    content="CO-CUN" />
        <meta name="geo.placename" content="Soacha, Cundinamarca, Colombia" />
        <meta name="geo.position"  content="4.5790;-74.2172" />
        <meta name="ICBM"          content="4.5790, -74.2172" />
      </Head>

      <MainHeader styles="bg-darki text-white/80" corporativeInfo={corporativeInfo} />
      <main className="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
        {children}
      </main>
      <Footer latestBlogs={latestBlogs} corporativeInfo={corporativeInfo} />
      <WhatsAppFloat corporativeInfo={corporativeInfo} />
    </div>
  );
}
