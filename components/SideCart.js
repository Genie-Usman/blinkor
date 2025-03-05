'use client';

import React, { useEffect, useRef } from 'react';
import CustomLink from './CustomLink';
import { CiCircleRemove, CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { BiShoppingBag, BiTrash } from "react-icons/bi";
import { useCart } from '../app/context/CartContext';
import Image from 'next/image';

const SideCart = ({ cartOpen, toggleCart }) => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart } = useCart();
  const slideRef = useRef(null);

  const isEmpty = Object.keys(cart).length === 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartOpen && slideRef.current && !slideRef.current.contains(event.target)) {
        toggleCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, toggleCart]);

  return (
    <div
      ref={slideRef}
      className={`fixed top-0 right-0 h-full w-96 bg-[#f6f2f0]/95 backdrop-blur-lg shadow-2xl border-l border-[#f6f2f0]/20 overflow-y-auto max-h-screen custom-scrollbar 
  transform transition-transform duration-300 ease-in-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}
  md:p-6 p-8 z-50`}
    >
      <div className="flex justify-between items-center pb-5 mb-6 border-b border-[#f6f2f0]/20">
        <h2 className="font-bold text-2xl text-[#1E1E1E] tracking-tight">Your Cart</h2>
        <button
          onClick={toggleCart}
          className="text-gray-500 hover:text-black transition-transform transform hover:scale-110"
        >
          <CiCircleRemove className="text-3xl" />
        </button>
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={toggleCart}
            className="bg-black text-[#f6f2f0] px-6 py-2 rounded-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <ol className="mt-4 space-y-4">
          {Object.entries(cart).map(([key, item]) => (
            <li
              key={key}
              className="flex justify-between items-center bg-[#f6f2f0]/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#f6f2f0]/20"
            >
              <div className="flex items-center space-x-4 w-2/3">
                <Image
                  src={item.image}
                  alt="Product Image"
                  width={64}
                  height={64}
                  className="object-contain w-full h-full mix-blend-multiply transform transition duration-300 ease-out hover:scale-105 origin-center"
                />
                <div className="text-sm text-[#1E1E1E]">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.size} / {item.color}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-[#f6f2f0]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#f6f2f0]/20">
                <CiCircleMinus
                  className="text-gray-500 text-xl cursor-pointer hover:text-black transition-transform transform hover:scale-110"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                />
                <span className="text-black font-medium">{item.quantity}</span>
                <CiCirclePlus
                  className="text-gray-500 text-xl cursor-pointer hover:text-black transition-transform transform hover:scale-110"
                  onClick={() => addToCart(item.id, item.name, 1, item.price, item.size, item.color, item.image)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
      {!isEmpty && (
        <div className="mt-8">
          <div className="text-center text-black font-semibold text-xl mb-6">
            Subtotal: <span className="text-green-600">${subTotal.toFixed(2)}</span>
          </div>

          <div className="flex flex-col space-y-3">
            <CustomLink href="/checkout">
              <button
                onClick={toggleCart}
                className="w-full flex items-center justify-center bg-gradient-to-r from-black to-gray-800 text-[#f6f2f0] px-6 py-3 text-sm rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200 transform hover:scale-105"
              >
                <BiShoppingBag className="mr-2 text-lg" /> Checkout
              </button>
            </CustomLink>
            <button
              onClick={clearCart}
              className="w-full flex items-center justify-center bg-[#f6f2f0]/90 backdrop-blur-sm text-gray-700 px-6 py-3 text-sm rounded-lg hover:bg-[#f6f2f0] transition-all duration-200 transform hover:scale-105 border border-[#f6f2f0]/20"
            >
              <BiTrash className="mr-2 text-lg" /> Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideCart;
