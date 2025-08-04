import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { useEffect, useState } from "react";


const Carousel = ({
  children: slides,
  autoSlide = false,
  autoSlideDuration = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // const prevSlide = () => setCurrentIndex((currentIndex) => (currentIndex === 0 ? slides.length -1 : currentIndex - 1));
  
  const nextSlide = () => setCurrentIndex((currentIndex) => (currentIndex === slides.length - 1 ? 0 : currentIndex + 1));

  const gotoSlide = (index) => {setCurrentIndex(index)}

  useEffect(()=>{
    if (!autoSlide) return;
    // set interval here
    const slideInterval = setInterval(nextSlide, autoSlideDuration);
    // best practice to clear the set inverval
    return () => clearInterval(slideInterval);
  })

  return (
    <>
      <div className=' flex m-auto py-6 overflow-hidden max-w-150'>
          <div className='flex transition ease-out duration-400'
          style={{transform:`translateX(-${currentIndex * 100}%)`}}>
              {slides}
          </div>
      </div>
      {/* <div className='absolute inset-0 flex items-center justify-between mx-50'>
          <button onClick={prevSlide}>
              <FaChevronLeft size={30}/>
          </button>
          <button onClick={nextSlide}>
              <FaChevronRight size={30}/>
          </button>
      </div> */}
      <div className='relative'>
          <div className="flex items-center justify-center gap-2">
              {slides.map((_, index )=>(
                  <div 
                      className={`transition-all w-3 h-3 bg-black rounded-full ${currentIndex === index ? "bg-yellow-50 border-black" : "bg-opacity-25"} hover:cursor-pointer`}
                      onClick={() => gotoSlide(index)}
                      key={index}
                  />
              ))}
          </div>  
      </div>
    </>
  )
}

export default Carousel
