
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";
import { usePage } from "@inertiajs/react";

export default function DefaultLayout({ children }) {
  const { props } = usePage();
  const latestBlogs = props.latestBlogs || [];
  const corporativeInfo = props.corporativeInfo || null;

  return (
    <div className="font-sans text-sm md:text-base">
          <MainHeader styles={'bg-darki text-white/80'} corporativeInfo={corporativeInfo} />
          <main className="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
          {children}
        </main>
      <Footer latestBlogs={latestBlogs} corporativeInfo={corporativeInfo} />
      <WhatsAppFloat corporativeInfo={corporativeInfo} />
    </div>
  )
}