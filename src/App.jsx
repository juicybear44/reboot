import React from 'react';
import { 
  Route, 
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';


import './scss/main.scss';
import { 
  MainLayout, 
  LandingPage, 
  Projects, 
  Playground, 
  Aboutme, 
  NotFound 
} from './components/pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={MainLayout}>
      <Route index element={LandingPage} />
      <Route path='/project' element={Projects}/>
      <Route path='/project' element={Playground}/>
      <Route path='/project' element={Aboutme}/>
    </Route>)
)

const App = () => {
  return <RouterProvider router={router}/>
}

export default App