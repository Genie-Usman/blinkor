"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-6 text-center">
      <p className="text-gray-600">
        © 2025 All rights reserved by{" "}
        <Link href="https://blinkor.vercel.app" target="_blank" className="text-blue-500 hover:underline">
          Blinkor.com
        </Link>
      </p>
    </div>
  );
};

export default Footer;
