import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import slider1 from '../../assets/Images/slider1.jpg'
import slider2 from '../../assets/Images/slider2.jpg'

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const slides = [
    {
      id: 1,
      image: slider1,
      title: '#STREET2STADIUM',
      subtitle: "INDIA'S BIGGEST GRASSROOTS CRICKET CARNIVAL",
      description: 'A CELEBRATION OF CHAMPIONS'
    },
    {
      id: 2,
      image: slider2,
      title: '#STREET2STADIUM',
      subtitle: "INDIA'S BIGGEST GRASSROOTS CRICKET CARNIVAL",
      description: 'A CELEBRATION OF CHAMPIONS'
    }
  ]

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
  }

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Slides Container */}
      <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-4 md:px-8 lg:px-12">
              <div className="max-w-2xl">
                {/* Title */}
                <h2
                  className="text-2xl md:text-4xl lg:text-5xl font-bold italic mb-2 md:mb-4"
                  style={{ color: 'var(--color-crickbroYellow)' }}
                >
                  {slide.title}
                </h2>

                {/* Subtitle */}
                <p
                  className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3"
                  style={{ color: 'var(--color-header-text)' }}
                >
                  {slide.subtitle}
                </p>

                {/* Description */}
                <p
                  className="text-base md:text-lg lg:text-xl font-light"
                  style={{ color: 'var(--color-header-text)' }}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setAutoPlay(false)}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-5 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all group"
        title="Previous slide"
      >
        <ChevronLeft
          size={24}
          className="text-white group-hover:scale-110 transition-transform"
        />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setAutoPlay(false)}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-5 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all group"
        title="Next slide"
      >
        <ChevronRight
          size={24}
          className="text-white group-hover:scale-110 transition-transform"
        />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-5 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-8 h-2 md:w-10 md:h-2.5'
                : 'w-2 h-2 md:w-3 md:h-2.5 opacity-50'
            }`}
            style={{
              backgroundColor:
                index === currentSlide
                  ? 'var(--color-crickbroYellow)'
                  : 'var(--color-header-text)'
            }}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause/Play on Hover */}
      <div className="absolute top-4 right-4 z-10">
        {/* <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white text-xs md:text-sm font-medium"
        >
          {autoPlay ? 'PAUSE' : 'PLAY'}
        </button> */}
      </div>
    </div>
  )
}

export default Slider
