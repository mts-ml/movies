import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";


export const Layout: React.FC = () => {
   const [movies, setMovies] = useState([])

   const API_KEY: string = import.meta.env.VITE_OMDB_API_KEY;

   useEffect(() => {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
         .then(res => res.json())
         .then(res => setMovies(res))
         .catch(err => console.error(err));
   }, []);

   console.log(movies)

   return (
      <>
         <Header />
         <Outlet />
      </>
   );
};
