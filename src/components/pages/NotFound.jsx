import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

import notFound from '../../assets/images/sitbear.png';

const NotFound = () => {
  return (
    <div className='bg-amber-100 h-screen flex items-center justify-center'>
        <span className="text-5xl">404</span>
        <img className="h-[30%]" src={notFound} alt="not found" />
        <Link to={"/"}>
          <button className="bg-amber-300 hover:bg-amber-200 text-amber-900 font-pixel text-3xl py-2 px-4 border-b-4 border-amber-500 hover:border-amber-400 rounded">Go Home </button>
        </Link>
    </div>
  )
}

export default NotFound;