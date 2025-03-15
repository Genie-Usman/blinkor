"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ProductPerformance = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/most-sold");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#f6f2f0]/80 shadow-md w-full border border-gray-900 py-6 px-4"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Top Sellers
      </h2>

      {loading ? (
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
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-40"
        >
          <p className="text-red-500 text-center">Error loading products.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-x-auto"
        >
          <div className=" border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white text-left text-sm uppercase">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">Product Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <td className="p-4 text-sm text-gray-700">{product._id}</td>
                    <td className="p-4 text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                      {product.title}
                    </td>
                    <td className="p-4 text-sm text-gray-700 capitalize">{product.category}</td>
                    <td className="p-4 text-sm text-gray-700">${product.price.toFixed(2)}</td>
                    <td className="p-4 text-sm text-gray-700">{product.discount}%</td>
                    <td className="p-4 text-sm text-gray-700 font-semibold">
                      {product.variants[0]?.totalSold || 0}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductPerformance;
