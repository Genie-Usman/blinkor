'use client';

import React from 'react';
import Link from 'next/link';
import { AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { RiShoppingBag4Fill } from 'react-icons/ri';
import { IoTrashBinSharp } from "react-icons/io5";
import { useCart } from '../app/context/CartContext';

const SideCart = ({ cartOpen, toggleCart }) => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart } = useCart();
  const isEmpty = Object.keys(cart).length === 0;

  return (
    <div
      className={`fixed top-0 h-full right-0 w-72 bg-pink-200 shadow-lg rounded-lg p-6 z-50 transition-transform duration-300 ease-in-out ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
      <button onClick={toggleCart} className="absolute top-5 right-2 cursor-pointer">
        <AiFillCloseCircle className="hover:text-red-700 text-2xl text-devstyle" />
      </button>

      {isEmpty ? (
        <p className="text-center text-gray-600 mt-4">Your cart is empty</p>
      ) : (
        <ol className="ml-2 font-semibold list-decimal">
          {Object.entries(cart).map(([key, item]) => (
            <li key={key} className="my-5 flex justify-between items-center">
              <div className="w-2/3 text-sm font-medium">
                {item.name} ({item.size}/{item.color})
              </div>
              <div className="w-1/3 flex items-center justify-end space-x-2">
                <AiFillMinusCircle
                  className="text-devstyle text-lg cursor-pointer hover:text-red-600"
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                />
                <span className="text-md font-semibold">{item.quantity}</span>
                <AiFillPlusCircle
                  className="text-devstyle text-lg cursor-pointer hover:text-green-600"
                  onClick={() => addToCart(item.id, item.name, 1, item.price, item.size, item.color)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}

      {!isEmpty && (
        <>
          <div className="mt-5 text-center font-bold">Subtotal: Rs. {subTotal.toFixed(0)}</div>
          <div className="flex justify-between mt-4">
            <Link href="/checkout">
              <button className="flex items-center bg-devstyle text-white px-4 py-2 rounded hover:bg-red-700">
                <RiShoppingBag4Fill className="mr-2 text-lg" /> Checkout
              </button>
            </Link>
            <button
              onClick={clearCart}
              className="bg-devstyle flex items-center text-white px-2 py-2 rounded hover:bg-red-700"
            >
              <IoTrashBinSharp className="mr-2 text-lg" /> Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideCart;
