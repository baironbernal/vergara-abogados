
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";
import { usePage, Head } from "@inertiajs/react";
import { useSeoStore } from "@/Store/useSeoStore";

export default function DefaultLayout({ children }) {
 const { title, keywords, description } = useSeoStore()
  const { props } = usePage();
  const latestBlogs = props.latestBlogs || [];
  const corporativeInfo = props.corporativeInfo || null;

  return (
    <div className="font-sans text-sm md:text-base">
        <Head>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}

        </Head>
          <MainHeader styles={'bg-darki text-white/80'} corporativeInfo={corporativeInfo} />
          <main className="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
          {children}
        </main>
      <Footer latestBlogs={latestBlogs} corporativeInfo={corporativeInfo} />
      <WhatsAppFloat corporativeInfo={corporativeInfo} />
    </div>
  )
}
