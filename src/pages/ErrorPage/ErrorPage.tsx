import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";
import leftArrow from '../../assets/images/left-arrow.png'

import "./errorPageStyle.scss";


type RouteError = {
   status?: number
   statusText?: string
   message?: string
}


export default function ErrorPage() {
   const error = useRouteError() as RouteError;
   console.log(error)

   return (
      <section className="error-page">
         <h1> Oops! Something went wrong 😢</h1>
         {error.status === 404 ? (
            <>
               <h2 className="error-page__subtitle">404 - Page Not Found</h2>
               <p>The page you are trying to access does not exist.</p>
            </>
         ) : (
            <>
               <h2>Unexpected Error</h2>
               <p>{error.statusText || error.message}</p>
            </>
         )}

         <Link to="/" className="error-page__link">
            <img src={leftArrow} alt="Icon of a left arrow" />
            Go back to the homepage
         </Link>
      </section>
   );
}
