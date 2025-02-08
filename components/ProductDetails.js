"use client";

import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";

const ProductDetails = ({ product }) => {
    const { addToCart } = useCart();
    const [pincode, setPincode] = useState("");
    const [isValid, setIsValid] = useState(null);
    const [cartMessage, setCartMessage] = useState("");

    const uniqueColors = [...new Set(product.variants.map(v => v.color))];

    const [selectedColor, setSelectedColor] = useState(uniqueColors[0] || "");
    const [availableSizes, setAvailableSizes] = useState([]);

    useEffect(() => {
        const filteredSizes = product.variants
            .filter(v => v.color === selectedColor && v.availableQuantity > 0)
            .map(v => v.size);
        setAvailableSizes(filteredSizes);
    }, [selectedColor, product.variants]);

    const [selectedSize, setSelectedSize] = useState("");
    useEffect(() => {
        if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0]); 
        } else {
            setSelectedSize("");
        }
    }, [availableSizes]);

    const handleCheckPincode = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/pincode");
            const data = await response.json();
            setIsValid(data.pincodes.includes(Number(pincode)));
        } catch {
            setIsValid(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product.slug, product.title, 1, product.price, selectedSize, selectedColor);
        setCartMessage("Product added to cart!");
        setTimeout(() => setCartMessage(""), 2000);
    };

    return (
        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.brand || "DevStyle"}</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.title}</h1>
            <p className="leading-relaxed">{product.description || "No description available."}</p>

            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                {/* Color Selection */}
                <div className="flex">
                    <span className="mr-3">Color</span>
                    {uniqueColors.map((color, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedColor(color)}
                            className={`border-2 rounded-full w-6 h-6 focus:outline-none mx-1 ${
                                selectedColor === color ? "border-black" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                        ></button>
                    ))}
                </div>

                {/* Size Selection */}
                <div className="flex ml-6 items-center">
                    <span className="mr-3">Size</span>
                    <select
                        className="rounded border border-gray-300 py-2 px-3 focus:outline-none"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        disabled={availableSizes.length === 0}
                    >
                        {availableSizes.length > 0 ? (
                            availableSizes.map((size, index) => (
                                <option key={index} value={size}>
                                    {size}
                                </option>
                            ))
                        ) : (
                            <option disabled>No size available</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="flex">
                <span className="title-font font-medium text-s md:text-2xl text-gray-900">Rs. {product.price}</span>
                <div className="flex ml-auto space-x-3">
                <button
                    className="flex md:ml-2 text-xs md:text-base bg-devstyle hover:bg-red-700 text-white py-2 px-6 rounded"
                    disabled={!selectedSize}
                >
                    Buy Now
                </button>
                <button
                    className="flex md:ml-auto text-xs md:text-base bg-devstyle hover:bg-red-700 text-white  py-2 px-6 rounded"
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                >
                    Add to Cart
                </button>
                </div>
            </div>

            {cartMessage && <p className="mt-2 text-green-500 text-sm">{cartMessage}</p>}

            <div className="flex mt-5 items-center ">
                <span className="text-sm">Enter Pincode to check Service</span>
                <input
                    className="ml-2 border-2 h-8 border-gray-300 rounded p-2 w-24 mr-2"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                />
                <button className="flex text-xs bg-devstyle hover:bg-red-700 text-white py-2 px-6 rounded" onClick={handleCheckPincode}>
                    Check
                </button>
            </div>
            {isValid !== null && (
                <p className={`mt-2 text-sm ${isValid ? "text-green-500" : "text-red-500"}`}>
                    {isValid ? "Service available" : "Service not available"}
                </p>
            )}
        </div>
    );
};

export default ProductDetails;
