"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";
import toast from 'react-hot-toast';
import { Loader2 } from "lucide-react";

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

    // Calculate discounted price
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
    }, [selectedColor, product.variants]);

    const handleCheckZipcode = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/zipcodes`);
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
        addToCart(product.slug, product.title, 1, discountedPrice, selectedSize, selectedColor);
        toast.success('Item added To Cart', {
            duration: 2000,
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

    const handleBuyNow = () => {
        if (!selectedSize) {
            setCartMessage("Please select a size before buying.");
            return;
        }
        setLoading(true);
        buyNow(product.slug, product.title, 1, discountedPrice, selectedSize, selectedColor);
        router.push("/checkout");
        setLoading(false);
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
            {/* Product Image */}
            <div className="flex-1 flex justify-center lg:justify-start">
                <div className="relative w-full h-[50vh] md:h-[75vh] flex items-center justify-center overflow-visible">

                    <div className="relative w-full h-[50vh] md:h-[75vh] flex items-center justify-center overflow-visible">
                        <Image
                            src={productImage}
                            alt={product.title}
                            width={400}
                            height={400}
                            className="object-contain w-full h-full mix-blend-multiply transform transition duration-300 ease-out hover:scale-105 origin-center"
                            priority
                        />
                    </div>
                </div>
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
                                className={`border-2 rounded-full w-7 h-7 mx-1 transition ${selectedColor === color ? "border-black" : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: color }}
                            ></button>
                        ))}
                    </div>

                    {/* Size Selection */}
                    <div className="flex md:ml-6 absolute mt-24 md:static md:mt-0 items-center">
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
                    {/* Price Section with Discount */}
                    <div className="flex items-center absolute md:static mb-10 ml-32 md:mb-0 md:ml-0 space-x-3 -mt-[1.5rem] md:mt-3">
                        {product.discount > 0 && (
                            <span className="text-gray-500 line-through text-lg">${product.price.toFixed(2)}</span>
                        )}
                        <span className="title-font font-medium text-xl md:text-2xl text-gray-900">
                            ${discountedPrice}
                        </span>
                        {product.discount > 0 && (
                            <span className="bg-red-500 text-white px-2 py-1 text-sm rounded">
                                -{product.discount}%
                            </span>
                        )}
                    </div>
                    <div className="flex ml-auto md:mt-0 mt-7 space-x-2">
                        <button
                            className="flex md:ml-2 text-xs md:text-sm bg-black hover:bg-gray-800 text-white py-3 px-4 rounded transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!selectedSize || loading}
                            onClick={handleBuyNow}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" /> {/* Loader */}
                                    Processing...
                                </>
                            ) : (
                                "Buy Now"
                            )}
                        </button>
                        <button
                            className="flex md:ml-auto text-xs md:text-sm bg-black hover:bg-gray-800 text-white py-3 px-4 rounded"
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {cartMessage && <p className="mt-2 text-green-500 text-sm">{cartMessage}</p>}

                {/* Zipcode Checker */}
                <div className="flex mt-5 items-center">
                    <span className="text-sm">Enter Zip-code to check Service</span>
                    <input
                        className="ml-2 border-2 h-8 border-gray-300 rounded p-2 w-24 mr-2"
                        type="text"
                        value={zipcode}
                        onChange={handleZipcodeButton}
                        placeholder="44000"
                    />
                    <button
                        disabled={disable} onChange={handleZipcodeButton} className="flex text-xs bg-black disabled:bg-gray-500 hover:bg-gray-800 text-white py-2 px-6 rounded"
                        onClick={handleCheckZipcode}
                    >
                        Check
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
