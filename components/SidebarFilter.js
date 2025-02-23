"use client";

import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { FaCheck, FaFilter } from "react-icons/fa";

const SidebarFilter = ({ isOpen, onClose, onApply, filterOptions = {
  priceRange: { min: 0, max: 100 },
  colors: [],
  categories: [],
} }) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [colors, setColors] = useState([]);
  const [category, setCategory] = useState([]);

  const formatCategoryLabel = (category) => {
    return category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace("hoodies", " Hoodies")
      .replace("tshirts", "T-Shirts");
  };

  const handleApply = () => {
    onApply({ priceRange, colors, category });
    onClose();
  };

  return (
    <>
      {/* Overlay with Fade Animation */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}

      {/* Sidebar with Slide Animation */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-[#f3f3f3] shadow-2xl transform transition-transform duration-300 ease-in-out z-[777] ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button onClick={onClose} className="cursor-pointer">
              <CiCircleRemove className="hover:text-gray-600 text-2xl text-black" />
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Price Range ($)</label>
            <input
              type="range"
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer range-sm accent-gray-800 transition-all duration-200 ease-in-out"
            />
            <p className="text-sm text-gray-600 mt-2 transition-all duration-200 ease-in-out">
              ${priceRange[0]} - ${priceRange[1]}
            </p>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
            <div className="grid grid-cols-2 gap-3">
              {filterOptions.colors.map((color) => (
                <label
                  key={color}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={colors.includes(color)}
                      onChange={() =>
                        setColors((prev) =>
                          prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
                        )
                      }
                      className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-devstyle checked:border-transparent focus:outline-none focus:ring-2 focus:ring-devstyle transition duration-150 ease-in-out"
                    />
                    {colors.includes(color) && (
                      <FaCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {filterOptions.categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={category.includes(cat)}
                      onChange={() =>
                        setCategory((prev) =>
                          prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                        )
                      }
                      className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-devstyle checked:border-transparent focus:outline-none focus:ring-2 focus:ring-devstyle transition duration-150 ease-in-out"
                    />
                    {category.includes(cat) && (
                      <FaCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{formatCategoryLabel(cat)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-auto space-y-4">
            <button
              onClick={handleApply}
              className="w-full bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <FaFilter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarFilter;