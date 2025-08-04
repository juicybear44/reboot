import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element:  <App />
    },
    {
      path: "/about",
      element: <div>This is the About Page</div>
    },
    {
      path: "/projects",
      element: <div>This is the Projects Page</div>
    },
    {
      path: "/playground",
      element: <div>This is the Playground Page</div>
    },
    {
      path: "*",
      element: <h1 className='flex justify-center text-4xl items-center h-screen'>404 Not found yo</h1>
    },
  ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
