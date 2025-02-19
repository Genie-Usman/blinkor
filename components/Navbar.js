"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import { CiShoppingCart, CiUser, CiLogin   } from "react-icons/ci";
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
            <div className="container mx-auto flex flex-wrap py-3 md:py-1 md:flex-row flex-col items-center shadow-md fixed top-0 left-0 w-full z-50 bg-[#eeeae6]">
                <div className="left-0 absolute mt-1 md:static md:ml-5">
                    <CustomLink href="/">
                        <Image
                            className="w-32 md:w-48"
                            src="/Blinkor.png"
                            alt="logo"
                            width={200}
                            height={50}
                            priority={true}
                            loading="eager"
                        />
                    </CustomLink>
                </div>
                <nav className="sm:ml-7 md:mr-auto mt-10 md:mt-0 flex flex-wrap items-center text-base justify-center space-x-5">
                    <CustomLink
                        href="/tshirts"
                        className="relative text-sm md:text-lg font-bold text-gray-700 hover:text-devstyle transition-all duration-300 ease-in-out group"
                    >
                        Tshirts
                        <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-devstyle transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </CustomLink>
                    <CustomLink
                        href="/hoodies"
                        className="relative text-sm md:text-lg font-bold text-gray-700 hover:text-devstyle transition-all duration-300 ease-in-out group"
                    >
                        Hoodies
                        <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-devstyle transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </CustomLink>
                    <CustomLink
                        href="/caps"
                        className="relative text-sm md:text-lg font-bold text-gray-700 hover:text-devstyle transition-all duration-300 ease-in-out group"
                    >
                        Caps
                        <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-devstyle transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </CustomLink>
                    <CustomLink
                        href="/mugs"
                        className="relative text-sm md:text-lg font-bold text-gray-700 hover:text-devstyle transition-all duration-300 ease-in-out group"
                    >
                        Mugs
                        <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-devstyle transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </CustomLink>
                </nav>
                <div className="flex absolute right-2 md:right-5 mt-2 md:0 flex-end items-center space-x-2 md:space-x-5">
                    {user.value ? (
                        <div ref={dropdownRef}>
                            <CiUser  onClick={toggleDropdown} className="text-base text-gray-700 hover:text-red-700 md:text-xl cursor-pointer" />
                            {dropdown && (
                                <div className="absolute right-8 font-bold top-6 py-4 px-3 bg-[#BCB8B1] text-sm rounded shadow-lg w-32">
                                    <ul className="flex flex-col text-left">
                                        <li className="p-2 hover:text-[#F4F3EE] cursor-pointer">
                                            <CustomLink href="/myaccount">My Account</CustomLink>
                                        </li>
                                        <li className="p-2 hover:text-[#F4F3EE] cursor-pointer">
                                            <CustomLink href="/myorders">Orders</CustomLink>
                                        </li>
                                        <li className="p-2 hover:text-red-900 cursor-pointer text-red-600" onClick={logout}>
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <CustomLink href="/login">
                            <CiLogin  className="text-base text-gray-700 hover:text-devstyle md:text-2xl cursor-pointer" />
                        </CustomLink>
                    )}
                    <CiShoppingCart
                        onClick={toggleCart}
                        className="text-base text-gray-700 hover:text-devstyle md:text-2xl cursor-pointer"
                    />
                </div>
                <SideCart cartOpen={cartOpen} toggleCart={toggleCart} />
            </div>
        </header>
    );
};

export default Navbar;
