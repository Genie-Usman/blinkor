"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "LATEST ARRIVALS",
    subtitle: "MINIONS COLLECTION",
    button: "MAYHEM AWAITS!",
    image: "./banner-1.png",
    link: "/minionscollection",
  },
  {
    id: 2,
    title: "EXCLUSIVE SITEWIDE SALE",
    subtitle: "LIMITED-TIME DEALS ON ALL PRODUCTS",
    button: "SHOP NOW",
    image: "./banner-2.png",
    link: "/allproducts",
  },
  {
    id: 3,
    title: "NEW SEASON",
    subtitle: "KIDS COLLECTION",
    button: "DISCOVER",
    image: "./banner-3.png",
    link: "/cartooncollection",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each slide

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (link, slideId) => {
    setLoadingStates((prev) => ({ ...prev, [slideId]: true })); // Set loading state for the specific slide
    setTimeout(() => {
      window.location.href = link; // Simulate navigation
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] mt-14 overflow-hidden">
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
          <div className="absolute left-5 sm:left-10 md:left-20 z-10 text-white text-center sm:text-left">
            {/* Title */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold">
              {slides[index].title}
            </h2>
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
              {slides[index].subtitle}
            </p>
            {/* Button */}
            <button
              onClick={() => handleButtonClick(slides[index].link, slides[index].id)}
              disabled={loadingStates[slides[index].id]} // Disable only the clicked button
              className="mt-2 sm:mt-4 px-3 sm:px-6 py-1 sm:py-2 bg-white text-black text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loadingStates[slides[index].id] ? ( // Show loader only for the clicked button
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> {/* Loader */}
                  Loading...
                </>
              ) : (
                slides[index].button
              )}
            </button>
          </div>
          {/* Image */}
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="w-full h-full object-cover object-center" // Cover the entire slider and center the image
          />
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 p-1 sm:p-2 rounded-full text-white hover:bg-black/80 transition"
      >
        <ChevronLeft size={20} className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 p-1 sm:p-2 rounded-full text-white hover:bg-black/80 transition"
      >
        <ChevronRight size={20} className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === i ? "bg-white" : "bg-gray-400"
              }`}
          />
        ))}
      </div>
    </div>
  );
}