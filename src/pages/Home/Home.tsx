import { useOutletContext, Link } from 'react-router-dom'
import { Genres, Movies } from '../Layout/Layout'
import { ThreeDots } from 'react-loader-spinner';

import './homeStyle.scss'


export interface OutletContextType {
   movies: Movies[];
   genres: Genres[];
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
   const { movies = [], genres = [] } = useOutletContext<OutletContextType>()

   if (movies.length <= 0 || genres.length <= 0) {
      return (
         <div id='loading'>
            <span>Loading...</span>
            <ThreeDots
               visible={true}
               height={80}
               width={80}
               color="rgb(80, 135, 167)"
               radius="9"
               ariaLabel="three-dots-loading"
            />
         </div>
      )
   }

   const moviesList = movies.map(movie => (
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
      <section className="home__movies">
         {moviesList}
      </section>
   )
}
