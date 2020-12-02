import { useRef, useEffect } from 'react'

function useInterval (callback, delay, immediately = false) {
  const savedCallback = useRef()

  useEffect(() => {
    if (immediately) {
      callback()
    }
  }, [immediately, callback])

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const timer = setInterval(() => savedCallback.current(), delay)

      return () => clearInterval(timer)
    }
  }, [delay])
}

export default useInterval
