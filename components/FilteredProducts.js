// "use client";

// import { useState } from "react";
// import SidebarFilter from "./SidebarFilter";
// import Image from "next/image";
// import CustomLink from "./CustomLink";

// const FilteredProducts = ({ products = [] }) => { // Ensure 'products' is always an array
//     const [filters, setFilters] = useState({});
//     const [isFilterOpen, setIsFilterOpen] = useState(false);

//     const applyFilters = (newFilters = {}) => { // Ensure newFilters is an object
//         setFilters(newFilters);
//         setIsFilterOpen(false);
//     };

//     const filteredProducts = (products || []).filter(product => { // Ensure it's an array
//         const { colors = [], priceRange = [0, Infinity], theme = [] } = filters;

//         // Price Filter
//         if (priceRange.length && (product.price < priceRange[0] || product.price > priceRange[1])) {
//             return false;
//         }

//         // Color Filter
//         if (colors.length && !colors.includes(product.color)) {
//             return false;
//         }

//         // Theme Filter
//         if (theme.length && !theme.includes(product.theme)) {
//             return false;
//         }

//         return true;
//     });

//     return (
//         <section className="text-gray-600 body-font">
//             {/* Open Filters Button */}
//             <button
//                 onClick={() => setIsFilterOpen(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
//             >
//                 Open Filters
//             </button>

//             {/* Sidebar Filter Component */}
//             <SidebarFilter 
//                 isOpen={isFilterOpen} 
//                 onClose={() => setIsFilterOpen(false)} 
//                 onApply={applyFilters} 
//             />

//             {/* Product Grid */}
//             <div className="flex flex-wrap -m-4 mt-5">
//                 {filteredProducts.length > 0 ? ( // ✅ Safe access
//                     filteredProducts.map((item) => (
//                         <div key={item.id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
//                             <CustomLink href={`/product/${item.slug}`} className="block rounded-lg shadow-md hover:shadow-lg transition-shadow duration-100 p-6">
//                                 <Image src={item.image} alt={item.name} width={200} height={200} className="h-[30vh] md:h-[40vh] m-auto block hover:scale-110" />
//                                 <div className="mt-4 text-center">
//                                     <h2 className="text-gray-900 text-lg font-medium truncate w-full">{item.name}</h2>
//                                     <p className="mt-1">${item.price.toFixed(2)}</p>
//                                 </div>
//                             </CustomLink>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-center w-full text-gray-500 mt-10">No products match your filters.</p>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default FilteredProducts;
