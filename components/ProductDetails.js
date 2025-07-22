"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";
import toast from 'react-hot-toast';
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { CiCreditCard1, CiShoppingCart } from "react-icons/ci";

const ProductDetails = ({ product }) => {
    const { addToCart, buyNow } = useCart();
    const [zipcode, setZipcode] = useState("");
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [disable, setDisable] = useState(true);
    const router = useRouter();

    const uniqueColors = [...new Set(product.variants.map(v => v.color))];

    const [selectedColor, setSelectedColor] = useState(uniqueColors[0] || "");
    const [availableSizes, setAvailableSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [productImage, setProductImage] = useState(product.image);

    const discountedPrice = product.discount
        ? (product.price - (product.price * product.discount) / 100).toFixed(2)
        : product.price.toFixed(2);

    useEffect(() => {
        const filteredVariants = product.variants.filter(
            v => v.color === selectedColor && v.availableQuantity > 0
        );

        if (filteredVariants.length > 0) {
            setAvailableSizes(filteredVariants.map(v => v.size));
            setSelectedSize(filteredVariants[0].size);

            setProductImage(filteredVariants[0].image && filteredVariants[0].image !== ""
                ? filteredVariants[0].image
                : product.image);
        } else {
            setAvailableSizes([]);
            setSelectedSize("");
            setProductImage(product.image);
        }
    }, [selectedColor, product.variants, product.image]);

    const handleCheckZipcode = async () => {
        try {
            const response = await fetch(`/api/zipcodes`);
            if (!response.ok) {
                throw new Error(`Failed to fetch zipcodes: ${response.statusText}`);
            }

            const data = await response.json();
            const enteredZipcode = zipcode.trim();
            const matchedEntry = data.zipcodes.find(zip => zip.postal_code === enteredZipcode);

            if (matchedEntry) {
                setIsValid(true);
                toast.success(`Service available in ${matchedEntry.city}, ${matchedEntry.district}!`, {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: '#000',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        padding: '12px 20px',
                    },
                });
            } else {
                setIsValid(false);
                toast.error("Sorry, service is not available for this zipcode!", {
                    duration: 2000,
                    position: 'top-right',
                    style: {
                        background: '#000',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        padding: '12px 20px',
                    },
                });

            }
        } catch (error) {
            console.error("Error checking zipcode:", error);
            setIsValid(false);
            toast.error("Error fetching zipcode data!", {
                duration: 2000,
                position: 'top-right',
                style: {
                    background: '#000',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '12px 20px',
                },
            });
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setCartMessage("Please select a size before adding to cart.");
            return;
        }
        addToCart(product.slug, product.title, 1, discountedPrice, selectedSize, selectedColor, product.variants);
        toast.success('Item added To Cart', {
            duration: 1000,
            position: 'top-right',
            style: {
                background: '#000',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '2px',
                padding: '12px 20px',
            },
            icon: '🛒',
        });

    };

    const handleBuyNow = async () => {
        if (!selectedSize) {
            setCartMessage("Please select a size before buying.");
            return;
        }
        setLoading(true)
        try {
            await buyNow(product.slug, product.title, 1, discountedPrice, selectedSize, selectedColor, product.variants)
            router.push("/checkout")
        } catch (error) {
            toast.error("Failed to process your request. Please try again.");
        } finally {
            setLoading(false)
        }
    };
    const handleZipcodeButton = (e) => {
        setZipcode(e.target.value)
        if (e.target.value.length >= 5) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    };
    return (
        <div className="container mx-auto px-5 py-10 flex justify-center flex-col lg:flex-row gap-10">
            <div className="flex-1 flex justify-center lg:justify-start">
                <div className="relative w-full h-[50vh] md:h-[75vh] cursor-pointer flex items-center justify-center overflow-visible">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        className="relative w-full h-[50vh] md:h-[75vh] mix-blend-multiply flex items-center justify-center overflow-visible"
                    >
                        <Image
                            src={productImage}
                            alt={product.title}
                            width={400}
                            height={400}
                            className="object-contain w-full h-full mix-blend-multiply transform transition duration-300 ease-out hover:scale-105 origin-center"
                            priority
                        />
                    </motion.div>
                </div>
            </div>

            <div className="w-full lg:w-1/2">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    Blinkor
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-bold mb-1">
                    {product.title}
                </h1>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    ({selectedSize}/{selectedColor})
                </h1>
                <p className="leading-relaxed">{product.description || "No description available."}</p>

                <div className="flex justify-between mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                    <div className="flex items-center">
                        <span className="mr-3">Color</span>
                        {uniqueColors.map((color, index) => {
                            const formattedColor = color.trim().replace(/\s+/g, "").toLowerCase();
                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => setSelectedColor(color)}
                                    className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 shadow-sm"
                                    style={{ backgroundColor: formattedColor }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                />
                            );
                        })}
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex md:ml-6 absolute mt-24 md:static md:mt-0 items-center"
                    >
                        <span className="mr-3 text-base font-medium text-gray-700">Size</span>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative"
                        >
                            <select
                                className="appearance-none cursor-pointer rounded-lg border border-gray-300 bg-[#f6f2f0] py-2 pl-3 pr-8 text-sm text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:ring-opacity-50 transition-all shadow-sm hover:shadow-md"
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
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg
                                    className="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="flex">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                        className="flex items-center md:mb-0 md:ml-0 space-x-3 mt-8 md:mt-0"
                    >
                        {product.discount > 0 && (
                            <span className="text-gray-500 line-through text-lg md:text-lg">${product.price.toFixed(2)}</span>
                        )}
                        <span className="title-font font-medium text-xl md:text-2xl text-gray-900">
                            ${discountedPrice}
                        </span>
                        {product.discount > 0 && (
                            <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 text-sm rounded-full shadow-lg hover:shadow-xl transition-shadow">
                                -{product.discount}%
                            </span>
                        )}
                    </motion.div>

                    <div className="flex absolute md:static ml-24 md:ml-auto md:mt-0 mt-20 space-x-2">
                        {/* Buy Now Button */}
                        <div
                            className={`button w-[100px] h-[45px] bg-black hover:bg-gray-800 text-white rounded relative text-center transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 ${!selectedSize || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleBuyNow}>
                            <div className="button-wrapper">
                                {loading ? (
                                    <>
                                        <span className="flex items-center justify-center w-[100px] h-[45px]">

                                            <Loader2 className="animate-spin w-5 h-5 " />
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="text">Buy Now</div>
                                        <span className="icon">
                                            <CiCreditCard1 className={`${loading ? "hidden" : "w-7 h-7"}`} />
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Add To Cart Button */}
                        <div
                            className={`button w-[110px] h-[45px] bg-black hover:bg-gray-800 text-white rounded relative text-center transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 ${!selectedSize ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleAddToCart}>
                            <div className="button-wrapper">
                                <div className="text">Add to Cart</div>
                                <span className="icon">
                                    <CiShoppingCart className="w-8 h-8" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {cartMessage && <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-2 text-green-500 text-sm"
                >
                    {cartMessage}
                </motion.p>}

                <div className="flex mt-20 md:mt-5 items-center">
                    <span className="text-sm">Enter Zip-code to check Service</span>
                    <div className=" absolute mt-20 ml-28 md:static md:mt-0 md:ml-0 flex items-center">

                        <input
                            className="ml-2 h-8 w-24 rounded-lg border-2 border-gray-300 bg-[#f6f2f0] px-3 py-1 text-sm text-gray-800 placeholder-gray-400 focus:border-gray-700 focus:outline-none focus:ring-0 focus:ring-gray-800 focus:ring-opacity-50 transition-all shadow-sm hover:shadow-md"
                            type="text"
                            value={zipcode}
                            onChange={handleZipcodeButton}
                            placeholder="44000"
                        />
                        <button
                            disabled={disable} onChange={handleZipcodeButton} className="ml-2 flex text-xs bg-black disabled:bg-gray-500 hover:bg-gray-800 text-white py-2 px-6 rounded"
                            onClick={handleCheckZipcode}
                        >
                            Check
                        </button>

                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductDetails;
