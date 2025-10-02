import { clsx } from "clsx";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Info = ({ styles = null, corporativeInfo = null }) => {
  // Fallback values if no corporativeInfo is provided
  const email = corporativeInfo?.corporative_email || 'admin@inmobiliariavergarayabogados.com';
  const phone = corporativeInfo?.corporative_whatsapp || '+57 323-3344-34';
  const linkedin = corporativeInfo?.corporative_linkedin;
  const instagram = corporativeInfo?.corporative_instagram;
  const facebook = corporativeInfo?.corporative_facebook;
  const twitter = corporativeInfo?.corporative_twitter;

  return (
   <header className={clsx(styles)} style={{ height: "var(--info-top-height)" }}>
      <div className="container flex-col items-center justify-end hidden gap-4 py-4 mx-auto text-xs text-grayki md:flex md:flex-row ">
          <p className="flex gap-2 px-3 text-gray-300 border-r border-greyki">
            <Mail className="w-4 h-full" />{email}</p>

          <p className="flex gap-2 px-3 text-gray-300 border-r border-greyki">
            <Phone className="w-4 h-full" /> {phone}</p>
            <div className="flex space-x-3">
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer">
                <Facebook
                  strokeWidth={0.6}
                  className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
                />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer">
                <Twitter
                  strokeWidth={0.6}
                  className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
                />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer">
                <Instagram
                  strokeWidth={0.6}
                  className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
                />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin
                  strokeWidth={0.6}
                  className="w-5 h-5 transition-colors cursor-pointer text-graykiSecondary hover:text-white"
                />
              </a>
            )}
            </div>
      </div>
   </header>
  )
}
