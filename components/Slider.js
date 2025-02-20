"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "LATEST ARRIVALS",
    subtitle: "MINIONS COLLECTION",
    button: "MAYHEM AWAITS!",
    image: "./banner-1.png",
    link: "/minionscollection"
  },
  {
    id: 2,
    title: "TRENDING NOW",
    subtitle: "WOMEN COLLECTION",
    button: "SHOP NOW",
    image: "./banner-2.png",
    link: "/cartooncollection"
  },
  {
    id: 3,
    title: "NEW SEASON",
    subtitle: "KIDS COLLECTION",
    button: "DISCOVER",
    image: "./banner-3.png",
    link: "/cartooncollection"
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] mt-14 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute left-20 z-10 text-white">
            <h2 className="text-3xl font-bold">{slides[index].title}</h2>
            <p className="text-lg">{slides[index].subtitle}</p>
            <Link href={slides[index].link}>
            <button  className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
              {slides[index].button}
            </button>
          </Link>
          </div>
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              index === i ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
