import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './Homepage.jsx';
import PokemonDetail from './PokemonDetail.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: 
    <Homepage />
  },
  {
    path: '/pokemon/:pokemonId',
    element: <PokemonDetail />
  }, 
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
