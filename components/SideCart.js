'use client';

import React from 'react';
import Link from 'next/link';
import { AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { RiShoppingBag4Fill } from 'react-icons/ri';
import { useCart } from '../app/context/CartContext';

const SideCart = ({ cartOpen, toggleCart }) => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart } = useCart();

  return (
    <div
      className={`fixed top-0 h-full right-0 w-72 bg-pink-200 shadow-lg rounded-lg p-6 z-50 transition-transform duration-300 ease-in-out ${cartOpen ? 'translate-x-0' : 'translate-x-full '}`}
    >
      <h2 className="font-bold text-xl text-center ">Shopping Cart</h2>
      <span onClick={toggleCart} className="absolute top-5 right-2 cursor-pointer">
        <AiFillCloseCircle className="hover:text-red-700 text-xl md:text-2xl text-devstyle" />
      </span>
      <ol className="ml-2 font-semibold list-decimal">
        {Object.keys(cart).length === 0 ? (
          <p className="text-center text-gray-600 mt-4">Your cart is empty</p>
        ) : (
          Object.entries(cart).map(([id, item]) => (
            <li key={id}>
              <div className="item flex my-5">
                <div className="w-2/3 text-md font-semibold">{item.name}</div>
                <div className="w-1/3 font-semibold flex justify-center items-center">
                  <AiFillMinusCircle
                    className="text-devstyle text-lg cursor-pointer"
                    onClick={() => removeFromCart(id)}
                  />
                  <span className="mx-2">{item.quantity}</span>
                  <AiFillPlusCircle
                    className="text-devstyle text-lg cursor-pointer"
                    onClick={() => addToCart(id, item.name, 1, item.price, item.size, item.color)}
                  />
                </div>
              </div>
            </li>
          ))
        )}
      </ol>
      <div className="mt-5 text-center font-bold">Subtotal: Rs.{subTotal.toFixed(0)}</div>
      <div className="flex mt-4">
        <Link href={'/checkout'}><button className="flex mr-2 text-white bg-devstyle border-0 text-xs md:text-base py-1 px-2 md:p-2 focus:outline-none hover:bg-red-700 rounded">
          <RiShoppingBag4Fill className="mt-0.5 md:m-1 text-xs md:text-lg" />
          Checkout
        </button></Link>
        <button
          onClick={clearCart}
          className="flex text-white bg-devstyle border-0 text-xs md:text-base py-1 px-2 md:p-2 focus:outline-none hover:bg-red-700 rounded"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default SideCart;