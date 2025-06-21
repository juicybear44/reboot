import React from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import HomeCards from './components/HomeCards';
import DataListings from './components/DataListings';

import './scss/main.scss';

const App = () => {
  return (
    <>
      <Navbar />
      <Hero title="This is the Title for the new website" subtitle="And this is the subtitle!"/>
      <HomeCards />
      <DataListings/>
    </>
  )
}

export default App