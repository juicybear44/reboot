import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

import notFound from '../../assets/images/notfoundbear.png';

const NotFound = () => {
  return (
    <div className='bg-amber-100 grid h-screen place-items-center'>
        <img src={notFound} alt="not found" />
        <TypeAnimation
          sequence={[
            'Error...',
            3000,
            'Page Not Found!',
            2000,
          ]}
          speed={25}
          className="font-pixel text-amber-900  text-5xl"
          repeat={Infinity}
        />
        <Link to={"/"}>
          <button className="bg-amber-300 hover:bg-amber-200 text-amber-900 font-pixel text-3xl py-2 px-4 border-b-4 border-amber-500 hover:border-amber-400 rounded">Go Home</button>
        </Link>
    </div>
  )
}

export default NotFound;