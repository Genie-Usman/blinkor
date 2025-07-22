"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { BsArrowRight } from "react-icons/bs";

const slides = [
  {
    id: 1,
    title: "Toon Up Your Style",
    subtitle: "Level up your look with exclusive cartoon tees made for comfort, creativity, and cool.",
    button: "MAYHEM AWAITS!",
    image: "/banner-1.png",
    link: "/tshirts",
    position: "left-center",
  },
  {
    id: 2,
    title: "Sitewide Mega Sale – Limited Time Only!",
    subtitle: "Unbeatable Deals on Every Product. Shop Before It's Gone!",
    button: "SHOP NOW",
    image: "/banner-2.png",
    link: "/allproducts",
    position: "top-right",
  },
];

const positionClasses = {
  "top-left": "top-4 left-4",
  "top-right": "top-14 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "left-center": "top-1/2 left-28 -translate-y-1/2",
  "right-center": "top-1/2 right-1/4 -translate-y-1/2",
  "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const Slider = () => {
  const [index, setIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState({});

  const nextSlide = () => setIndex(prev => (prev + 1) % slides.length);
  const prevSlide = () => setIndex(prev => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (link, slideId) => {
    setLoadingStates((prev) => ({ ...prev, [slideId]: true }));
    setTimeout(() => {
      window.location.href = link;
    }, 1000);
  };

  return (
    <div className="relative w-full h-[200px] xs:h-[300px] sm:h-[450px] md:h-[500px] xl:h-[600px] 2xl:h-[700px] 3xl:h-[950px] overflow-hidden mt-14 md:mt-12">
      {slides.map((slide, i) => (
        <div key={slide.id}>
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100 z-0" : "opacity-0 z-0"}`}
          />

          {/* Slide Content */}
          {i === index && (
            <div
              className={`absolute z-10 ${positionClasses[slide.position] || 'bottom-left'} transition-all duration-500 md:flex flex-col hidden`}
            >
              <div className="inline-block px-4 py-2 bg-black/30 backdrop-blur-sm shadow-md max-w-full border-white border">
                <h2 className="text-shadow text-white font-extrabold tracking-wide text-base md:text-3xl lg:text-4xl leading-tight">
                  {slide.title}
                </h2>
                <p className="text-shadow text-white font-medium text-xs sm:text-sm md:text-lg mt-1 sm:mt-2 leading-snug">
                  {slide.subtitle}
                </p>
              </div>

              <button
                className="mt-5 self-start inline-flex items-center border bg-black/75 md:bg-black/25 border-white text-white hover:text-white disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-2 uppercase tracking-widest text-sm md:text-base font-semibold relative group overflow-hidden w-auto"
                onClick={() => handleButtonClick(slide.link, slide.id)}
                disabled={loadingStates[slide.id]}
              >
                <span className="relative z-10 flex items-center whitespace-nowrap">
                  {loadingStates[slide.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      {slide.button}
                      <BsArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </span>

                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 origin-bottom-left transition-transform duration-300 ease-out" />
              </button>

            </div>
          )}
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-2 xs:left-3 sm:left-4 transform -translate-y-1/2 bg-white/70 p-2 rounded hover:bg-black/80 hover:text-white transition z-20"
        onClick={prevSlide}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <button
        className="absolute top-1/2 right-2 xs:right-3 sm:right-4 transform -translate-y-1/2 bg-white/70 p-2 rounded hover:bg-black/80 hover:text-white transition z-20"
        onClick={nextSlide}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Slider;