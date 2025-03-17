import { Link, useSearchParams, useLoaderData } from 'react-router-dom'
import { HomeLoaderData, Movies } from '../../moviesLoader';
import { ThreeDots } from 'react-loader-spinner';
import { useEffect, useState } from 'react';
import img from '../../assets/images/default-img.png'

import './homeStyle.scss'


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
   const { movies, genres, totalPages } = useLoaderData() as HomeLoaderData
   const [searchParams, setSearchParams] = useSearchParams()
   const [allMovies, setAllMovies] = useState<Movies[]>(movies)
   const [currentPage, setCurrentPage] = useState<number>(1)
   const [isLoading, setIsLoading] = useState<boolean>(false)

   const getMoviesByGenre = searchParams.get("genre")

   const handleGenreChange = () => {
      setAllMovies([])
      setCurrentPage(1)
      setSearchParams(params => {
         params.delete("page")
         return params
      })
   }

   useEffect(() => {
      const handleScroll = () => {
         if (isLoading || currentPage >= totalPages) return

         const scrollDistanceFromTop = document.documentElement.scrollTop
         const totalPageHeight = document.documentElement.scrollHeight
         const visibleViewportHeight = document.documentElement.clientHeight

         if (scrollDistanceFromTop + visibleViewportHeight >= totalPageHeight - 100) {
            setIsLoading(true)
            setCurrentPage(previousPage => {
               const nextPage = previousPage + 1

               setSearchParams(previousParams => {
                  previousParams.set("page", String(nextPage))
                  return previousParams
               })

               return nextPage
            })
         }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
   }, [isLoading, currentPage, totalPages, searchParams])

   useEffect(() => {
      currentPage === 1 ? setAllMovies(movies) : setAllMovies((previousState: Movies[]) => (
         [...previousState,
         ...movies
         ]
      ))
      setIsLoading(false)
   }, [movies])

   if (!allMovies?.length || !genres?.length) {
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
   const moviesList = allMovies.filter(movie => {
      if (!uniqueIdsSet.has(movie.id)) {
         uniqueIdsSet.add(movie.id)
         return true
      }
      return false
   }).map(movie => {
      const image = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : img

      return <Link
         to={`movie/${movie.id}?${searchParams.toString()}`}
         state={{ type: genreName }}
         key={movie.id}
         className="movie"
      >
         <div className="movie__content">
            <img className='movie__img' src={image} alt={`Poster of the movie ${movie.title}`} />

            <div className="movie__details">
               <h3 className="movie__title">{movie.title}</h3>

               <p className="movie__rating">⭐ {movie.vote_average.toFixed(1)}</p>

               <p className="movie__release">📅 {formatDate(movie.release_date)}</p>
            </div>
         </div>
      </Link>
   })


   return (
      <main className="main">
         <ul className="movie__genres">
            {genres.map(genre => (
               <li key={genre.id}>
                  <Link
                     className={`movie__link ${getMoviesByGenre === String(genre.id) ? "active" : ""}`}
                     to={`?genre=${genre.id}`}
                     onClick={handleGenreChange}
                  >
                     {genre.name}
                  </Link>
               </li>
            ))}
         </ul>

         <button
            type='button'
            className={`movie__clear-filter ${getMoviesByGenre ? "movie__btn-visible" : ""}`}
            onClick={() => setSearchParams({})}
         >
            Clear filter
         </button>

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

         {!isLoading && currentPage < totalPages && (
            <button type='button'
               className="load-more-button"
               onClick={() => setCurrentPage(previousState => previousState + 1)}
            >Page {currentPage} - Click for next
            </button>
         )}
      </main>
   )
}
