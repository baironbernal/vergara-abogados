import { clsx } from "clsx";
import { Mail, Phone,Facebook, Twitter, Instagram, Linkedin } from "lucide-react";


export const Info = ({ styles=null }) => {
  const icons = [
    {
      src: "images/icons/flickr.webp",
      alt: "Flickr",
      url: "https://www.flickr.com/",
    },
    {
      src: "images/icons/twitter.webp",
      alt: "X",
      url: "https://www.instagram.com/",
    },
    {
      src: "images/icons/pinterest.webp",
      alt: "Pinterest",
      url: "https://www.facebook.com/",
    },
    {
      src: "images/icons/pinterest.webp",
      alt: "Pinterest",
      url: "https://www.facebook.com/",
    },
    {
      src: "images/icons/linkedin.webp",
      alt: "Linkedin",
      url: "https://www.linkedin.com/",
    }
  ]
  
  return (
   <header className={clsx(styles)} style={{ height: "var(--info-top-height)" }}>
      <div className="container flex-col items-center justify-end hidden gap-4 py-4 mx-auto text-xs text-grayki md:flex md:flex-row ">
          <p className="flex gap-2 px-3 text-gray-300 border-r border-greyki">
            <Mail className="w-4 h-full" />admin@inmobiliariavergarayabogados.com</p>
          
          <p className="flex gap-2 px-3 text-gray-300 border-r border-greyki">
            <Phone className="w-4 h-full" /> +57 323-3344-34</p>
            <div className="flex space-x-3">
            <Facebook
              strokeWidth={0.6} // default is 2
              className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
            />
            <Twitter
              strokeWidth={0.6}
              className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
            />
            <Instagram
              strokeWidth={0.6}
              className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
            />
            <Linkedin
              strokeWidth={0.6}
              className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
            />
            </div>
      </div>
   </header>
  )
}
