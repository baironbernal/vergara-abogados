import { Scale, ArrowRight } from 'lucide-react';
import { MotionWrapper } from '@/Components';

export const CardService = ({  id, name, description, picture  }) => {
  return (
    <MotionWrapper>
        <article key={id} className="flex flex-col items-center justify-between h-full p-8 text-center transition-shadow duration-300 border cursor-pointer border-softGrey hover:shadow-lg lg:p-16">
            <Scale className="object-cover w-full h-16 text-golden lg:h-20 " />
            <h3 className="mt-4 text-lg font-semibold tracking-wider text-gray-800 font-prata lg:text-xl">{name}</h3>
            <p className="mt-2 text-sm text-greyki lg:text-base">{description}</p>
            <div className='p-3 mx-auto mt-4 bg-softGrey hover:bg-golden lg:p-4 lg:mt-6'>
                <ArrowRight className="object-cover w-full text-golden " />
            </div>
        </article>
    </MotionWrapper>
  )
}
