import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/wellness.png',
    title: 'Ancient Wisdom for Modern Wellness',
    subtitle: 'Discover authentic Ayurvedic formulations crafted with pure, organic ingredients',
    cta: 'Shop Now',
    link: '/shop',
    align: 'left',
  },
  {
    image: 'https://images.squarespace-cdn.com/content/v1/61c4da8eb1b30a201b9669f2/681f20cb-1f43-4686-960e-173cb33bacc8/Natural-Resilience-2.jpg',
    title: 'Natural Strength & Vitality',
    subtitle: 'Premium supplements for enhanced vigor and holistic wellbeing',
    cta: 'Explore Products',
    link: '/shop',
    align: 'left',
  },
  {
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Pure Ingredients, Powerful Results',
    subtitle: 'Handcrafted in small batches using time-honored Ayurvedic methods',
    cta: 'Know More',
    link: '/about',
    align: 'left',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrent(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleArrowClick = (direction) => {
    setIsAutoPlaying(false);
    if (direction === 'next') nextSlide();
    else prevSlide();
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(400px, 60vh, 650px)' }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full no-repeat min-w-full min-h-full object-center transition-transform duration-700 ease-in-out transform scale-100 hover:scale-110 object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center section-padding">
            <div className={`max-w-xl animate-slide-up ${slide.align === 'left' ? '' : 'ml-auto text-right'}`}>
              <span className="inline-block bg-secondary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Divyam Ayurveda
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-primary-dark transition-all duration-300 hover:shadow-lg group"
              >
                {slide.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={() => handleArrowClick('prev')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleArrowClick('next')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${index === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </section>
  );
}
