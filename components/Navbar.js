"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from "react-icons/fa";
import SideCart from './SideCart';

const Navbar = () => {
    const [cartOpen, setCartOpen] = useState(false);

    const toggleCart = () => {
        setCartOpen((prev) => !prev);
    };

    return (
        <div>
            <header className="text-gray-600 body-font">
                <div className="container mx-auto flex flex-wrap py-2 md:py-1 flex-col md:flex-row items-center shadow-md">
                    <Link href={'/'}>
                        <Image
                            className='m-auto md:ml-5'
                            src="/logo-banner.png"
                            alt="logo" 
                            width={200}
                            height={20}
                            priority={true} 
                            style={{ height: "auto" }}
                            loading="eager"
                        />
                    </Link>
                    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link href={'/tshirts'} className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Tshirts</Link>
                        <Link href={'/hoodies'} className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Hoodies</Link>
                        <Link href={'/stickers'} className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Stickers</Link>
                        <Link href={'/mugs'} className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Mugs</Link>
                        <FaShoppingCart 
                            onClick={toggleCart} 
                            className='text-base text-devstyle md:text-2xl absolute right-2 top-5 md:my-auto cursor-pointer' 
                        />
                    </nav>
                    <SideCart cartOpen={cartOpen} toggleCart={toggleCart} />
                </div>
            </header>
        </div>
    );
};

export default Navbar;
