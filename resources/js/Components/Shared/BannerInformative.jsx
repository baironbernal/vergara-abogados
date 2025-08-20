
const BannerInformative = ({ picture, title, description }) => {
  return (
    <section className='relative w-full h-auto ' style={{ 
        backgroundImage: `url(${picture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '300px',
     }}>
      <div className='absolute w-full h-full' >
        <div className='container flex flex-col items-center justify-center w-full h-full gap-4 mx-auto text-center' >
            <h1 className='text-5xl font-medium tracking-wider font-prata md:text-6xl text-whiteki'>{title} </h1>
            <p className='px-12 text-sm md:px-2 md:text-normal text-golden'>{description}</p>
        </div>
      </div>
    </section>
  )
}

export default BannerInformative
