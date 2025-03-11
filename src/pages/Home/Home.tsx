import { useOutletContext, Link, useSearchParams } from 'react-router-dom'
import { Genres, Movies } from '../Layout/Layout'
import { ThreeDots } from 'react-loader-spinner';

import './homeStyle.scss'
import { useEffect, useState } from 'react';


export interface OutletContextType {
   movies: Movies[];
   genres: Genres[];
   page: number
   setPage: React.Dispatch<React.SetStateAction<number>>
   totalPages: number
}

export function formatDate(dateString: string, locale = navigator.language) {
   const date = new Date(dateString)
   return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   })
      .format(date)
      .replace(/-/g, "/")
}



export const Home: React.FC = () => {
   const { movies = [], genres = [], page, setPage, totalPages } = useOutletContext<OutletContextType>()

   const [searchParams, setSearchParams] = useSearchParams();

   const getMoviesByGenre = searchParams.get("genre")

   const filteredMovies = getMoviesByGenre ? movies.filter(movie => movie.genre_ids.includes(Number(getMoviesByGenre))) : movies

   const hasMoreMovies = filteredMovies.length > 0 && page < totalPages

   function loadMoreMovies() {
      if (hasMoreMovies) {
         setPage(previousState => previousState + 1)
      }
   }

   useEffect(() => {
      function handleScroll() {
         const { scrollTop, clientHeight, scrollHeight } = document.documentElement

         // Verifies if user is on the end of page
         if (scrollTop + clientHeight >= scrollHeight - 100 && hasMoreMovies) {
            loadMoreMovies()
         }
      }

      // Adiciona o evento de rolagem
      window.addEventListener("scroll", handleScroll)

      // Remove o evento ao desmontar o componente
      return () => {
         window.removeEventListener("scroll", handleScroll);
      }
   }, [page, totalPages, filteredMovies.length])


   if (movies.length === 0 || genres.length === 0) {
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
                  <Link className='movie__link' to={`?genre=${genre.id}`}>{genre.name}</Link>
               </li>
            ))}
         </ul>

         <section className="home__movies">
            {moviesList}

            {hasMoreMovies && (
               <div className="loading-more">
                  <ThreeDots
                     visible={true}
                     height={40}
                     width={40}
                     color="rgb(80, 135, 167)"
                     radius="9"
                     ariaLabel="three-dots-loading"
                  />
               </div>
            )}
         </section>
      </main>
   )
}
