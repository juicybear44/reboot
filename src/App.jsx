import React from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import HomeCards from './components/HomeCards';
import DataListings from './components/DataListings';
import Gallery from './components/Gallery';

import './scss/main.scss';
import Carousel from './components/Carousel';

const App = () => {
    const slides = [
        {
            "url":"https://images.unsplash.com/photo-1717967354821-7616d96c6786?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "url":"https://images.unsplash.com/photo-1709201759685-459d11d53d93?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "url":"https://images.unsplash.com/photo-1657457320630-3f3e25814b06?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "url":"https://images.unsplash.com/photo-1742633882713-593c13e90231?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          "url": "https://images.unsplash.com/photo-1746973645769-c11eb0a81025?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]

  return (
    <>
      <Navbar />
      <Hero title="Welcome to the Den" subtitle="it's not a honeypot"/>
      <Carousel autoSlide={true} autoSlideDuration={3000}>
        {slides.map((s) => (
          <img src={s.url} className='rounded-2xl'/>
        ))}
      </Carousel>
      <HomeCards /> 
      <DataListings/>
    </>
  )
}

export default App