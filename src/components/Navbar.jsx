import React from 'react';
import Hero from './Hero';
import logo from '../assets/images/ttlogo.png'
import { Outlet, Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <nav className='bg-white-500 border-b-2 border-blue-300'>
        <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
          <div className='flex h-20 items-center justify-between'>
            <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
              <img className='h-12' src={logo}/>
              <Link to={'/'}>
                <span className='hidden md:block text-blue-400 font-bold text-4xl ml-5 font-croissant'>
                TT Contest
                </span>
              </Link>
              <div className='md:ml-auto'>
                <div className='flex space-x-2'>
                  {/* <Link 
                    to="/recipe"
                    className='text-blue-400 hover:bg-blue-400 hover:text-blue-900  rounded-md px-3 py-2'
                  >
                    Recipe Remix
                  </Link> */}
                  {/* <Link 
                    to={"/projects"}
                    className='text-black hover:bg-gray-900 hover:text-yellow-400 rounded-md px-3 py-2'
                  >
                    Projects
                  </Link> */}
                  <Link 
                    to={"/about-recipe"}
                    className='text-blue-400 hover:bg-blue-400 hover:text-blue-900 rounded-md px-3 py-2'
                  >Recipe Remix</Link>
                  <Link 
                    to={"/about-swag"}
                    className='text-blue-400 hover:bg-blue-400 hover:text-blue-900 py-2'
                  >
                    Swag Tracker
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Outlet/>
    </>
  )
}

export default Navbar