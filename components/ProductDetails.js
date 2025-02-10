"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";
import { toast, Zoom } from "react-toastify";

const ProductDetails = ({ product }) => {
    const { addToCart, buyNow } = useCart();
    const [pincode, setPincode] = useState("");
    const [isValid, setIsValid] = useState(null);
    const [cartMessage, setCartMessage] = useState("");
    const router = useRouter();

    const uniqueColors = [...new Set(product.variants.map(v => v.color))];

    const [selectedColor, setSelectedColor] = useState(uniqueColors[0] || "");
    const [availableSizes, setAvailableSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [productImage, setProductImage] = useState(product.image);

    useEffect(() => {
        const filteredVariants = product.variants.filter(
            v => v.color === selectedColor && v.availableQuantity > 0
        );

        if (filteredVariants.length > 0) {
            setAvailableSizes(filteredVariants.map(v => v.size));
            setSelectedSize(filteredVariants[0].size);

            // Update product image dynamically
            setProductImage(filteredVariants[0].image && filteredVariants[0].image !== "" 
                ? filteredVariants[0].image 
                : product.image);
        } else {
            setAvailableSizes([]);
            setSelectedSize("");
            setProductImage(product.image);
        }
    }, [selectedColor, product.variants]);

    const handleCheckPincode = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/pincode");
            const data = await response.json();
            setIsValid(data.pincodes.includes(Number(pincode)));
        } catch {
            setIsValid(false);
        }
    };

    useEffect(() => {
        if (isValid === null) return;

        if (isValid) {
            toast.success("Service available!", {
                position: "bottom-center",
                autoClose: 2000,
                transition: Zoom,
            });
        } else {
            toast.error("Sorry, service is not available yet!", {
                position: "bottom-center",
                autoClose: 2000,
                transition: Zoom,
            });
        }
    }, [isValid]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            setCartMessage("Please select a size before adding to cart.");
            return;
        }
        addToCart(product.slug, product.title, 1, product.price, selectedSize, selectedColor);
        toast.success("Item added to cart!", {
            position: "bottom-center",
            autoClose: 1000,
            transition: Zoom,
        });
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            setCartMessage("Please select a size before buying.");
            return;
        }
        buyNow(product.slug, product.title, 1, product.price, selectedSize, selectedColor);
        router.push("/checkout");
    };

    return (
        <div className="container mx-auto px-5 py-10 flex flex-col lg:flex-row gap-10">
            {/* Product Image */}
            <div className="flex mt-4 space-x-2">
                <Image
                    src={productImage}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="rounded-lg shadow-md"
                    priority
                />
            </div>

            <div className="w-full lg:w-1/2">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {product.brand || "DevStyle"}
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {product.title}
                </h1>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    ({selectedSize}/{selectedColor})
                </h1>
                <p className="leading-relaxed">{product.description || "No description available."}</p>

                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                    {/* Color Selection */}
                    <div className="flex">
                        <span className="mr-3">Color</span>
                        {uniqueColors.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedColor(color)}
                                className={`border-2 rounded-full w-7 h-7 mx-1 transition ${
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
                    <span className="title-font font-medium text-s md:text-2xl text-gray-900">
                        Rs. {product.price}
                    </span>
                    <div className="flex ml-auto space-x-3">
                        <button
                            className="flex md:ml-2 text-xs md:text-base bg-devstyle hover:bg-red-700 text-white py-2 px-6 rounded"
                            disabled={!selectedSize}
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                        <button
                            className="flex md:ml-auto text-xs md:text-base bg-devstyle hover:bg-red-700 text-white py-2 px-6 rounded"
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {cartMessage && <p className="mt-2 text-green-500 text-sm">{cartMessage}</p>}

                {/* Pincode Checker */}
                <div className="flex mt-5 items-center">
                    <span className="text-sm">Enter Pincode to check Service</span>
                    <input
                        className="ml-2 border-2 h-8 border-gray-300 rounded p-2 w-24 mr-2"
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                    />
                    <button
                        className="flex text-xs bg-devstyle hover:bg-red-700 text-white py-2 px-6 rounded"
                        onClick={handleCheckPincode}
                    >
                        Check
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
