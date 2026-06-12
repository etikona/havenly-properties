"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Engr. Anwar Hossain",
    title: "Software Engineer, Dhaka",
    quote:
      "The entire buying process was transparent and stress-free. The team kept us updated at every stage of construction. We moved into our 3-bedroom unit on the exact promised date!",
    project: "Skyline Residences, Gulshan",
    rating: 5,
  },
  {
    name: "Nasima Begum",
    title: "Retired Teacher, Chittagong",
    quote:
      "As a landowner, I was nervous about joint ventures. But their professional approach, clear agreements, and timely delivery won my complete trust. I received my units as promised.",
    project: "Green Valley Tower, Bashundhara",
    rating: 5,
  },
  {
    name: "Md. Karim & Family",
    title: "Business Owner, Sylhet",
    quote:
      "Quality of construction is exceptional. Two years after moving in and everything is still perfect. Their after-sales service team is always responsive.",
    project: "Horizon Heights, Dhanmondi",
    rating: 5,
  },
  {
    name: "Dr. Farhana Islam",
    title: "Physician, Dhaka",
    quote:
      "I did thorough research before buying. This company's RAJUK compliance and transparent pricing gave me full confidence. The apartment exceeded my expectations.",
    project: "Pearl Residences, Gulshan 1",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400 fill-amber-400"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-20 bg-amber-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/30 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-amber-700/30 translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-amber-200 text-sm font-semibold uppercase tracking-widest mb-3">
          Client Stories
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
          What Our Homeowners Say
        </h2>

        <div className="relative">
          {/* Quote icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Quote className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center mb-5">
            <StarRating count={t.rating} />
          </div>

          {/* Quote */}
          <blockquote className="text-white text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            {t.quote}
          </blockquote>

          {/* Author */}
          <div>
            <div className="font-bold text-white text-base">{t.name}</div>
            <div className="text-amber-200 text-sm mt-1">{t.title}</div>
            <div className="text-amber-300 text-xs mt-1 font-medium">
              {t.project}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70",
              )}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
