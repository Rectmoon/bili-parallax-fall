import { useRef, useEffect } from 'react'
import useInterval from '../../hooks/useInterval'
import useEventListener from '../../hooks/useEventListener'
import fairy from '../../assets/fairy.png'
import hill from '../../assets/hill.png'
import girlEyeOpen from '../../assets/girl-eye-open.png'
import girlNapping from '../../assets/girl-eye-napping.png'
import girlClosed from '../../assets/girl-eye-closed.png'
import leaf from '../../assets/leaf.png'
import foreground from '../../assets/foreground.png'
import background from '../../assets/background.png'
import './index.css'

function Banner () {
  const animateBanner = useRef(null)
  const animateGirl = useRef(null)
  const initConfig = [
    {
      aspect: 1,
      blur: 4,
      x: 0,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => blur + p * blur,
      parallaxX: (x, p) => x
    },
    {
      aspect: 0.6,
      blur: 0,
      x: 0,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(p * 10),
      parallaxX: (x, p) => (x || 0) - p * 10
    },
    {
      aspect: 1,
      blur: 1,
      x: -50,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 4),
      parallaxX: (x, p) => (x || 0) - p * 30
    },
    {
      aspect: 0.6,
      blur: 4,
      x: 0,
      y: 4.2,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 8),
      parallaxX: (x, p) => (x || 0) - p * 45
    },
    {
      aspect: 0.6,
      blur: 5,
      x: 0,
      y: -1.8,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 8),
      parallaxX: (x, p) => (x || 0) - p * 95
    },
    {
      aspect: 0.65,
      blur: 6,
      x: 0,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 4),
      parallaxX: (x, p) => x || 0 - p * 118
    }
  ]
  const endpoint = { width: 0, x: 0 }
  const breakpoint = 1658
  const movementTemplate = (
    blur = 0,
    x = 0,
    y = 0,
    rotate = 0,
    isReset = false
  ) =>
    `filter: blur(${blur}px); transition-duration:${
      isReset ? '0.2s' : '0s'
    }; transform:translate(${x}px, ${y}px) rotate(${rotate}deg) translateZ(0);`

  const initRectSmallScreen = (index, item) => {
    const originWidth = parseInt(item.dataset.width, 10)
    const originHeight = parseInt(item.dataset.height, 10)
    const { aspect, blur, x, y, rotate } = initConfig[index]

    item.width = aspect * originWidth
    item.height = aspect * originHeight
    item.style = movementTemplate(blur, x, y, rotate)
  }

  const initRectNormalScreen = (index, item, rectWidth) => {
    const { blur, x, y, rotate, aspect } = initConfig[index]
    const originWidth = parseInt(item.dataset.width, 10)
    const originHeight = parseInt(item.dataset.height, 10)
    const screenWidth = parseInt(rectWidth, 10)
    const width = aspect * originWidth
    const height = aspect * originHeight

    item.width = width + parseInt((screenWidth - breakpoint) / 10) * 12
    item.height = height + parseInt((screenWidth - breakpoint) / 10) * 1
    item.style = movementTemplate(blur, x, y, rotate)
  }

  const initBannerImages = (banner, parallax) => {
    if (
      banner.current &&
      banner.current.childNodes &&
      banner.current.childNodes.length
    ) {
      const { width } = banner.current.getBoundingClientRect()

      Array.from(banner.current.childNodes).forEach((item, index) => {
        const img = item.childNodes[0]

        width < breakpoint
          ? initRectSmallScreen(index, img)
          : initRectNormalScreen(index, img, width)
        parallax && makeBlurMoveEffect(img, index, parallax)
      })
    }
  }

  const sleep = t => new Promise(resolve => setTimeout(resolve, t))
  const makeBlink = async () => {
    if (animateGirl.current) {
      const img = animateGirl.current.childNodes[0]
      await sleep(50)
      img.src = girlNapping
      await sleep(50)
      img.src = girlClosed
      await sleep(350)
      img.src = girlEyeOpen
    }
  }

  const makeBlurMoveEffect = (img, index, parallax) => {
    const { blurEffect, parallaxX, blur, x, y, rotate } = initConfig[index]

    img.style = movementTemplate(
      blurEffect(blur, parallax),
      parallaxX(x, parallax),
      y,
      rotate
    )
  }

  const resetBannerImagesEffect = banner => {
    endpoint.width = 0
    endpoint.x = 0

    if (
      banner.current &&
      banner.current.childNodes &&
      banner.current.childNodes.length > 0
    ) {
      Array.from(banner.current.childNodes).forEach((item, index) => {
        const img = item.childNodes[0]
        const { blur, x, y, rotate } = initConfig[index]

        img.style = movementTemplate(blur, x, y, rotate, true)
      })
    }
  }

  const initBanner = () => initBannerImages(animateBanner)

  useInterval(makeBlink, 5000, true)
  useEventListener('resize', initBanner)
  useEffect(() => {
    const animateBannerDom = animateBanner.current

    const handleMouseEnter = event => {
      const { width } = animateBannerDom.getBoundingClientRect()

      endpoint.x = event.clientX
      endpoint.width = width
    }

    const handleMousemove = event => {
      const parallax = event.clientX - endpoint.x
      const parallaxRatio = parallax / endpoint.width

      initBannerImages(animateBanner, parallaxRatio)
    }

    const handleMouseleave = () => resetBannerImagesEffect(animateBanner)

    if (animateBannerDom) {
      initBanner()
      animateBannerDom.addEventListener('mouseenter', handleMouseEnter)
      animateBannerDom.addEventListener('mousemove', handleMousemove)
      animateBannerDom.addEventListener('mouseleave', handleMouseleave)

      return () => {
        animateBannerDom.removeEventListener('mouseenter', handleMouseEnter)
        animateBannerDom.removeEventListener('mousemove', handleMousemove)
        animateBannerDom.removeEventListener('mouseleave', handleMouseleave)
      }
    }
  })

  return (
    <>
      <div className='banner' ref={animateBanner}>
        <div className='layer'>
          <img
            src={background}
            data-width='3000'
            data-height='250'
            alt='background'
          />
        </div>

        <div className='layer' ref={animateGirl}>
          <img
            src={girlEyeOpen}
            data-width='3000'
            data-height='275'
            alt='girl'
          />
        </div>

        <div className='layer'>
          <img src={hill} data-width='3000' data-height='250' alt='hill' />
        </div>

        <div className='layer'>
          <img
            src={foreground}
            data-width='3000'
            data-height='250'
            alt='foreground'
          />
        </div>

        <div className='layer'>
          <img src={fairy} data-width='3000' data-height='275' alt='fairy' />
        </div>

        <div className='layer'>
          <img src={leaf} data-width='3000' data-height='275' alt='leaf' />
        </div>
      </div>
    </>
  )
}

export default Banner
