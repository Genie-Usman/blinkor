"use client"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { FaPlus, FaTrash } from "react-icons/fa"

const UpdateProduct = () => {
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productFound, setProductFound] = useState(false)
  const [productId, setProductId] = useState("")
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    slug: "",
    description: "",
    image: "",
    category: "",
    price: "",
    discount: "",
    variants: [{ size: "", color: "", image: "", availableQuantity: "" }],
  })

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId.trim()) return

      setLoading(true)
      try {
        const response = await fetch(`/api/getproducts?id=${productId}`)
        if (!response.ok) throw new Error("Product not found")

        const product = await response.json()
        setProductFound(true)

        setFormData({
          ...product,
          price: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          variants: Array.isArray(product.variants) && product.variants.length > 0
            ? product.variants.map(v => ({
              ...v,
              availableQuantity: Number(v.availableQuantity) || 0,
            }))
            : [{ size: "", color: "", image: "", availableQuantity: 0 }],
        })

        toast.success("Product details loaded!", {
          duration: 1500,
          position: "top-right",
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 20px",
          },
        })
      } catch (error) {
        console.error("Fetch error:", error)
        setProductFound(false)
        toast.error("Product not found!", {
          duration: 1500,
          position: "top-right",
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 20px",
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" ? Number(value) || 0 : value,
    }))
  }

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? { ...variant, [name]: name === "availableQuantity" ? Number(value) || 0 : value }
          : variant
      ),
    }))
  }

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", image: "", availableQuantity: 0 }],
    }))
  }

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!productFound) {
      toast.error("No product loaded to update", {
        duration: 1500,
        position: "top-right",
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 20px",
        },
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/updateproducts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formData]),
      })

      if (!response.ok) throw new Error("Failed to update product")

      toast.success("Product updated successfully!", {
        duration: 1500,
        position: "top-right",
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 20px",
        },
      })

      setFormData({
        _id: "",
        title: "",
        slug: "",
        description: "",
        image: "",
        category: "",
        price: "",
        discount: "",
        variants: [{ size: "", color: "", image: "", availableQuantity: "" }],
      })
      setProductId("")
      setProductFound(false)

    } catch (error) {
      toast.error("An error occurred while updating the product", {
        duration: 1500,
        position: "top-right",
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 20px",
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-gray-900 px-6 py-4">
        <h2 className="text-2xl ml-[4.5rem] font-bold text-white">Update Products</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mt-10 md:mx-auto bg-[#f6f2f0]/80 overflow-hidden"
      >
        <div className="grid grid-cols-1 gap-5">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Product ID</label>
            <input
              name="_id"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter product ID"
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              required
            />
          </div>
          {loading && <p className="text-gray-600 text-sm">Loading product details...</p>}
          {productFound &&
            [
              { label: "Title", name: "title" },
              { label: "Slug", name: "slug" },
              { label: "Description", name: "description" },
              { label: "Image URL", name: "image" },
              { label: "Category", name: "category" },
              { label: "Price", name: "price", type: "number" },
              { label: "Discount (%)", name: "discount", type: "number" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name} className="col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
                  required
                />
              </div>
            ))}
          {productFound && (
            <>
              <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-800">Variants</h3>
              {formData.variants.map((variant, index) => (
                <div key={index} className="border p-5 rounded-lg mb-4 relative bg-[#f6f2f0]/95 hover:bg-[#f6f2f0]/80 transition-all">
                  {[{ label: "Size", name: "size" },
                  { label: "Color", name: "color" },
                  { label: "Image URL", name: "image" },
                  { label: "Available Quantity", name: "availableQuantity", type: "number" }].map(({ label, name, type = "text" }) => (
                    <div key={name} className="mb-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                      <input
                        name={name}
                        type={type}
                        value={variant[name] || ""}
                        onChange={(e) => handleVariantChange(index, e)}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
                        required
                      />
                    </div>
                  ))}
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute top-3 right-3 bg-gray-900 text-white p-1.5 rounded-full hover:bg-red-600 transition-all">
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-48 mx-32 py-2.5 mb-6 text-gray-700 rounded-lg hover:text-gray-950 transition-all flex items-center justify-center gap-2"
                >
                  <FaPlus className="text-sm" /> Add Variant
                </button>
              </div>
              <div className="flex justify-end mr-2 mb-5">
              <button type="submit" disabled={submitting} className="w-44 disabled:bg-gray-500 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg font-base transition-all transform hover:scale-105">
                {submitting ? (<div className="flex items-center justify-center">
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
                  Updating Product...
                </div>) : ("Update Product")}
              </button>
              </div>
            </>
          )}
        </div>
      </form>
    </>
  )
}

export default UpdateProduct
