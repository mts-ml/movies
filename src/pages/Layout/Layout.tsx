import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";


export interface Movies {
   id: number;
   original_title?: string;
   overview: string;
   popularity: number;
   poster_path: string;
   release_date: string;
   title: string;
   video: boolean;
   vote_average: number;
   vote_count: number;
}


export const Layout: React.FC = () => {
   const [movies, setMovies] = useState<Movies[]>([])

   const [darkMode, setDarkMode] = useState<boolean>(() => {
      const savedTheme: string | null = localStorage.getItem("moviesDarkTheme")

      return savedTheme !== null ? JSON.parse(savedTheme) as boolean : false
   })

   const API_KEY: string = import.meta.env.VITE_OMDB_API_KEY

   useEffect(() => {
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
         .then(res => res.json())
         .then(res => setMovies(res.results))
         .catch(err => console.error(err))
      
      document.body.setAttribute("data-theme", darkMode ? "dark": "light")

      localStorage.setItem("moviesDarkTheme", JSON.stringify(darkMode))
   }, [darkMode])

   console.log(movies)

   function handleTheme(): void {
      setDarkMode( previousState => !previousState)
   }


   return (
      <>
         <Header darkMode={darkMode} handleTheme={handleTheme} />

         <Outlet context={movies} />
      </>
   )
}
