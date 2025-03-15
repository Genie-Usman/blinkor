'use client'
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-48 md:h-64"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-indigo-500"
      ></motion.div>
    </motion.div>
  );
};
