import { formatDate, } from "../Home/Home";
import { useParams, Link, useLocation, useLoaderData } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import leftArrow from '../../assets/images/left-arrow.png'
import castImg from '../../assets/images/person.svg'
import { MovieDetailLoaderData } from "../../moviesLoader";

import "./movieDetailStyle.scss"


export const MovieDetail: React.FC = () => {
   const { movie, cast, trailers } = useLoaderData() as MovieDetailLoaderData
   const carousel = useRef<HTMLElement | null>(null)
   const pageLocation = useLocation()
   const movieGenreState = pageLocation.search
   const movieGenreType = pageLocation.state?.type || "all"

   const youTubeTrailers = trailers.filter(trailer => (
      trailer.site === "YouTube" && trailer.type === "Trailer"
   ))

   function handleLeftClick(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault()
      if (carousel.current && carousel.current.offsetWidth) {
         carousel.current.scrollLeft -= carousel.current.offsetWidth
      }
   }

   function handleRightClick(event: React.MouseEvent<HTMLButtonElement>) {
      event.preventDefault()
      if (carousel.current && carousel.current.offsetWidth) {
         carousel.current.scrollLeft += carousel.current.offsetWidth
      }
   }


   return (
      <main className="movie-detail__main">
         <section className="movie-detail">
            <Link className="movie-detail-link" to={`..${movieGenreState}`}>
               <img src={leftArrow} alt="Icon of a left arrow" />
               Back to {movieGenreType} movies
            </Link>

            <img
               className='movie-detail__img'
               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
               alt={`Poster of the movie ${movie.title}`}
            />

            <h2 className="movie-detail__title"><span>Title:</span> {movie.title}</h2>

            <p className="movie-detail__rating">⭐ {movie.vote_average.toFixed(1)}</p>

            <p className="movie-detail__release-date">📅 {formatDate(movie.release_date)}</p>

            <p className="movie-detail__description">
               Sinopse: {movie.overview}
            </p>
         </section>

         <h3 className="movie-detail__cast-name">Cast</h3>
         <section className="movie-detail__cast" ref={carousel}>
            {cast.length === 0 ? (
               <p className="movie-detail__error">No cast avaiable</p>
            ) : (
               cast.map(actor => {
                  const castImage = actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : castImg

                  return <div key={actor.id} className="movie-detail__div">
                     <img src={castImage} alt={`Picture of ${actor.name}`} />

                     <h4 className="movie-detail__cast_name">{actor.name}</h4>

                     <p className="movie-detail__character">{actor.character || "Character not especified"}</p>

                     <p className="movie-detail__popularity">
                        Popularity: {actor.popularity.toFixed(2)}
                     </p>
                  </div>
               })
            )
            }
         </section>

         <div className={cast.length === 0 ? "movie-detail__disabled" : "movie-detail__buttons"}>
            <button
               aria-label="Arrow back"
               type="button"
               onClick={handleLeftClick}
            >
               <svg
                  className="movie-detail__arrows"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30" height="30" viewBox="0 0 24 24"
                  fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
               </svg>
            </button>

            <button
               aria-label="Arrow forward"
               type="button"
               onClick={handleRightClick}
            >
               <svg
                  className="movie-detail__arrows"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30" height="30" viewBox="0 0 24 24"
                  fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
               </svg>
            </button>
         </div>

         <div className="movie-detail__div-absolute">
            <h3 className="movie-detail__trailers-title">Trailer</h3>
            <section className="movie-detail__trailers">
               {youTubeTrailers.length === 0 ? (
                  <p className="movie-detail__error">No trailer avaiable</p>
               ) : (

                  <div className="movie-detail__video-container">
                     <iframe
                        width={280}
                        height={463}
                        src={`https://www.youtube.com/embed/${youTubeTrailers[0]?.key}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                     ></iframe>
                  </div>
               )}
            </section>
         </div>
      </main>
   )
}
