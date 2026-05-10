'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=80',
    tag: 'New Launch — Gulshan 2',
    headline: 'Where Luxury\nMeets Legacy',
    sub: 'Discover premium residences crafted for those who expect more from life in Bangladesh.',
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80',
    tag: 'Ongoing — Bashundhara',
    headline: 'Build Your\nDream Home',
    sub: 'Modern apartments with world-class amenities, designed for Bangladeshi families.',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80',
    tag: 'Completed — Dhanmondi',
    headline: 'Trusted by\n950+ Families',
    sub: 'Two decades of delivering quality homes on time, with full transparency.',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">

      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            i === current ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            {/* Tag */}
            <div className={cn(
              'inline-flex items-center gap-2 mb-6 transition-all duration-500',
              animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 text-sm font-medium tracking-wide">{slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className={cn(
              'text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 transition-all duration-500 delay-75',
              animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}>
              {slide.headline.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span className="text-amber-400">{line}</span> : line}
                </span>
              ))}
            </h1>

            {/* Sub */}
            <p className={cn(
              'text-lg text-white/70 leading-relaxed mb-10 max-w-lg transition-all duration-500 delay-150',
              animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}>
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className={cn(
              'flex flex-wrap items-center gap-4 transition-all duration-500 delay-200',
              animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-md transition-all hover:shadow-lg hover:shadow-amber-600/25 hover:-translate-y-0.5"
              >
                Explore Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 hover:border-white/60 text-white font-medium rounded-md transition-all hover:bg-white/10 backdrop-blur-sm"
              >
                <Play className="w-4 h-4" />
                Watch Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current ? 'w-8 h-2 bg-amber-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
