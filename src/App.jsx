import React from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import HomeCards from './components/HomeCards';
import DataListings from './components/DataListings';

import './scss/main.scss';
import Carousel from './components/Carousel';

const App = () => {
  return (
    <>
      <Navbar />
      <Hero title="Welcome to the Den" subtitle="it's not a honeypot"/>
      <Carousel/>
      <HomeCards /> 
      <DataListings/>
    </>
  )
}

export default App