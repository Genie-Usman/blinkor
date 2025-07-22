"use client";

import Image from "next/image";
import CustomLink from "./CustomLink";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const childVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", damping: 12, stiffness: 100, duration: 0.6 },
    },
};

const accentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", damping: 10, stiffness: 150, duration: 0.8 },
    },
    hover: {
        scale: 1.1,
        color: "#E74C3C",
        textShadow: "0 0 10px rgba(232, 76, 60, 0.7)",
        transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.9 },
};

const ClientRecommendedProducts = ({ recommendedProducts = [] }) => {
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-9 py-8 md:py-20 mx-auto">
                <motion.h2
                    className="text-2xl mt-4 md:mt-8 mb-8 md:text-5xl font-bold text-gray-900 text-center tracking-tight uppercase leading-tight"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.span
                        className="text-[#C85C3D] font-semibold cursor-pointer"
                        variants={accentVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Exclusive
                    </motion.span>
                    <motion.span variants={childVariants}> Drops – </motion.span>
                    <motion.span variants={childVariants}>
                        Limited{" "}
                        <motion.span
                            className="text-[#C85C3D] font-semibold cursor-pointer"
                            variants={accentVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Stock
                        </motion.span>
                        !
                    </motion.span>
                </motion.h2>

                <div className="flex flex-wrap -m-4 mt-5">
                    {recommendedProducts?.length > 0 ? (
                        recommendedProducts.map((item) => (
                            <div key={item._id} className="lg:w-1/4 md:w-1/2 p-2 w-full">
                                <CustomLink
                                    href={`/product/${item.slug}`}
                                    className="block rounded-md shadow-md hover:shadow-lg border-gray-400 transition-shadow duration-100 p-6 overflow-visible"
                                >
                                    <div className="relative h-[25vh] md:h-[45vh] flex items-center justify-center overflow-visible group">
                                        <Image
                                            className="mix-blend-multiply w-full h-full object-contain transform transition duration-300 ease-out group-hover:scale-110 origin-center"
                                            src={item.image}
                                            alt="Product Image"
                                            width={200}
                                            height={200}
                                            priority
                                        />
                                    </div>
                                    <div className="mt-4 text-center md:text-left">
                                        <h2 className="text-gray-500 text-xs tracking-widest capitalize title-font mb-1">
                                            {item.category || "Miscellaneous"}
                                        </h2>
                                        <h3 className="text-gray-900 text-base h-14 font-semibold line-clamp-2 w-full">
                                            {item.title}
                                        </h3>

                                        {item.sizes?.length > 0 && (
                                            <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                                                {item.sizes.map((size, index) => (
                                                    <span
                                                        key={index}
                                                        className="border border-gray-400 px-2 py-1 text-xs rounded-md"
                                                    >
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {item.colors?.length > 0 && (
                                            <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                                                {item.colors.map((color, index) => (
                                                    <span
                                                        key={index}
                                                        className="w-4 h-4 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 shadow-sm"
                                                        style={{ backgroundColor: color.toLowerCase() }}
                                                    ></span>
                                                ))}
                                            </div>
                                        )}

                                        {item.discount > 0 ? (
                                            <div className="mt-1 text-center md:text-left">
                                                <span className="text-gray-500 text-sm line-through mr-2">
                                                    ${Number(item.price ?? 0).toFixed(2)}
                                                </span>
                                                <span className="text-red-600 text-lg font-bold">
                                                    ${item.discountedPrice}
                                                </span>
                                                <span className="text-green-600 text-sm ml-2">
                                                    -{item.discount}%
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="mt-1">${Number(item.price ?? 0).toFixed(2)}</p>
                                        )}
                                    </div>
                                </CustomLink>
                            </div>

                        ))
                    ) : (
                        <div className="w-full flex justify-center items-center py-10">
                            <p className="text-gray-500 text-lg">No recommended products available.</p>
                        </div>
                    )}
                </div>
                <div className="mt-16 flex justify-center items-center">
                    <CustomLink
                        className="mt-5 self-start inline-flex items-center border bg-black border-white text-white hover:text-white disabled:bg-gray-500 disabled:cursor-not-allowed px-6 py-4 uppercase tracking-widest text-sm md:text-base font-semibold relative group overflow-hidden w-auto"
                        href="/allproducts"
                    >
                        <span className="relative z-10 flex items-center whitespace-nowrap"> <>
                                    See More Products
                                    <BsArrowRight className="w-4 h-4 ml-2" />
                                </>
                        </span>

                        {/* Underline animation */}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 origin-bottom-left transition-transform duration-300 ease-out" />
                    </CustomLink>
                </div>
            </div>
        </section>
    );
};

export default ClientRecommendedProducts;
