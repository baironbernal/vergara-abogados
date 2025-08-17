
import { Menu, Info} from "@/Components";

export default function DefaultLayout({ children }) {
  return (
    <main>
      <Info/>
      <Menu/>
      <article>{children}</article>
    </main>
  )
}