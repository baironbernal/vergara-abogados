
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";
import { usePage } from "@inertiajs/react";

export default function DefaultLayout({ children }) {
  const { props } = usePage();
  const latestBlogs = props.latestBlogs || [];

  return (
    <div className="font-sans text-sm md:text-base">
          <MainHeader styles={'bg-darki text-white/80' }  />
          <main className="mt-[7rem] md:mt-[8.5rem] lg:mt-[var(--header-total-height)]">
          {children}
        </main>
      <Footer latestBlogs={latestBlogs} />
      <WhatsAppFloat />
    </div>
  )
}