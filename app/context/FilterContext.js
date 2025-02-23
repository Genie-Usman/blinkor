"use client";

import { createContext, useContext, useState, useEffect } from "react";
const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    colors: [],
    category: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const useFilterLogic = (products) => {
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
      if (!products || products.length === 0) return;

      const filtered = products.filter((product) => {
        
        const matchesPrice =
          product.discountedPrice >= filters.priceRange[0] &&
          product.discountedPrice <= filters.priceRange[1];

        const productCategories = Array.isArray(product.category)
          ? product.category.map((cat) => cat.toLowerCase().trim())
          : [product.category.toLowerCase().trim()];
        const selectedCategories = filters.category || [];
        const matchesCategory =
          selectedCategories.length === 0 ||
          productCategories.some((cat) => selectedCategories.includes(cat));

        const productColors = Array.isArray(product.colors)
          ? product.colors.map((c) => c.toLowerCase().trim())
          : [];
        const selectedColors = Array.isArray(filters.colors)
          ? filters.colors.map((c) => c.toLowerCase().trim())
          : [];
        const matchesColor =
          selectedColors.length === 0 ||
          productColors.some((color) => selectedColors.includes(color));

        return matchesPrice && matchesCategory && matchesColor;
      });

      setFilteredProducts(filtered);
    }, [filters, products]);

    return filteredProducts;
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, useFilterLogic,isFilterOpen, setIsFilterOpen }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);