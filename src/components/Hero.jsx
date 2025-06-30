import React from 'react'
import Clock from './Clock'
import Carousel from './Carousel'

// import mountain from './assets/images/mountain1.png';
// {title='hello', subtitle='world'}

const Hero = () => {
  return (
    <section className='h-[300px] w-[2000] bg-yellow-50 py-20 bg-[url("./assets/images/campsite.png")] bg-contain bg-no-repeat bg-center overflow-auto'>
      <div className='font-bold text-5xl translate-y-[-150%]'>
        Welcome to the Den
      </div>
    </section>
  )
}

export default Hero