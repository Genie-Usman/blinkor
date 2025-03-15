"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddProduct = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
    category: "",
    price: "",
    discount: "",
    variants: [{ size: "", color: "", image: "", availableQuantity: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...formData.variants];
    newVariants[index][e.target.name] = e.target.value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", color: "", image: "", availableQuantity: "" }],
    });
  };

  const handleRemoveVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/addproducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formData]),
      });

      if (response.ok) {
        toast.success("Product added successfully!", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 20px",
          },
        });
      } else {
        toast.error("Failed to add product", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 20px",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("An error occurred while submitting the form", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 20px",
        },
      });
    } finally {
      setSubmitting(false)
    }
  };

  const isFormValid = () => {
    const requiredFields = ["title", "slug", "description", "image", "category", "price"];
    const isMainFormValid = requiredFields.every((field) => formData[field].trim() !== "");
    const areVariantsValid = formData.variants.every(
      (variant) =>
        variant.size.trim() !== "" &&
        variant.color.trim() !== "" &&
        variant.image.trim() !== "" &&
        variant.availableQuantity.trim() !== ""
    );
    return isMainFormValid && areVariantsValid
  };

  return (
    <>
    <div className="bg-gray-900 px-6 py-4">
          <h2 className="text-2xl ml-[4.5rem] font-bold text-white">Add Product</h2>
        </div>
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mt-10 md:mx-auto bg-[#f6f2f0]/80 overflow-hidden"
    >
      <div className="grid grid-cols-1 gap-5">
        {[
          { label: "Title", name: "title", placeholder: "Enter product title" },
          { label: "Slug", name: "slug", placeholder: "Unique product slug (e.g., product-name)" },
          { label: "Description", name: "description", placeholder: "Brief product description" },
          { label: "Image URL", name: "image", placeholder: "E.g., https://example.com/image.jpg" },
          { label: "Category", name: "category", placeholder: "E.g., toon sips (Use lowercase)" },
          { label: "Price", name: "price", placeholder: "E.g., 299", type: "number" },
          { label: "Discount (%)", name: "discount", placeholder: "E.g., 20", type: "number" },
        ].map(({ label, name, placeholder, type = "text" }) => (
          <div key={name} className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <input
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              required
            />
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-800">Variants</h3>
      {formData.variants.map((variant, index) => (
        <div
          key={index}
          className="border p-5 rounded-lg mb-4 relative bg-[#f6f2f0]/95 hover:bg-[#f6f2f0]/80 transition-all"
        >
          {[
            { label: "Size", name: "size", placeholder: "E.g., S, M, L, XL" },
            { label: "Color", name: "color", placeholder: "E.g., Pink, Royal Blue" },
            { label: "Image URL", name: "image", placeholder: "E.g., https://example.com/variant.jpg" },
            { label: "Available Quantity", name: "availableQuantity", placeholder: "E.g., 10, 50, 100", type: "number" },
          ].map(({ label, name, placeholder, type = "text" }) => (
            <div key={name} className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
              <input
                name={name}
                type={type}
                value={variant[name]}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
                required
              />
            </div>
          ))}
          {formData.variants.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              className="absolute top-3 right-3 bg-gray-900 text-white p-1.5 rounded-full hover:bg-red-600 transition-all"
            >
              <FaTrash className="text-sm" />
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-center">
      <button
        type="button"
        onClick={handleAddVariant}
        className="w-full mx-32 py-2.5 mb-6 text-gray-700 rounded-lg hover:text-gray-950 transition-all flex items-center justify-center gap-2"
      >
        <FaPlus className="text-sm" /> Add Variant
      </button>
      </div>
      <div className="flex justify-end mr-2 mb-5">
      <button
        type="submit"
        disabled={!isFormValid() || submitting}
        className={`w-44 disabled:bg-gray-500 disabled:cursor-not-allowed ${
          submitting ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 active:bg-gray-700"
        } text-white py-2 rounded-lg font-base transition-all transform hover:scale-105 active:scale-95`}
      >
        {submitting ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding Product...
          </div>
        ) : (
          "Add Product"
        )}
      </button>
    </div>
    </form>
    </>
  );
};

export default AddProduct;