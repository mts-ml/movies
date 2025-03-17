import { Layout } from './pages/Layout/Layout'
import { Home } from './pages/Home/Home'
import { MovieDetail } from './pages/MovieDetail/MovieDetail'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { homeLoader, movieDetailLoader } from './moviesLoader'

import './styles/globalStyles.scss'


const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />} errorElement={<ErrorPage />} >
    <Route path="/" element={<Home />} loader={homeLoader} />
    <Route path="movie/:id" element={<MovieDetail />} loader={movieDetailLoader} />

  </Route>
))


function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
