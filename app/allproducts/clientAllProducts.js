"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SidebarFilter from "../../components/SidebarFilter";
import CustomLink from "../../components/CustomLink";
import { AiOutlineFilter } from "react-icons/ai";

const ClientAllProducts = ({ products = [] }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [filters, setFilters] = useState({ priceRange: [0, 100], colors: [], category: [] });

    useEffect(() => {
        if (!products || products.length === 0) return;

        let filtered = products.filter((product) => {
            const matchesPrice = product.discountedPrice >= filters.priceRange[0] && product.discountedPrice <= filters.priceRange[1];
            const productCategories = Array.isArray(product.category)
                ? product.category.map(cat => cat.toLowerCase().trim())
                : [product.category.toLowerCase().trim()];
            const selectedCategories = filters.category || [];
            const matchesCategory = selectedCategories.length === 0
                ? true
                : productCategories.some(cat => selectedCategories.includes(cat));
            const productColors = Array.isArray(product.colors) ? product.colors.map(c => c.toLowerCase().trim()) : [];
            const selectedColors = Array.isArray(filters.colors) ? filters.colors.map(c => c.toLowerCase().trim()) : [];
            const matchesColor = selectedColors.length === 0 || productColors.some(color => selectedColors.includes(color));

            return matchesPrice && matchesCategory && matchesColor;
        });

        setFilteredProducts(filtered);
    }, [filters, products]);

    const handleApplyFilters = (filters) => {
        console.log("Applied Filters:", filters);
        setIsSidebarOpen(false);
      };
    

    return (
        <section className="text-gray-600 body-font">

            {/* Products Section */}
            <div className="container px-9 py-20 mx-auto">
                <h2 className="text-xl mt-9 md:mt-6 md:text-4xl font-extrabold text-gray-900 text-center tracking-wide uppercase">
                    <span className="text-[#C85C3D] font-bold md:text-4xl tracking-wide uppercase">
                        HOT DEALS: <span className="text-[#F4A261]">DISCOUNTS YOU CAN'T MISS!</span>
                    </span>
                </h2>

                {/* Filter Button */}
                <button className="flex items-center bg-gray-700 text-white px-3 py-2 gap-2 text-sm rounded-md hover:bg-devstyle transition-all duration-200 mt-2" onClick={() => setIsFilterOpen(true)}>
                <AiOutlineFilter className="h-4 w-4" /> {/* Filter Icon */}
                    Open Filters
                </button>

                {/* Sidebar Filter */}
                <SidebarFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={setFilters} />
                {/* Product Grid */}
                <div className="flex flex-wrap -m-4 mt-5 ">
                    {filteredProducts.length ? (
                        filteredProducts.map((item) => (
                            <div key={item._id} className="lg:w-1/4 md:w-1/2 p-2 w-full">
                                <CustomLink href={`/product/${item.slug}`} className="block rounded-lg shadow-md hover:shadow-lg transition-shadow duration-100 p-6 overflow-visible">
                                    <Image
                                        className="mix-blend-multiply h-[25vh] md:h-[41vh] m-auto block transform transition duration-300 ease-out hover:scale-110 hover:translate-y-2 origin-center"
                                        src={item.image}
                                        alt={item.title}
                                        width={200}
                                        height={200}
                                        priority
                                    />

                                    <div className="mt-4 text-center md:text-left">
                                        <h3 className="text-gray-500 text-xs tracking-widest capitalize title-font mb-1">{item.category}</h3>
                                        <h2 className="text-gray-900 text-lg font-medium truncate w-full">{item.title}</h2>

                                        {/* Render sizes */}
                                        {item.sizes.length > 0 && (
                                            <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                                                {item.sizes.map((size, index) => (
                                                    <span key={index} className="border border-gray-400 px-2 py-1 text-xs rounded-md">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Render colors */}
                                        {item.colors.length > 0 && (
                                            <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                                                {item.colors.map((color, index) => (
                                                    <span
                                                        key={index}
                                                        className="w-4 h-4 rounded-full border outline-none mt-1 border-gray-200"
                                                        style={{ backgroundColor: color.toLowerCase() }}
                                                    ></span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Price Display with Discount */}
                                        {item.discount > 0 ? (
                                            <div className="mt-1 text-center md:text-left">
                                                <span className="text-gray-500 text-sm line-through mr-2">${item.price.toFixed(2)}</span>
                                                <span className="text-red-600 text-lg font-bold">${item.discountedPrice}</span>
                                                <span className="text-green-600 text-sm ml-2">-{item.discount}%</span>
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

export default ClientAllProducts;
