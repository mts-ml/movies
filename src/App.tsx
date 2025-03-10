import { Layout } from './pages/Layout/Layout'
import { Home } from './pages/Home/Home'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import './styles/globalStyles.scss'


const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />} errorElement={<ErrorPage />}>
    <Route path="/" element={<Home />} />

  </Route>
))


function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
