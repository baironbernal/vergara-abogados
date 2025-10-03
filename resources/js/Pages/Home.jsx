
import { useSeoManager } from "@/hooks/useSeoManager"
import { MainBanner, LawyersSection } from "../Components"

const Home = ({ lawyers, homeBanner, seo }) => {
    useSeoManager(seo)


  return (
    <>
      <MainBanner homeBanner={homeBanner} />
      <LawyersSection lawyers={lawyers} />
    </>
  )
}

export default Home
