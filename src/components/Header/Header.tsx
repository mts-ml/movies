import { Link } from 'react-router-dom'
import camera from '../../assets/images/camera.svg'
import sun from '../../assets/images/sun.svg'
import moon from '../../assets/images/moon.svg'

import './headerStyle.scss'


interface HeaderProps {
   isDarkMode: boolean
   handleTheme: () => void
}


export const Header: React.FC<HeaderProps> = ({isDarkMode, handleTheme}) => {
   return (
      <header className="header">
         <div className="header__wrapper">
            <Link to="/" className="header__movies">
               <h1 className="header__title">Movies</h1>

               <img
               className={isDarkMode ? "header__title-img" : ""}
               src={camera}
               width={30}
               alt="Image of a camera"
               />
            </Link>

            <button
               type='button' className="header__theme-btn"
               onClick={handleTheme}
            >
               {isDarkMode ?
                  <>
                     Light mode
                     < img
                        className='header__sun-img'
                        width={20}
                        src={sun}
                        alt="Icon of the sun"
                     />
                  </>
                  :
                  <>
                     Dark Mode
                     <img
                        className='header__moon-img'
                        width={20}
                        src={moon}
                        alt="Icon of the moon"
                     />
                  </>
               }
            </button>
         </div>
      </header>
   )
}
