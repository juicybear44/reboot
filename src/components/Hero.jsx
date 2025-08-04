import React from 'react'


import campsite from '../assets/images/campsite.png';
import bear from '../assets/images/mapbear.png';

const Hero = () => {
  return (
    <section className='h-[300px] w-[2000] bg-yellow-50'>
      <div className="flex items-center justify-center">
        <div
          className='h-[125px] w-[125px] top-62'
          style={{
            backgroundImage: `url(${bear})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            position:'absolute',

          }} 
        ></div>
        <div className='font-bold text-5xl'>
          Welcome to
        </div>
        <div 
          className='h-[300px] w-[300px]'
          style={{
            backgroundImage: `url(${campsite})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}></div>
        <div className='font-bold text-5xl'>the den</div>    
      </div>
    </section>
  )
}

export default Hero