import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { useState } from "react";


const Carousel = ({children: slides}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const prevSlide = () => setCurrentIndex((currentIndex) => (currentIndex === 0 ? slides.length -1 : currentIndex - 1));
    
    const nextSlide = () => setCurrentIndex((currentIndex) => (currentIndex === 0 ? slides.length -1 : currentIndex - 1));

    return (
        <section className='py-4 bg-amber-300 group border-y-2'>
            <div className=' flex m-auto py-6 overflow-hidden max-w-150'>
                <div className='flex transition ease-out duration-400'
                style={{transform:`translateX(-${currentIndex * 100}%)`}}>
                    {slides}
                </div>
            </div>
            <div className='absolute inset-0 translate-y-[-5%] flex items-center justify-between mx-50'>
                <button onClick={prevSlide}>
                    <FaChevronLeft size={30}/>
                </button>
                <button onClick={nextSlide}>
                    <FaChevronRight size={30}/>
                </button>
            </div>
            <div className="relative py-4 flex justify-center gap-10 w-full">
                <div className="rounded-full w-5 h-5 bg-black">
                </div>
            </div>
        </section>
    )
}

export default Carousel
