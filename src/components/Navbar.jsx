import React from 'react'

import logo from '../assets/images/mapbear.png'

const Navbar = () => {
  return (
    <nav className='bg-yellow-400 border-b-2 border-grey-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <img className='h-12' src={logo}
            />
            <span className='hidden md:block text-black font-bold text-4xl ml-5 font-rusty'>
              Juicybear's Den
            </span>
            <div className='md:ml-auto'>
              <div className='flex space-x-2'>
                <a 
                  href="/about.html"
                  className='text-black hover:bg-gray-900 hover:text-yellow-400 rounded-md px-3 py-2'
                >
                  projects
                </a>
                <a 
                  href="/about.html"
                  className='text-black hover:bg-gray-900 hover:text-yellow-400 rounded-md px-3 py-2'
                >
                  playground
                </a>
                <a 
                  href="/about.html"
                  className='text-black hover:bg-gray-900 hover:text-yellow-400 rounded-md px-3 py-2'
                >
                  about
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar