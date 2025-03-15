"use client";

import React from "react";
import Slider from "../components/Slider";
import { motion } from "framer-motion";


export default function Home() {
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
                <span>DRIP BLINK STYLE</span>
                <span>ELEVATE YOUR DRIP</span>
                <span>BLINK INTO FASHION</span>
                <span>STYLE REDEFINED</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
