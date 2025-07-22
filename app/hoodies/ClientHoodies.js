"use client";

import Image from "next/image";
import SidebarFilter from "../../components/SidebarFilter";
import CustomLink from "../../components/CustomLink";
import { AiOutlineFilter } from "react-icons/ai";
import { useFilter } from "../context/FilterContext";
import { motion } from "framer-motion";

const FilteredHoodies = ({ hoodies = [] }) => {
    const { setFilters, useFilterLogic, setIsFilterOpen, isFilterOpen } = useFilter();
    const filteredHoodies = useFilterLogic(hoodies);

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

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-9 py-20 mx-auto">
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
                        Drip
                    </motion.span>{" "}
                    <motion.span variants={childVariants}>Starts Here –</motion.span>
                    <br className="hidden md:block" />
                    <motion.span className="block mt-2 md:mt-1" variants={childVariants}>
                        Premium Hoodies for Every{" "}
                        <motion.span
                            className="text-[#C85C3D] font-semibold cursor-pointer"
                            variants={accentVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Vibe
                        </motion.span>
                        !
                    </motion.span>
                </motion.h2>
                <button
                    className="flex items-center bg-gray-700 text-white px-3 py-2 gap-2 text-sm rounded-md hover:bg-devstyle transition-all duration-200 mt-2"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <AiOutlineFilter className="h-4 w-4" />
                    Open Filters
                </button>
                <SidebarFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={setFilters}
                    filterOptions={{
                        priceRange: { min: 0, max: 100 },
                        colors: [
                            "Black",
                            "White",
                            "Red",
                            "Navy",
                            "Royal Blue",
                            "Sky Blue",
                            "Gray",
                            "Yellow",
                            "Pink",
                            "Hot Pink",
                            "Silver",
                            "Gainsboro",
                            "Green",
                            "Purple",
                            "Forest Green",
                            "Orange",
                            "Brown",
                        ],
                        categories: ["coding hoodies", "stylish hoodies"],
                    }}
                />
                <div className="flex flex-wrap -m-4 mt-5">
                    {filteredHoodies.length ? (
                        filteredHoodies.map((item) => (
                            <div key={item._id} className="lg:w-1/4 md:w-1/2 p-2 w-full">
                                <CustomLink
                                    href={`/product/${item.slug}`}
                                    className="block rounded-lg shadow-md hover:shadow-lg transition-shadow duration-100 p-6 overflow-visible"
                                >
                                    <div className="relative h-[25vh] md:h-[45vh] flex items-center justify-center overflow-visible group">
                                        <Image
                                            className="mix-blend-multiply w-full h-full object-contain transform transition duration-300 ease-out group-hover:scale-110 origin-center"
                                            src={item.image}
                                            alt={item.title}
                                            width={200}
                                            height={200}
                                            priority
                                        />
                                    </div>
                                    <div className="mt-4 text-center md:text-left">
                                        <h2 className="text-gray-500 text-xs tracking-widest capitalize title-font mb-1">
                                        Hoodies
                                        </h2>
                                        <h3 className="text-gray-900 text-base h-12 font-semibold line-clamp-2 w-full">
                                            {item.title}
                                        </h3>
                                        {item.sizes.length > 0 && (
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
                                        {item.colors.length > 0 && (
                                            <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                                                {item.colors.map((color, index) => {
                                                    const formattedColor = color.trim().replace(/\s+/g, "").toLowerCase();
                                                    return (
                                                        <span
                                                            key={index}
                                                            className="w-4 h-4 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 shadow-sm"
                                                            style={{ backgroundColor: formattedColor }}
                                                        ></span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {item.discount > 0 ? (
                                            <div className="mt-1 text-center md:text-left">
                                                <span className="text-gray-500 text-sm line-through mr-2">
                                                    ${item.price.toFixed(2)}
                                                </span>
                                                <span className="text-red-600 text-lg font-bold">
                                                    ${item.discountedPrice}
                                                </span>
                                                <span className="text-green-600 text-sm ml-2">
                                                    -{item.discount}%
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="mt-1">${item.price.toFixed(2)}</p>
                                        )}
                                    </div>
                                </CustomLink>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No products match your filters.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FilteredHoodies;