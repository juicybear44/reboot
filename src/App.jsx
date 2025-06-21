import React from 'react';
import Glitch from './components/Glitch';
import Navbar from './components/Navbar';

import './scss/main.scss';

const App = () => {
  return (
    <>
      <Navbar />
      <Glitch />
    </>
  )
}

export default App