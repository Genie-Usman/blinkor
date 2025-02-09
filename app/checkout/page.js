'use client';

import React from 'react'
import Link from 'next/link';
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, subTotal, addToCart, removeFromCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {/* Shipping Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="xxxx-xxxxxxx"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Islamabad"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Punjab"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="10001"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div
          className={`sideCart bg-pink-200 px-5 py-10 mb-4 rounded`}
        >
          <h2 className="text-xl font-semibold mb-4 ">Order Summary</h2>
          <ol className="ml-4 font-semibold list-decimal">
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
          <div className="mt-5 ml-2 font-bold">Subtotal: Rs.{subTotal.toFixed(0)}</div>
        </div>


        {/* Place Order Button */}
        <div className='flex justify-end'>
          <Link href={'/order'}>
            <button className=" m-2 w-32 text-white bg-devstyle border-0 text-xs md:text-base py-1 px-2 md:p-2 focus:outline-none hover:bg-red-700 rounded">
              Place Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Checkout
