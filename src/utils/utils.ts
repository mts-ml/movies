export function handleCastLeftClick(event: React.MouseEvent<HTMLButtonElement>, ref: React.RefObject<HTMLElement | null>) {
   event.preventDefault()
   if (ref.current && ref.current.offsetWidth) {
      ref.current.scrollLeft -= ref.current.offsetWidth
   }
}

export function handleCastRightClick(event: React.MouseEvent<HTMLButtonElement>, ref: React.RefObject<HTMLElement | null>) {
   event.preventDefault()
   if (ref.current && ref.current.offsetWidth) {
      ref.current.scrollLeft += ref.current.offsetWidth
   }
}

export function throttle(callback: () => void, delay: number) {
   let shouldWait = false

   return () => {
      if (!shouldWait) {
         callback()
         shouldWait = true

         setTimeout( () => {
            shouldWait = false
         }, delay)
      }
   }
}
