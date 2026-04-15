
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";
import { usePage, Head } from "@inertiajs/react";

const SITE_NAME = "Inmobiliaria Vergara y Abogados";
const DEFAULT_TITLE = `${SITE_NAME} — Abogados Inmobiliarios en Soacha, Cundinamarca`;
const DEFAULT_DESCRIPTION =
  "Firma de abogados especializada en derecho inmobiliario en Soacha, Cundinamarca, Colombia.";

export default function SecondaryLayout({ children }) {
  const { props } = usePage();

  const seo          = props.seo          || {};
  const canonicalUrl = props.canonicalUrl || "";
  const latestBlogs  = props.latestBlogs  || [];

  const title       = seo.title       || DEFAULT_TITLE;
  const description = seo.description || DEFAULT_DESCRIPTION;
  const keywords    = seo.keywords    || "";

  return (
    <div className="font-sans text-sm md:text-base">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content="index, follow" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:type"        content="website" />
        <meta property="og:locale"      content="es_CO" />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta name="geo.region"    content="CO-CUN" />
        <meta name="geo.placename" content="Soacha, Cundinamarca, Colombia" />
      </Head>

      <MainHeader styles="bg-whiteki text-gray-400" />
      <main className="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
        {children}
      </main>
      <Footer latestBlogs={latestBlogs} />
      <WhatsAppFloat />
    </div>
  );
}
