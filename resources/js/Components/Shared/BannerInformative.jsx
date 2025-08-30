
export const BannerInformative = ({ picture, title, description }) => {
  return (
    <section className='relative w-full h-auto' style={{ 
        backgroundImage: `url(${picture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '250px',
     }}>
      <div className='absolute w-full h-full' >
        <div className='container flex flex-col items-center justify-center w-full h-full gap-3 mx-auto text-center px-4 lg:gap-4 lg:px-8' >
            <h1 className='text-3xl font-medium tracking-wider font-prata text-whiteki sm:text-4xl md:text-5xl lg:text-6xl'>{title} </h1>
            <p className='px-4 text-sm text-golden sm:text-base md:px-2 lg:text-lg'>{description}</p>
        </div>
      </div>
    </section>
  )
}


