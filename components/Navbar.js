import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
    return (
        <div>
            <header className="text-gray-600 body-font">
                <div className="container mx-auto flex flex-wrap py-2 md:py-1 flex-col md:flex-row items-center">
                    <Image
                        className='px-3'
                        src="/logo-banner.png"
                        alt="logo" width={200}
                        height={20}
                        priority={true} 
                        style={{ height: "auto" }}
                        loading="eager"
                        />
                    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link href={'/tshirts'} className="mr-5 text-xs md:text-base font-bold hover:text-gray-900">Tshirts</Link>
                        <Link href={'/hoodies'} className="mr-5 text-xs md:text-base font-bold hover:text-gray-900">Hoodies</Link>
                        <Link href={'/stickers'} className="mr-5 text-xs md:text-base font-bold hover:text-gray-900">Stickers</Link>
                        <Link href={'/mugs'} className="mr-5 text-xs md:text-base font-bold hover:text-gray-900">Mugs</Link>
                    <FaShoppingCart className='text-base md:text-2xl absolute right-2 top-5 md:my-auto'/>
                    </nav>
                </div>
            </header>
        </div>
    )
}

export default Navbar
