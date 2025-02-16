"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import { FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle, MdLogin } from "react-icons/md";
import SideCart from "./SideCart";
import { useCart } from "../app/context/CartContext";

const Navbar = () => {
    const { user, logout } = useCart();
    const dropdownRef = useRef(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCart = () => {
        setCartOpen((prev) => !prev);
    };
    const toggleDropdown = () => {
        setDropdown((prev) => !prev);
    };

    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap py-3 md:py-1 md:flex-row flex-col items-center shadow-md fixed top-0 left-0 w-full z-50 bg-white">
                <div className="left-0 absolute md:static md:ml-5">
                <CustomLink href="/">
                    <Image
                        className="w-32 md:w-48"
                        src="/logo-banner.png"
                        alt="logo"
                        width={200}
                        height={50}
                        priority={true}
                        loading="eager"
                    />
                </CustomLink>
                </div>
                <nav className="ml-7 md:ml-auto md:mr-auto mt-10 md:mt-0 flex flex-wrap items-center text-base justify-center">
                    <CustomLink href="/tshirts" className="mr-5 text-sm md:text-base font-bold hover:text-devstyle">Tshirts</CustomLink>
                    <CustomLink href="/hoodies" className="mr-5 text-sm md:text-base font-bold hover:text-devstyle">Hoodies</CustomLink>
                    <CustomLink href="/caps" className="mr-5 text-sm md:text-base font-bold hover:text-devstyle">Caps</CustomLink>
                    <CustomLink href="/mugs" className="mr-5 text-sm md:text-base font-bold hover:text-devstyle">Mugs</CustomLink>
                </nav>
                <div className="flex absolute right-2 md:right-5 mt-2 md:0 flex-end items-center space-x-2 md:space-x-5">
                    {user.value ? (
                        <div ref={dropdownRef}>
                            <MdAccountCircle onClick={toggleDropdown} className="text-base text-devstyle hover:text-red-700 md:text-2xl cursor-pointer" />
                            {dropdown && (
                                <div className="absolute right-8 font-bold top-6 py-4 px-3 bg-pink-200 text-sm rounded shadow-lg w-32">
                                    <ul className="flex flex-col text-left">
                                        <li className="p-2 hover:bg-pink-300 cursor-pointer">
                                            <CustomLink href="/myaccount">Ny Account</CustomLink>
                                        </li>
                                        <li className="p-2 hover:bg-pink-300 cursor-pointer">
                                            <CustomLink href="/myorders">My Orders</CustomLink>
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
