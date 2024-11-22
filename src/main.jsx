import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './Homepage.jsx';
import PokemonDetail from './PokemonDetail.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: 
    <Homepage />
  },
  {
    path: '/:pokemonId',
    element: <PokemonDetail />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
