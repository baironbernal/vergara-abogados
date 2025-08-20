import { Scale } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import MotionWrapper from '@/Components/Shared/Motion/MotionWrapper';

const CardService = ({  id, name, description, picture  }) => {
  return (
    <MotionWrapper>
        <article key={id} className="flex flex-col items-center justify-between h-full p-16 text-center transition-shadow duration-300 border cursor-pointer  border-softGrey hover:shadow-lg">
            <Scale className="object-cover w-full h-20 text-golden " />
            <h3 className="mt-4 text-xl font-semibold tracking-wider text-gray-800 font-prata">{name}</h3>
            <p className="mt-2 text-sm md:text-md lg:text-md xl:text-md text-greyki">{description}</p>
            <div className='p-4 mx-auto m-w-2xl bg-softGrey hover:bg-golden'>
                <ArrowRight className="object-cover w-full text-golden " />
            </div>
        </article>
    </MotionWrapper>
  )
}

export default CardService
