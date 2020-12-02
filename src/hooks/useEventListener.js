import { useRef, useEffect } from 'react'

function useEventListener (eventName, handler, element = window) {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventLisener = event => savedHandler.current(event)
    element.addEventListener(eventName, eventLisener)

    return () => {
      element.removeEventListener(eventName, eventLisener)
    }
  }, [element, eventName])
}

export default useEventListener
