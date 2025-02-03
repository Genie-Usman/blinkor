"use client";

import React from 'react';
import { AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { RiShoppingBag4Fill } from "react-icons/ri";

const SideCart = ({ cartOpen, toggleCart }) => {
    return (
        <div
            className={`sideCart bg-pink-200 w-72 absolute top-1 right-0 h-full px-5 py-10 transform transition-transform rounded ${cartOpen ? 'translate-x-0' : 'translate-x-full '
                }`}
        >
            <h2 className='font-bold text-xl text-center '>Shopping Cart</h2>
            <span onClick={toggleCart} className='absolute top-5 right-2 cursor-pointer'>
                <AiFillCloseCircle className='hover:text-red-900 text-xl md:text-2xl text-devstyle' />
            </span>
            <ol className='mx-1 font-semibold list-decimal'>
                <li>
                    <div className='item flex my-5'>
                        <div className='w-2/3 text-base font-semibold'>T-shirt - Code Your Look</div>
                        <div className='w-1/3 font-semibold flex justify-center items-center'>
                            <AiFillMinusCircle className='text-devstyle text-lg cursor-pointer' />
                            <span className='mx-2'>1</span>
                            <AiFillPlusCircle className='text-devstyle text-lg cursor-pointer' />
                        </div>
                    </div>
                </li>
            </ol>
            <button className="flex ml-2 text-white bg-devstyle border-0 py-2 px-4 focus:outline-none hover:bg-red-900 rounded"><RiShoppingBag4Fill className='m-1' />Checkout</button>
        </div>
    );
};

export default SideCart;
