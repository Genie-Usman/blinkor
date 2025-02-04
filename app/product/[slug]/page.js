'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';

const Product = ({ params }) => {
  const { slug } = React.use(params);
  const { addToCart, cart } = useCart();

  const [pincode, setPincode] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [cartMessage, setCartMessage] = useState('');

  const fetchPincodes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pincode');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data.pincodes;
    } catch (error) {
      console.error('Error fetching pincodes:', error);
      return [];
    }
  };

  const handleCheckPincode = async () => {
    try {
      const pincodes = await fetchPincodes();
      setIsValid(pincodes.includes(Number(pincode)));
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(slug, 'Code Your Look', 1, 799, 'M', 'Black');
    setCartMessage('Product added to cart!');
    setTimeout(() => setCartMessage(''), 2000);
  };

  return (
    <div>
      <section className="text-gray-600 body-font overflow-x-hidden">
        <div className="container px-5 py-12 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <Image
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-[31rem] px-14 md:px-0 object-cover object-top rounded"
              src="/tshirt.jpeg"
              width={500}
              height={500}
              loading="eager"
              priority
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">DevStyle</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">Code Your Look</h1>
              <p className="leading-relaxed">
                Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha...
              </p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex">
                  <span className="mr-3">Color</span>
                  <button className="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                  <button className="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                  <button className="border-2 border-gray-300 ml-1 bg-devstyle rounded-full w-6 h-6 focus:outline-none"></button>
                </div>
                <div className="flex ml-6 items-center">
                  <span className="mr-3">Size</span>
                  <select className="rounded border border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-devstyle focus:border-devstyle text-base pl-3 pr-10">
                    <option>SM</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
              </div>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">Rs.799</span>
                <button className="flex ml-auto text-white bg-devstyle border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded">
                  Buy Now
                </button>
                <button
                  className="flex ml-2 text-white bg-devstyle border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
              {cartMessage && <p className="mt-2 text-green-500 text-sm">{cartMessage}</p>}

              <div className="flex mt-4 items-center">
                <span className="text-sm">Postal code for service check</span>
                <input
                  className="ml-2 mr-2 border-2 border-red-200 rounded text-sm text-black p-2 w-32"
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button
                  className="ml-2 text-white bg-devstyle border-0 py-1.5 px-4 text-sm focus:outline-none hover:bg-red-700 rounded"
                  onClick={handleCheckPincode}
                >
                  Check
                </button>
              </div>
              {isValid !== null && (
                <div className="mt-2 text-sm">
                  {isValid ? (
                    <span className="text-green-500">Service available in your area.</span>
                  ) : (
                    <span className="text-red-500">Service not available in your area.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;