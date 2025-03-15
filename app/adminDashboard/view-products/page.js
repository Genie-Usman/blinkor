"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  "All",
  "coding tshirts",
  "minions tshirts",
  "coding hoodies",
  "stylish hoodies",
  "cartoon caps",
  "comic caps",
  "comic sips",
  "screen sips",
  "toon sips",
];

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getproducts", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(1);
    setVisibleProducts([]);
    setHasMore(true);
  }, [selectedCategory]);

  useEffect(() => {
    if (!loading) {
      const startIndex = (page - 1) * 5;
      const endIndex = startIndex + 5;
      const filtered = selectedCategory === "All"
        ? products
        : products.filter((product) => product.category === selectedCategory);
      const newProducts = filtered.slice(startIndex, endIndex);
      setVisibleProducts((prev) => (page === 1 ? newProducts : [...prev, ...newProducts]));
      setHasMore(newProducts.length > 0);
    }
  }, [page, selectedCategory, products, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (loading)
    return (
      <motion.div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"
        ></motion.div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div className="flex items-center justify-center h-screen">
        <p className="text-center text-red-500 text-lg font-semibold">
          Error: {error}
        </p>
      </motion.div>
    );

  return (
    <>
    <div className="bg-gray-900 px-6 py-4">
        <h2 className="text-2xl ml-[4.5rem] font-bold text-white">Product Inventory</h2>
      </div>
      <motion.div className="bg-gray-900 ml-6 px-6 py-4 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 capitalize rounded-md text-sm font-semibold transition-colors ${
              selectedCategory === category
                ? "bg-devstyle text-gray-50"
                : " text-gray-50 hover:bg-devstyle"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {[
                    "Image",
                    "Title",
                    "Price",
                    "Discount",
                    "Size",
                    "Color",
                    "Stock",
                    "Sold",
                    "Sale Price",
                  ].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-medium uppercase">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleProducts.map((product) =>
                  product.variants.map((variant) => {
                    const salePrice = product.price - product.price * (product.discount / 100);
                    return (
                      <motion.tr
                        key={`${product._id}-${variant.size}-${variant.color}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <Image
                              src={variant.image || product.image || "/placeholder.jpg"}
                              alt={product.title}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                              onError={(e) => (e.target.src = "/placeholder.jpg")}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{product.title}</td>
                        <td className="px-6 py-4 text-sm">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">{product.discount}%</td>
                        <td className="px-6 py-4 text-sm">{variant.size}</td>
                        <td className="px-6 py-4 text-sm">{variant.color}</td>
                        <td className="px-6 py-4 text-sm">{variant.availableQuantity}</td>
                        <td className="px-6 py-4 text-sm">{variant.totalSold}</td>
                        <td className="px-6 py-4 text-sm font-semibold">${salePrice.toFixed(2)}</td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!hasMore && <p className="text-gray-500 text-sm text-center mt-6">No more products available.</p>}
        </div>
      </motion.div>
    </>
  );
};

export default ViewProducts;