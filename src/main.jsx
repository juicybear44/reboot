import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import NotFound from './components/pages/NotFound.jsx'
import Projects from './components/pages/Projects.jsx'
import Playground from './components/pages/Playground.jsx'
import AboutMe from './components/pages/AboutMe.jsx'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element:  <App />
    },
    {
      path: "/about",
      element: <AboutMe/>
    },
    {
      path: "/projects",
      element: <Projects/>
    },
    {
      path: "/playground",
      element: <Playground/>
    },
    {
      path: "*",
      element: <NotFound/>
    },
  ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
