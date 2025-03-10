import { useOutletContext, Link } from 'react-router-dom'
import { Movies } from '../Layout/Layout'

import './homeStyle.scss'


export const Home: React.FC = () => {
   const moviesArray: Movies[] = useOutletContext()

   const movies = moviesArray.map(movie => (
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
               
               <p className="movie__release">📅 {movie.release_date}</p>
            </div>
         </div>
      </Link>

   ))

   return (
      <section className="home__movies">
         {movies}
      </section>
   )
}
