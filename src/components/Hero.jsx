import React from 'react'
import Clock from './Clock'
import Carousel from './Carousel'


import campsite from '../assets/images/campsite.png'
// {title='hello', subtitle='world'}


const Hero = () => {
  return (
    <section className='h-[300px] w-[2000] bg-yellow-50'>
      <div className="flex items-center justify-center">
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