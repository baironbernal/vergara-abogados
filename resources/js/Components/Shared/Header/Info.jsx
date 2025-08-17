

export const Info = () => {
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
    <div className="container flex flex-col items-center justify-end gap-2 py-4 mx-auto text-xs text-greyki font-raleway md:flex-row text-dark">
        <p className="px-3 border-r border-greyki"><i className="px-1 fa fa-envelope"></i> admin@abogadosvergara.com</p>
        
        <p className="px-3 border-r border-greyki"><i className="px-1 fa fa-phone"></i> +57 323-3344-34</p>
        <section className="flex items-center gap-2 px-3" >
        {
          icons.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <img
                src={item.src}
                alt={item.alt}
                width={'20px'}
                height={'20px'}
              />
            </a>
          ))
        }
        </section>
    </div>
  )
}
