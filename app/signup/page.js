import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Signup = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <Image
            className="m-auto"
            src="/logo.png"
            alt="logo"
            width={500}
            height={250}
            style={{ width: "22%", height: "auto" }}
          />
        </div>
        <h2 className="text-center text-2xl font-bold mt-2">
          Sign up for your account
        </h2>
        <p className="text-center text-gray-600">
            Or 
            <Link href={"/login"} className="ml-2 text-devstyle font-bold text-sm hover:text-red-700">Login</Link>
        </p>
        <form className="mt-6">
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border-0 rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
              placeholder="Full name"
            />
          </div>
          <div className="mt-4">
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
              placeholder="Email address"
            />
          </div>
          <div className="mt-4">
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-devstyle text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup
