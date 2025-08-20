
import { MainHeader, Footer } from "@/Components";

export default function DefaultLayout({ children }) {
  return (
    <div className="font-sans text-sm md:text-base ">
      <MainHeader/>
      
      <main style={{ 
        marginTop: "var(--header-total-height)"
       }}>{children}</main>
      <Footer/>
    </div>
  )
}