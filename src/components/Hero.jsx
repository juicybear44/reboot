import React, { useState } from 'react'
import { motion } from 'motion/react'; //eslint-disable-line


import campsite from '../assets/images/campsite.png';
import bear from '../assets/images/mapbear.png';

const Hero = () => {
  // click counter to make mapbear move
  const [clicked, setClicked] = useState(false);
  console.log("I am clicked", clicked);
  const handleClick = () => {
    setClicked(prevClicked => !prevClicked);
  };

  return (
    <section className='h-[400px] w-screen bg-yellow-50'>
      <div className="flex items-center justify-center">
        <motion.div
          className={`text-5xl absolute left-25 bottom-117 font-croissant text-center`}
          animate={{
            top: clicked ? 180 : 370,
            opacity: clicked ? 1 : 0,
            transition: {duration: 1, ease: 'easeInOut'}
          }}
        >
          Welcome to 
          <br />
          the Den
        </motion.div>
        <motion.div
          animate={{
            opacity: clicked ? 1 : 0,
            transition: {duration: 0.5}, 
          }}
          className={`h-[125px] w-[125px] top-73 translate-x-[-45%] z-100`}
          style={{
            backgroundImage: `url(${bear})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            position:'absolute',
          }} 
        ></motion.div>
        <div 
          className='h-[400px] w-[350px] z-20 hover:cursor-pointer'
          onClick={handleClick}
          style={{
            backgroundImage: `url(${campsite})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}></div>
          <motion.div
            className={`text-5xl absolute right-25 bottom-118 font-croissant text-center`}
            animate={{
            top: clicked ? 180 : 370,
            opacity: clicked ? 1 : 0,
            transition: {duration: 1, ease: 'easeInOut'}
          }}
          >
            Not a
            <br />
            HoneyPot
          </motion.div>
      </div>
      <div 
        className="h-[100px] w-screen bg-yellow-400 absolute top-90 z-10 border-y-2"
      ></div>
    </section>
  )
}

export default Hero