import { Link } from 'react-router-dom'
import camera from '../../assets/images/camera.svg'
import sun from '../../assets/images/sun.svg'
import moon from '../../assets/images/moon.svg'

import './headerStyle.scss'


export const Header: React.FC = () => {
   return (
      <header className="header">
         <div className="header__wrapper">
            <Link to="/" className="header__movies">
               <h1 className="header__title">Movies</h1>

               <img src={camera} width={30} alt="Image of a camera" />
            </Link>

            <button type='button' className="header__theme-btn">
               Dark mode
               {/* <img src={sun} alt="Icon of the sun" /> */}
               <img src={moon} alt="Icon of the moon" />
            </button>
         </div>
      </header>
   )
}
