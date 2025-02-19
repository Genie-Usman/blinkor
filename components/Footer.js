import React from "react";
import CustomLink from "./CustomLink";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 body-font">
      <hr />
      <div className="container px-5 py-12 mx-auto flex flex-wrap md:flex-nowrap flex-col md:flex-row">
        <div className="w-full md:w-1/4 flex-shrink-0 text-center md:text-left mb-8 md:mb-0">
          <CustomLink href="/" className="flex flex-col items-center md:items-start">
            <Image
              src="/Blinkor.png"
              alt="logo"
              width={180}
              height={180}
              priority={true}
              loading="eager"
            />
          </CustomLink>
          <div className="mt-2 text-xs  text-gray-600">
            <p className="my-2 ml-2">CODE YOUR FUTURE</p>
            <p className="my-2 ml-2">BLINK INTO FASHION</p>
            <p className="my-2 ml-2">STYLE REDEFINED</p>
          </div>
        </div>

        <div className="w-full md:w-3/4 flex flex-wrap md:justify-between">
          <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-gray-700 font-semibold text-sm mb-3">SHOP</h2>
            <nav className="list-none space-y-2">
              <li><CustomLink href="/tshirts" className="hover:text-devstyle">T-Shirts</CustomLink></li>
              <li><CustomLink href="/hoodies" className="hover:text-devstyle">Hoodies</CustomLink></li>
              <li><CustomLink href="/caps" className="hover:text-devstyle">Caps</CustomLink></li>
              <li><CustomLink href="/mugs" className="hover:text-devstyle">Mugs</CustomLink></li>
            </nav>
          </div>

          <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-gray-700 font-semibold text-sm mb-3">CUSTOMER SERVICE</h2>
            <nav className="list-none space-y-2">
              <li><CustomLink href="/contact" className="hover:text-devstyle">Contact Us</CustomLink></li>
              <li><CustomLink href="/about" className="hover:text-devstyle">About Us</CustomLink></li>
              <li><CustomLink href="/" className="hover:text-devstyle">Return Policy</CustomLink></li>
              <li><CustomLink href="/" className="hover:text-devstyle">Shipping Policy</CustomLink></li>
            </nav>
          </div>

          <div className="w-1/2 md:w-1/4">
            <h2 className="text-gray-700 font-semibold text-sm mb-3">POLICY</h2>
            <nav className="list-none space-y-2">
              <li><CustomLink href="/" className="hover:text-devstyle">Privacy Policy</CustomLink></li>
              <li><CustomLink href="/" className="hover:text-devstyle">Terms & Conditions</CustomLink></li>
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-6 py-4 text-center flex flex-col sm:flex-row items-center justify-between container mx-auto px-5">
        <p className="text-gray-600 text-sm">© 2025 Blinkor.com</p>
        <div className="flex space-x-4 mt-3 sm:mt-0">
          <a href="#" className="text-gray-500 hover:text-blue-600">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-400">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-pink-500">
            <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-600">
            <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
