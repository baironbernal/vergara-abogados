
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";
import { usePage, Head } from "@inertiajs/react";
import { useSeoStore } from "@/Store/useSeoStore";

export default function SecondaryLayout({ children }) {
  const { title, keywords, description } = useSeoStore()
  const { props } = usePage();
  const latestBlogs = props.latestBlogs || [];

  return (
    <div className="font-sans text-sm md:text-base">

        <Head>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}

        </Head>
         <MainHeader styles={'bg-whiteki text-gray-400' }  />
          <main className="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
          {children}
        </main>
      <Footer latestBlogs={latestBlogs} />
      <WhatsAppFloat />
    </div>
  )
}
