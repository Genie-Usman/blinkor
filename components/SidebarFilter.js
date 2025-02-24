"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CiCircleRemove } from "react-icons/ci";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useFilter } from "../app/context/FilterContext";

const SidebarFilter = ({
  isOpen,
  onClose,
  onApply,
  filterOptions = {
    priceRange: { min: 0, max: 100 },
    colors: [],
    categories: [],
  }
}) => {
  const pathname = usePathname()
  const { filters, setFilters } = useFilter()

  useEffect(() => {
    setFilters({
      priceRange: [0, 100],
      colors: [],
      category: [],
    });
  }, [pathname])

  // const handleApply = () => {
  //   onApply(filters); // Ensure the latest filters are sent
  //   onClose();
  // };

  const toggleColor = (color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleCategory = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range ($)
            </label>
            <input
              type="range"
              min={filterOptions.priceRange.min}
              max={filterOptions.priceRange.max}
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full h-1.5 bg-gray-200 rounded-full cursor-pointer appearance-none transition-all duration-200 ease-in-out"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #E0AFA0 ${((filters.priceRange[1] - filterOptions.priceRange.min) / (filterOptions.priceRange.max - filterOptions.priceRange.min) * 100)}%, #e5e7eb ${((filters.priceRange[1] - filterOptions.priceRange.min) / (filterOptions.priceRange.max - filterOptions.priceRange.min) * 100)}%, #e5e7eb 100%)`,
              }}
            />
            <p className="text-sm text-gray-600 mt-2 transition-all duration-200 ease-in-out">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </p>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              {filterOptions.colors.map((color) => (
                <label
                  key={color}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-black checked:border-transparent focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
                    />
                    {filters.colors.includes(color) && (
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="flex flex-col capitalize">
              {filterOptions.categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-black checked:border-transparent focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
                    />
                    {filters.category.includes(cat) && (
                      <FaCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-auto space-y-4">
            <button
              onClick={onClose} // Change the handler to a close function
              className="w-full bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaTimes className="h-4 w-4" /> {/* Replace FaFilter with FaTimes (close icon) */}
              <span>Close</span> {/* Change the text to "Close" */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarFilter;
