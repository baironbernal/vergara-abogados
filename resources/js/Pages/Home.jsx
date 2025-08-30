
import { MainBanner, LawyersSection, SEOHead } from "../Components"

const Home = ({ lawyers, seo }) => {
  return (
    <>
      <SEOHead seo={seo} />
      <MainBanner />
      <LawyersSection lawyers={lawyers} />
    </>
  )
}

export default Home
