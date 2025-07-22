"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon, Loader2 } from "lucide-react";
import Image from "next/image";

// const slides = [
//   {
//     id: 1,
//     title: "LATEST ARRIVALS",
//     subtitle: "MINIONS COLLECTION",
//     button: "MAYHEM AWAITS!",
//     image: "/banner-1.png",
//     link: "/minionscollection",
//   },
//   {
//     id: 2,
//     title: "EXCLUSIVE SITEWIDE SALE",
//     subtitle: "LIMITED-TIME DEALS ON ALL PRODUCTS",
//     button: "SHOP NOW",
//     image: "/banner-2.png",
//     link: "/allproducts",
//   },
// ];

const slides = ["/banner-1.png", "/banner-2.png"]

const Slider = () => {
  const [index, setIndex] = useState(0);
  // const [loadingStates, setLoadingStates] = useState({});

  const nextSlide = () => setIndex(prevSlide => (prevSlide - 1 + slides.length ) % slides.length)
  const prevSlide = () => setIndex(prevSlide => (prevSlide + 1 ) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  // const handleButtonClick = (link, slideId) => {
  //   setLoadingStates((prev) => ({ ...prev, [slideId]: true }));
  //   setTimeout(() => {
  //     window.location.href = link;
  //   }, 1000);
  // };

  return (
    // <div className="relative w-full h-[200px] sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[600px] mt-14 md:mt-14 overflow-hidden">

    //   <AnimatePresence mode="wait">
    //     <motion.div
    //       key={slides[index].id}
    //       className="absolute inset-0 flex items-center justify-center bg-gray-100"
    //       initial={{ opacity: 0, x: 50 }}
    //       animate={{ opacity: 1, x: 0 }}
    //       exit={{ opacity: 0, x: -50 }}
    //       transition={{ duration: 0.5 }}
    //     >
    //       <div className="absolute inset-0 bg-black/30"></div>

    //       {/* Text Content */}
    //       <div className="absolute top-1/2 -translate-y-1/2 left-14 sm:left-16 md:left-20 lg:left-24 xl:left-32 z-10 text-white text-center sm:text-left max-w-xs sm:max-w-sm md:max-w-md">

    //         <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">
    //           {slides[index].title}
    //         </h2>
    //         <p className="text-xs sm:text-sm md:text-lg mt-1 sm:mt-2">
    //           {slides[index].subtitle}
    //         </p>
    //         <button
    //           onClick={() => handleButtonClick(slides[index].link, slides[index].id)}
    //           disabled={loadingStates[slides[index].id]}
    //           className="mt-2 sm:mt-4 px-3 sm:px-6 py-1 sm:py-2 bg-white text-black text-xs sm:text-base font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
    //         >
    //           {loadingStates[slides[index].id] ? (
    //             <>
    //               <Loader2 className="animate-spin w-4 h-4" />
    //               Loading...
    //             </>
    //           ) : (
    //             slides[index].button
    //           )}
    //         </button>
    //       </div>

    //       {/* Image */}
    //       <Image
    //         src={slides[index].image}
    //         alt={slides[index].title}
    //         className="w-full h-full object-cover object-center"
    //         height={800}
    //         width={800}
    //       />
    //     </motion.div>
    //   </AnimatePresence>

    //   {/* Previous Button */}
    //   <button
    //     onClick={prevSlide}
    //     className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-black/50 p-2 sm:p-3 lg:p-4 rounded-full text-white hover:bg-black/80 transition"
    //   >
    //     <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
    //   </button>

    //   {/* Next Button */}
    //   <button
    //     onClick={nextSlide}
    //     className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-black/50 p-2 sm:p-3 lg:p-4 rounded-full text-white hover:bg-black/80 transition"
    //   >
    //     <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
    //   </button>

    //   {/* Dots Indicator */}
    //   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
    //     {slides.map((_, i) => (
    //       <button
    //         key={i}
    //         onClick={() => setIndex(i)}
    //         className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full ${
    //           index === i ? "bg-white" : "bg-gray-400"
    //         }`}
    //       />
    //     ))}
    //   </div>
    // </div>
    <div className="relative w-full h-[200px] xs:h-[300px] sm:h-[450px] md:h-[500px] xl:h-[600px] 2xl:h-[700px] 3xl:h-[950px] overflow-hidden mt-14 md:mt-12">
  {
    slides.map((slide, i) => (
      <img
        src={slide}
        key={i}
        alt=""
        className={`${i === index ? "opacity-100" : "opacity-0"} absolute inset-0 w-full h-full object-cover transition-opacity duration-1000`}
      />
    ))
  }

  {/* Previous Button */}
  <button
    className="absolute top-1/2 left-2 xs:left-3 sm:left-4 transform -translate-y-1/2 bg-white/70 p-1.5 xs:p-2 sm:p-3 lg:p-4 rounded hover:bg-black/80 hover:text-white transition"
    onClick={nextSlide}
  >
    <ChevronLeftIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
  </button>

  {/* Next Button */}
  <button
    className="absolute top-1/2 right-2 xs:right-3 sm:right-4 transform -translate-y-1/2 bg-white/70 p-1.5 xs:p-2 sm:p-3 lg:p-4 rounded hover:bg-black/80 hover:text-white transition"
    onClick={prevSlide}
  >
    <ChevronRightIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
  </button>
</div>

  );
}

export default Slider