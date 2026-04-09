import React from 'react';
import { 
  Route, 
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';


import './scss/main.scss';
import MainLayout from './components/pages/MainLayout';
import LandingPage from './components/pages/LandingPage';
import NotFound from './components/pages/NotFound';
// import Playground from './components/pages/Playground';
// import Projects from './components/pages/Projects';
import AboutRecipe from './components/pages/AboutRecipe';
import AboutSwag from './components/pages/AboutSwag';
import Recipe from './components/pages/Recipe';
import Swag from './components/pages/Swag';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<AboutRecipe/>} />
      <Route path='/recipe' element={<Recipe/>} />
      {/* <Route path='/projects' element={<Projects/>} /> */}
      <Route path='/about-recipe' element={<AboutRecipe/>} />
      
      <Route path='/swag' element={<Swag/>} />
      <Route path='/about-swag' element={<AboutSwag/>} />
      <Route path='*' element={<NotFound/>} />
    </Route>)
)

const App = () => {
  return <RouterProvider router={router}/>
}

export default App