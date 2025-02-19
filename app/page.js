"use client"; // Force this component to run on the client-side

import React, { useState } from "react";
import Image from "next/image";
import Slider from "../components/Slider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const handleClick = (path, setLoading) => {
    setLoading(true);
    router.push(path);
  };
  const products = [
    { title: "Premium T-Shirts", description: "Soft, stylish, and comfortable.", image: "/tshirt.jpg", path: "/tshirts" },
    { title: "Stylish Hoodies", description: "Perfect for every season.", image: "/hoodie.jpg", path: "/hoodies" },
    { title: "Trendy Caps", description: "Complete your look with our caps.", image: "/cap.jpg", path: "/caps" },
  ];
  return (
    <>
      <Slider />
      <div className="w-full rotate-[3deg] mt-20">
        <div className="relative w-full overflow-hidden bg-black py-3">
          <motion.div
            className="flex w-max space-x-8 font-bold text-white text-3xl uppercase tracking-wide"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-8">
                <span>CODE BLINK STYLE</span>
                <span>CODE YOUR FUTURE</span>
                <span>BLINK INTO FASHION</span>
                <span>STYLE REDEFINED</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(({ title, description, image, path }) => {
              const [loading, setLoading] = useState(false);

              return (
                <div key={path} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                  <Image src={image} alt={title} width={400} height={300} className="w-full" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-gray-600 mt-2">{description}</p>

                    <button
                      onClick={() => handleClick(path, setLoading)}
                      disabled={loading}
                      className={`mt-4 px-4 py-2 flex items-center justify-center gap-2 bg-black text-white rounded-full hover:bg-gray-800 transition duration-300 ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                      {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Shop Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>
    </>
  );
}
