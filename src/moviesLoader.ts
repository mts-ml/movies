import { LoaderFunctionArgs } from "react-router-dom";


export interface Movies {
   id: number
   title: string
   poster_path: string
   release_date: string
   vote_average: number
   overview: string
   genre_ids: number[]
}

export interface Genres {
   id: number
   name: string
}

export interface MovieDetailProps {
   character: string
   id: number
   name: string
   popularity: number
   profile_path: string
}

export interface TrailerProps {
   id: string
   site: string
   type: string
   key: string
}

export interface HomeLoaderData {
   movies: Movies[]
   genres: Genres[]
   totalPages: number
}

export interface MovieDetailLoaderData {
   movie: Movies
   cast: MovieDetailProps[]
   trailers: TrailerProps[]
}


export async function homeLoader({ request }: LoaderFunctionArgs): Promise<HomeLoaderData> {
   const API_KEY = import.meta.env.VITE_THEMOVIEDB_API_KEY
   const url = new URL(request.url)
   const page = url.searchParams.get("page") || "1"
   const genre = url.searchParams.get("genre")

   const [moviesResponse, genresResponse] = await Promise.all([
      fetch(
         `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&with_genres=${genre || ""}`
      ),
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
   ])

   if (!moviesResponse.ok || !genresResponse.ok) throw new Error("Failed to fetch")

   const moviesData = await moviesResponse.json()
   const genresData = await genresResponse.json()

   return {
      movies: moviesData.results,
      genres: genresData.genres,
      totalPages: moviesData.total_pages,
   }
}


export async function movieDetailLoader({ params }: LoaderFunctionArgs): Promise<MovieDetailLoaderData> {
   const API_KEY = import.meta.env.VITE_THEMOVIEDB_API_KEY
   const { id } = params

   const [movieResponse, castResponse, trailerResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),

      fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`),

      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`),
   ])

   if (!movieResponse.ok || !castResponse.ok || !trailerResponse.ok) throw new Error("Failed to fetch")

   const movie = await movieResponse.json()
   const cast = await castResponse.json()
   const trailers = await trailerResponse.json()

   return {
      movie,
      cast: cast.cast,
      trailers: trailers.results,
   };
}
