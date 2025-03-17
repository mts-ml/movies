import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";


export const Layout: React.FC = () => {
   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
      const savedTheme: string | null = localStorage.getItem("moviesDarkTheme")

      return savedTheme !== null ? JSON.parse(savedTheme) as boolean : false
   })

   function handleTheme(): void {
      setIsDarkMode(previousState => !previousState)
   }

   useEffect(() => {
      document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light")

      localStorage.setItem("moviesDarkTheme", JSON.stringify(isDarkMode))
   }, [isDarkMode])


   return (
      <>
         <Header isDarkMode={isDarkMode} handleTheme={handleTheme} />

         <Outlet />
      </>
   )
}
