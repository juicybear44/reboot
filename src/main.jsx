import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import NotFound from './components/pages/NotFound.jsx'

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
      element: <NotFound/>
    },
  ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
