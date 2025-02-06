import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
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
          Login to your account
        </h2>
        <p className="text-center text-gray-600">
            Or 
            <Link href={"/signup"} className="ml-2 text-devstyle font-bold text-sm hover:text-red-700">Sign up</Link>
        </p>
        <form className="mt-6">
          <div>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border-0 rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
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
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 font-semibold text-gray-600">Remember me</span>
            </label>
            <Link href="/forgotpassword" className="text-devstyle font-bold text-sm hover:text-red-700">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-devstyle text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
