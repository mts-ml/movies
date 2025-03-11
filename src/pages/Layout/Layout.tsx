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


export interface Genres {
   id: number;
   name: string;
}


export const Layout: React.FC = () => {
   const [movies, setMovies] = useState<Movies[]>([])

   const [genres, setGenres] = useState<Genres[]>([])
   console.log(genres)

   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
      const savedTheme: string | null = localStorage.getItem("moviesDarkTheme")

      return savedTheme !== null ? JSON.parse(savedTheme) as boolean : false
   })

   const API_KEY: string = import.meta.env.VITE_OMDB_API_KEY

   useEffect(() => {
      async function fetchData() {
         try {
            const [moviesResponse, genresResponse] = await Promise.all([
               fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`),

               fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
            ])

            const moviesData = await moviesResponse.json()
            const genresData = await genresResponse.json()

            setMovies(moviesData.results)
            setGenres(genresData)
         } catch (error) {
            console.error(error)
         }
      }
      fetchData()

      document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light")

      localStorage.setItem("moviesDarkTheme", JSON.stringify(isDarkMode))
   }, [isDarkMode])


   console.log(movies)

   function handleTheme(): void {
      setIsDarkMode(previousState => !previousState)
   }


   return (
      <>
         <Header isDarkMode={isDarkMode} handleTheme={handleTheme} />

         <Outlet context={{ movies, genres }} />
      </>
   )
}
