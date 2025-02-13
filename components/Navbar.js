"use client";

import React, { useState } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import { FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle, MdLogin } from "react-icons/md";
import SideCart from "./SideCart";
import { useCart } from "../app/context/CartContext";

const Navbar = () => {
    const { user, logout } = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const toggleCart = () => {
        setCartOpen((prev) => !prev);
    };

    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap py-2 md:py-1 md:flex-row items-center shadow-md fixed top-0 left-0 w-full z-50 bg-white">
                <CustomLink href="/" className="m-auto md:ml-5">
                    <Image
                        src="/logo-banner.png"
                        alt="logo"
                        width={200}
                        height={200}
                        priority={true}
                        loading="eager"
                    />
                </CustomLink>
                <nav className="ml-7 md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                    <CustomLink href="/tshirts" className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Tshirts</CustomLink>
                    <CustomLink href="/hoodies" className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Hoodies</CustomLink>
                    <CustomLink href="/caps" className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Caps</CustomLink>
                    <CustomLink href="/mugs" className="mr-5 text-xs md:text-base font-bold hover:text-devstyle">Mugs</CustomLink>
                </nav>
                <div className="flex flex-end items-center space-x-5">
                    {user.value ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setDropdown(true)}
                            onMouseLeave={() => setDropdown(false)}
                        >
                            <MdAccountCircle className="text-base text-devstyle hover:text-red-700 md:text-2xl cursor-pointer" />
                            {dropdown && (
                                <div className="absolute right-0 top-6 py-4 px-2 bg-pink-200 text-sm rounded shadow-lg w-32">
                                    <ul className="flex flex-col text-left">
                                        <li className="p-2 hover:bg-pink-300 cursor-pointer">
                                            <CustomLink href="/account">Account</CustomLink>
                                        </li>
                                        <li className="p-2 hover:bg-pink-300 cursor-pointer">
                                            <CustomLink href="/orders">Orders</CustomLink>
                                        </li>
                                        <li className="p-2 hover:bg-red-300 cursor-pointer text-red-700" onClick={logout}>
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <CustomLink href="/login">
                            <MdLogin className="text-base text-devstyle hover:text-red-700 md:text-2xl cursor-pointer" />
                        </CustomLink>
                    )}
                    <FaShoppingCart
                        onClick={toggleCart}
                        className="text-base text-devstyle hover:text-red-700 md:text-2xl cursor-pointer"
                    />
                </div>
                <SideCart cartOpen={cartOpen} toggleCart={toggleCart} />
            </div>
        </header>
    );
};

export default Navbar;
