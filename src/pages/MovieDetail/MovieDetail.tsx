import { Movies } from "../Layout/Layout";
import { formatDate, OutletContextType } from "../Home/Home";
import { useOutletContext, useParams, Link, useLocation } from "react-router-dom"
import { ThreeDots } from 'react-loader-spinner';
import { useEffect, useState } from "react";
import leftArrow from '../../assets/images/left-arrow.png'
import castImg from '../../assets/images/person.svg'

import "./movieDetailStyle.scss"


interface MovieDetailProps {
   character: string
   id: number
   name: string
   popularity: number
   profile_path: string
}


export const MovieDetail: React.FC = () => {
   const { movies } = useOutletContext<OutletContextType>();

   const [cast, setCast] = useState<MovieDetailProps[]>([])

   const { id } = useParams()

   const API_KEY: string = import.meta.env.VITE_OMDB_API_KEY

   useEffect(() => {
      async function fetchData() {
         try {
            const [castResponse] = await Promise.all([
               fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)
            ])
            const castData = await castResponse.json()
            setCast(castData.cast)
         } catch (error) {
            console.log(`Error fetching data: ${error}`)
         }
      }
      fetchData()
   }, [id])

   const pageLocation = useLocation()

   const movieGenreState = pageLocation.state?.searchUrl

   const movieGenreType = pageLocation.state?.type || "all"

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

   console.log(cast)
   return (
      <>
         <section className="movie-detail">
            <Link className="movie-detail-link" to={`..?${movieGenreState}`}>
               <img src={leftArrow} alt="Icon of a left arrow" />
               Back to {movieGenreType} movies
            </Link>

            <img className='movie-detail__img' src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster of the movie ${movie.title}`} />

            <h2 className="movie-detail__title"><span>Title:</span> {movie.title}</h2>

            <p className="movie-detail__rating">⭐ {movie.vote_average.toFixed(1)}</p>

            <p className="movie-detail__release-date">📅 {formatDate(movie.release_date)}</p>

            <p className="movie-detail__description">
               Sinopse: {movie.overview}
            </p>
         </section>

         <h3 className="movie-detail__cast-name">Cast</h3>

         <section className="movie-detail__cast">
            {cast.slice(0, 6).map(actor => {
               const castImage = actor.profile_path ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}` : castImg

               return <div key={actor.id} className="movie-detail__div">
                  <img src={castImage} alt={`Picture of ${actor.name}`} />

                  <h4 className="movie-detail__cast_name">{actor.name}</h4>

                  <p className="movie-detail__popularity">
                     Popularity: {actor.popularity.toFixed(2)}
                  </p>
               </div>
})}
         </section>
      </>
   )
}
