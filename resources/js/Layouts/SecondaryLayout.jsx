
import { MainHeader, Footer, WhatsAppFloat } from "@/Components";

export default function SecondaryLayout({ children }) {
  return (
    <div className="font-sans text-sm md:text-base ">
         <MainHeader styles={'bg-whiteki text-gray-400' }  />
          <main className="mt-[8.5rem] md:mt-[var(--header-total-height)]">
          {children}
        </main>
      <Footer/>
      <WhatsAppFloat />
    </div>
  )
}