"use client";

import Image from "next/image";
import SidebarFilter from "../../components/SidebarFilter";
import CustomLink from "../../components/CustomLink";
import { AiOutlineFilter } from "react-icons/ai";
import { useFilter } from "../context/FilterContext";

const FilteredHoodies = ({ hoodies = [] }) => {
    const { setFilters, useFilterLogic, setIsFilterOpen, isFilterOpen } = useFilter();
    const filteredHoodies = useFilterLogic(hoodies);

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-9 py-20 mx-auto">
                <h2 className="text-xl mt-9 md:mt-6 md:text-4xl font-extrabold text-gray-900 text-center tracking-wide uppercase">
                <span className="text-[#C85C3D]">Drip</span> Starts Here – <br /> Premium Hoodies for Every <span className="text-[#C85C3D]">Vibe</span>!
                </h2>
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
                            "Red",
                            "Navy",
                            "RoyalBlue",
                            "SkyBlue",
                            "Gray",
                            "Yellow",
                            "Pink",
                            "HotPink",
                            "Silver",
                            "Gainsboro",
                            "Green",
                            "Purple",
                            "ForestGreen",
                            "Orange",
                            "Brown",
                        ],
                        categories: ["hoodies", "stylishhoodies"],
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
                                        <h3 className="text-gray-500 text-xs tracking-widest capitalize title-font mb-1">
                                        Hoodies
                                        </h3>
                                        <h2 className="text-gray-900 text-lg font-medium truncate w-full">
                                            {item.title}
                                        </h2>
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