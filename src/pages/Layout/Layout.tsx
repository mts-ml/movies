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
   genre_ids: number[]
}


export interface Genres {
   id: number;
   name: string;
}


export const Layout: React.FC = () => {
   const [movies, setMovies] = useState<Movies[]>([])

   const [page, setPage] = useState<number>(1)

   const [totalPages, setTotalPages] = useState<number>(1)

   const [genres, setGenres] = useState<Genres[]>([])

   const [isLoading, setIsLoading] = useState<boolean>(false)

   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
      const savedTheme: string | null = localStorage.getItem("moviesDarkTheme")

      return savedTheme !== null ? JSON.parse(savedTheme) as boolean : false
   })
   
   const API_KEY: string = import.meta.env.VITE_OMDB_API_KEY

   useEffect(() => {
      async function fetchData() {
         setIsLoading(true)
         try {
            const [moviesResponse, genresResponse] = await Promise.all([
               fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`),

               fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
            ])

            const moviesData = await moviesResponse.json()
            const genresData = await genresResponse.json()

            setMovies(previousMovies => (
               page === 1 ?
                  moviesData.results
                  :
                  [...previousMovies,
                  ...moviesData.results]
            ))


            setTotalPages(moviesData.total_pages)

            setGenres(genresData.genres)
         } catch (error) {
            console.error(error)
         } finally {
            setIsLoading(false)
         }
      }
      fetchData()

      document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light")

      localStorage.setItem("moviesDarkTheme", JSON.stringify(isDarkMode))
   }, [isDarkMode, page])

   function handleTheme(): void {
      setIsDarkMode(previousState => !previousState)
   }


   return (
      <>
         <Header isDarkMode={isDarkMode} handleTheme={handleTheme} />

         <Outlet context={{ movies, genres, page, setPage, totalPages, isLoading, setIsLoading }} />
      </>
   )
}
