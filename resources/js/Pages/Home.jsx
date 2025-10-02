
import { MainBanner, LawyersSection, SEOHead } from "../Components"

const Home = ({ lawyers, homeBanner, seo }) => {
  return (
    <>
      <SEOHead seo={seo} />
      <MainBanner homeBanner={homeBanner} />
      <LawyersSection lawyers={lawyers} />
    </>
  )
}

export default Home
