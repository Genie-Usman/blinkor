'use client';

import React, { useState, useEffect, useRef } from 'react';
import CustomLink from './CustomLink';
import { CiCircleRemove, CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { BiShoppingBag, BiTrash } from "react-icons/bi";
import { useCart } from '../app/context/CartContext';

const SideCart = ({ cartOpen, toggleCart }) => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart } = useCart();
  const slideRef = useRef(null);

  const isEmpty = Object.keys(cart).length === 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartOpen && slideRef.current && !slideRef.current.contains(event.target)) {
        toggleCart(); // Close cart only when it's open and clicking outside
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, toggleCart]);
  

  return (
    <div ref={slideRef}
      className={`fixed top-0 h-full right-0 w-72 bg-[#BCB8B1] overflow-y-auto max-h-screen custom-scrollbar shadow-lg rounded-lg p-6 z-50 transition-transform duration-300 ease-in-out ${cartOpen ? 'translate-x-0' : 'translate-x-full '
        }`}
    >
      <h2 className="font-bold text-xl text-center mt-3">Shopping Cart</h2>
      <button onClick={toggleCart} className="absolute top-4 right-2 cursor-pointer">
        <CiCircleRemove className="hover:text-gray-200 text-2xl text-gray-700" />
      </button>

      {isEmpty ? (
        <p className="text-center text-red-600 mt-4">Your cart is empty</p>
      ) : (
        <ol className="ml-2 font-semibold list-decimal">
          {Object.entries(cart).map(([key, item]) => (
            <li key={key} className="my-5 flex justify-between items-center">
              <div className="w-2/3 text-sm font-medium">
                {item.name} ({item.size}/{item.color})
              </div>
              <div className="w-1/3 flex items-center justify-end space-x-2">
                <CiCircleMinus
                  className="text-gray-700 text-xl cursor-pointer hover:text-gray-200"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                />
                <span className="text-md font-semibold">{item.quantity}</span>
                <CiCirclePlus
                  className="text-gray-700 text-xl cursor-pointer hover:text-gray-200"
                  onClick={() => addToCart(item.id, item.name, 1, item.price, item.size, item.color)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}

      {!isEmpty && (
        <>
          <div className="mt-5 text-center font-bold">Subtotal: ${subTotal.toFixed(2)}</div>
          <div className="flex justify-between mt-4">
            <CustomLink href="/checkout">
              <button onClick={toggleCart} className="flex items-center bg-gray-700 text-white px-3 py-2 text-sm rounded-md hover:bg-devstyle transition-all duration-200">
                <BiShoppingBag className="mr-1 text-base" /> Checkout
              </button>
            </CustomLink>
            <button
              onClick={clearCart}
              className="bg-gray-700 flex items-center text-white px-3 py-2 text-sm rounded-md hover:bg-devstyle transition-all duration-200"
            >
              <BiTrash className="mr-1 text-base" /> Clear Cart
            </button>
          </div>

        </>
      )}
    </div>
  );
};

export default SideCart;
