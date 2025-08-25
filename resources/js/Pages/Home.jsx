
import { MainBanner, LawyersSection } from "../Components"

const Home = ({ lawyers }) => {
  return (
    <>
      <MainBanner />
      <LawyersSection lawyers={lawyers} />
    </>
  )
}

export default Home
