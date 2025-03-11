import { Movies } from "../Layout/Layout";
import { formatDate, OutletContextType } from "../Home/Home";
import { useOutletContext, useParams, Link } from "react-router-dom"
import { ThreeDots } from 'react-loader-spinner';
import leftArrow from '../../assets/images/left-arrow.png'

import "./movieDetailStyle.scss"


export const MovieDetail: React.FC = () => {
   const { movies } = useOutletContext<OutletContextType>();

   const { id } = useParams()

   if (!movies || movies.length <= 0) {
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

   const movie: Movies | undefined = movies.find(film => film.id === Number(id))

   if (!movie) {
      return (
         <div className="movie-detail__error">
            <Link to="/">
               <img width={17} src={leftArrow} alt="Image of a left arrow" />
               Go back to Home
            </Link>

            <p>Movie not found!</p>

         </div>
      );
   }

   console.log(movie)


   return (
      <section className="movie-detail">
         <img className='movie-detail__img' src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster of the movie ${movie.title}`} />

         <h2 className="movie-detail__title"><span>Title:</span> {movie.title}</h2>

         <p className="movie-detail__rating">⭐ {movie.vote_average.toFixed(1)}</p>

         <p className="movie-detail__release-date">📅 {formatDate(movie.release_date)}</p>

         <p className="movie-detail__description">
            Sinopse: {movie.overview}
         </p>



      </section>
   )
}
