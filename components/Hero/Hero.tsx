"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Recycle,
  Users,
  Play,
  Star,
  ArrowRight,
} from "lucide-react"
import Image1 from '@/images/HeroImg1.png'
import Image2 from '@/images/HeroImg2.jpeg'
import Image3 from '@/images/HeroImg3.png'
import Image from "next/image"
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next")

  const slides = [
  {
    id: 1,
    image: Image1, // Jewelry
    headline: "Elegance in Every Detail",
    subtext:
      "Discover timeless jewelry that tells your story. Handcrafted with care, designed to shine through every moment.",
    ctaText: "Shop Jewelry",
    ctaLink: "/products/jewelry",
    bgColor: "from-rose-600 via-pink-500 to-fuchsia-500",
    textPosition: "left",
    badge: "New Arrival",
  },
  {
    id: 2,
    image: Image2, // Watch
    headline: "Time Meets Craftsmanship",
    subtext:
      "Explore our exclusive watch collection — precision engineering and luxury style for the modern wrist.",
    ctaText: "Browse Watches",
    ctaLink: "/products/watches",
    bgColor: "from-gray-700 via-slate-800 to-black",
    textPosition: "center",
    badge: "Limited Edition",
  },
  {
    id: 3,
    image: Image3, // Shoes
    headline: "Step into Your Element",
    subtext:
      "Performance meets comfort in our latest footwear drop. Built to support your every stride, wherever life takes you.",
    ctaText: "Explore Footwear",
    ctaLink: "/products/shoes",
    bgColor: "from-indigo-600 via-violet-600 to-purple-700",
    textPosition: "right",
    badge: "New Collection",
  },
]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Same-day shipping available",
      color: "from-yellow-400 to-orange-500",
      delay: "0ms",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Award-winning design & materials",
      color: "from-purple-400 to-pink-500",
      delay: "100ms",
    },
    {
      icon: Recycle,
      title: "100% Sustainable",
      description: "Carbon-neutral production",
      color: "from-green-400 to-emerald-500",
      delay: "200ms",
    },
    {
      icon: Users,
      title: "50K+ Happy Customers",
      description: "Join our growing community",
      color: "from-blue-400 to-cyan-500",
      delay: "300ms",
    },
  ]

  const nextSlide = useCallback(() => {
    setSlideDirection("next")
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setSlideDirection("prev")
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setSlideDirection(index > currentSlide ? "next" : "prev")
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, isAutoPlaying])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const getTextAlignment = (position: string) => {
    switch (position) {
      case "left":
        return "text-left items-start"
      case "right":
        return "text-right items-end"
      case "center":
        return "text-center items-center"
      default:
        return "text-left items-start"
    }
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Floating Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-emerald-200/20 rounded-full blur-xl animate-float-slow"></div>
      </div>

      {/* Carousel */}
      <div
        className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : slideDirection === "next"
                ? index < currentSlide
                  ? "opacity-0 scale-95 -translate-x-full"
                  : "opacity-0 scale-95 translate-x-full"
                : index > currentSlide
                ? "opacity-0 scale-95 translate-x-full"
                : "opacity-0 scale-95 -translate-x-full"
            }`}
          >
            {/* Slide content */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.headline}
                className="w-full h-full object-cover "
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} opacity-80`} />
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className={`max-w-3xl flex flex-col ${getTextAlignment(slide.textPosition)}`}>
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6 animate-slideInUp">
                    <Star className="w-4 h-4 mr-2" />
                    {slide.badge}
                  </div>

                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slideInUp animation-delay-200">
                    {slide.headline}
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl animate-slideInUp animation-delay-400">
                    {slide.subtext}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 animate-slideInUp animation-delay-600">
                    <a
                      href={slide.ctaLink}
                      className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                      {slide.ctaText}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>

                 
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-300 ${
                index === currentSlide
                  ? "w-12 h-3 bg-white rounded-full"
                  : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/75 hover:scale-125"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              transition: isAutoPlaying ? "width 5s linear" : "width 0.3s ease",
            }}
          />
        </div>
      </div>
 
       <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          animation-delay: 4s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}

export default HeroSection


