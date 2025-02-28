import React from "react";
import CustomLink from "./CustomLink";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <hr className="w-[90%] border-gray-800 mx-auto" />
      <footer className="bg-[#f6f2f0] text-gray-700 body-font">
        <div className="container px-5 py-8 mx-auto flex flex-col md:flex-row flex-wrap">
          <div className="flex flex-col items-center w-full justify-center flex-shrink-0 text-center md:text-left mb-8 md:mb-0">
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
            <div className="mt-2 text-xs md:space-x-10 flex flex-row font-bold text-gray-600">
              <p className="my-2 ml-2">CODE YOUR FUTURE</p>
              <p className="my-2 ml-2">BLINK INTO FASHION</p>
              <p className="my-2 ml-2">STYLE REDEFINED</p>
            </div>
          </div>
          <div className="w-full md:w-3/4 flex flex-col md:space-x-24 md:flex-row mx-auto mt-16 items-center md:items-start justify-between">
            <div className="flex my-auto justify-center md:justify-start mb-8 md:mb-0">
              <CustomLink
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-700 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                href="https://github.com/Genie-Usman"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </CustomLink>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 w-full">
              <div className="flex flex-col items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <path d="m17 2 4 4-4 4"></path>
                  <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
                  <path d="m7 22-4-4 4-4"></path>
                  <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
                </svg>
                <p className="text-gray-900 font-bold mt-2">Exchange Policy</p>
                <p className="text-gray-600 text-xs mt-1">We offer hassle-free exchange policy</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <p className="text-gray-900 font-bold mt-2">Return Policy</p>
                <p className="text-gray-600 text-xs mt-1">We provide 7 days free return policy</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"></path>
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5"></path>
                </svg>
                <p className="text-gray-900 font-bold mt-2">Customer Support</p>
                <p className="text-gray-600 text-xs mt-1">We provide 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-6 py-6">
          <div className="container mx-auto px-5 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">© 2025 Blinkor.com</p>
            <div className="flex space-x-4 mt-3 sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
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
        </div>
      </footer>
    </>
  );
};

export default Footer;