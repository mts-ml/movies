import { useOutletContext, Link, useSearchParams } from 'react-router-dom'
import { Genres, Movies } from '../Layout/Layout'
import { ThreeDots } from 'react-loader-spinner';
import { useEffect } from 'react';

import './homeStyle.scss'


export interface OutletContextType {
   movies: Movies[]
   genres: Genres[]
   page: number
   setPage: React.Dispatch<React.SetStateAction<number>>
   totalPages: number
   isLoading: boolean
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function formatDate(dateString: string, locale = navigator.language) {
   const date = new Date(dateString)
   if (isNaN(date.getTime())) return "Invalid Date"

   return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   })
      .format(date)
      .replace(/-/g, "/")
}

export const Home: React.FC = () => {
   const { movies, genres, page, setPage, totalPages, isLoading, setIsLoading } = useOutletContext<OutletContextType>()

   useEffect(() => {
      const handleScroll = () => {
         if (isLoading || page >= totalPages) return

         const scrollDistanceFromTop = document.documentElement.scrollTop;
         const totalPageHeight = document.documentElement.scrollHeight;
         const visibleViewportHeight = document.documentElement.clientHeight;


         if (scrollDistanceFromTop + visibleViewportHeight >= totalPageHeight - 100) {
            setIsLoading(true)
            setPage(previousState => previousState + 1)
         }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
   }, [isLoading, page, totalPages, setPage])

   useEffect(() => {
      setIsLoading(false)
   }, [movies])

   const [searchParams, setSearchParams] = useSearchParams();

   const getMoviesByGenre = searchParams.get("genre")

   const filteredMovies = getMoviesByGenre ? movies.filter(movie => movie.genre_ids.includes(Number(getMoviesByGenre))) : movies

   if (!movies?.length || !genres?.length) {
      return (
         <div id='loading' >
            <span>Loading...</span>
            <ThreeDots
               visible={true}
               height={80}
               width={80}
               color="rgb(80, 135, 167)"
               radius="9"
               ariaLabel="three-dots-loading"
            />
         </div >
      )
   }

   const genreName = genres.find(genre => genre.id === Number(getMoviesByGenre))?.name || "all"

   const uniqueIdsSet = new Set<number>()
   const moviesList = filteredMovies.filter(movie => {
      if (!uniqueIdsSet.has(movie.id)) {
         uniqueIdsSet.add(movie.id)
         return true
      }
      return false
   }).map(movie => (
      <Link
         to={`movie/${movie.id}`}
         state={{ searchUrl: searchParams.toString(), type: genreName }}
         key={movie.id}
         className="movie"
      >
         <div className="movie__content">
            <img className='movie__img' src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster of the movie ${movie.title}`} />

            <div className="movie__details">
               <h3 className="movie__title">{movie.title}</h3>

               <p className="movie__rating">⭐ {movie.vote_average.toFixed(1)}</p>

               <p className="movie__release">📅 {formatDate(movie.release_date)}</p>
            </div>
         </div>
      </Link>
   ))


   return (
      <main className="main">
         <ul className="movie__genres">
            {genres.map(genre => (
               <li key={genre.id}>
                  <Link
                     className={`movie__link ${getMoviesByGenre === String(genre.id) ? "active" : ""}`}
                     to={`?genre=${genre.id}`}>
                     {genre.name}
                  </Link>
               </li>
            ))}
         </ul>

         <button
            type='button'
            className={`movie__clear-filter ${getMoviesByGenre ? "movie__btn-visible" : ""}`}
            onClick={() => setSearchParams({})}
         >Clear filter</button>

         <section className="home__movies">
            {moviesList}
         </section>

         {isLoading && (
            <div className="loading-more">
               <ThreeDots
                  visible={true}
                  height={80}
                  width={80}
                  color="rgb(80, 135, 167)"
                  radius="9"
               />
            </div>
         )}

         {!isLoading && page < totalPages && (
            <button type='button'
               className="load-more-button"
               onClick={() => setPage(previousState => previousState + 1)}
            >Page {page} - Click for next
            </button>
         )}
      </main>
   )
}
