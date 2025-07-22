'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CiCirclePlus, CiCircleMinus, CiTrash } from "react-icons/ci";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from "jwt-decode";
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth()
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [disablePay, setDisablePay] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerZipCode: "",
    customerAddress: "",
    customerCity: "",
    customerDistrict: "",
  });
  const router = useRouter();
  const isEmpty = Object.keys(cart).length === 0;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setFormData(prevData => ({
        ...prevData,
        customerEmail: decoded.email,
      }));
    }
    else {
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');
    setDisablePay(!isFormValid);
  }, [formData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (formData.customerEmail && token) {
      fetchUser(token);
    }
  }, [formData.customerEmail]);

  const fetchUser = async (token) => {

    try {
      const res = await fetch("/api/getuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();

      setFormData((prevData) => ({
        ...prevData,
        customerName: data.name || prevData.customerName,
        customerPhone: data.phone || prevData.customerPhone,
        customerZipCode: data.zipcode ? data.zipcode.toString() : prevData.customerZipCode,
        customerAddress: data.address || prevData.customerAddress,
      }))
      if (data.zipcode) {
        handleCheckZipcode(data.zipcode.toString())
      }
    } catch (error) {
      toast.error("Failed to fetch user details.");
    }
  };

  const handleCheckZipcode = async (zipcode) => {
    try {
      const response = await fetch(`/api/zipcodes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch zipcodes: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data?.zipcodes || !Array.isArray(data.zipcodes)) {
        throw new Error("Invalid zipcodes data format.");
      }

      const matchedEntry = data.zipcodes.find(zip => zip.postal_code.toString() === zipcode.toString());

      if (matchedEntry) {
        setFormData(prev => ({
          ...prev,
          customerCity: matchedEntry.city,
          customerDistrict: matchedEntry.district,
        }));

        toast.success(`Service available in ${matchedEntry.city}, ${matchedEntry.district}!`, {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#000',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '12px 20px',
          },
        });
      } else {
        toast.error("Sorry, service is not available for this zipcode!", {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '12px 20px',
          },
        });
      }
    } catch (error) {
      console.error("Error checking zipcode:", error);
    }
  };


  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === "customerZipCode") {
      if (value.length === 5) {
        await handleCheckZipcode(value);
      } else {
        setFormData(prev => ({
          ...prev,
          customerCity: "",
          customerDistrict: "",
        }));
      }
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.customerName) formErrors.customerName = "Full Name is required.";
    if (!formData.customerPhone) formErrors.customerPhone = "Phone Number is required.";
    if (!formData.customerEmail) formErrors.customerEmail = "Email is required.";
    if (!formData.customerZipCode) formErrors.customerZipCode = "Zip Code is required.";
    if (!formData.customerAddress) formErrors.customerAddress = "Address is required.";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.customerEmail && !emailPattern.test(formData.customerEmail)) {
      formErrors.customerEmail = "Please enter a valid email address.";
    }

    const phonePattern = /^[0-9]{4}[0-9]{7}$/;
    if (formData.customerPhone && !phonePattern.test(formData.customerPhone)) {
      formErrors.customerPhone = "Please enter a valid phone number (xxxxxxxxxxx).";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleStripePayment = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before proceeding.", {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '12px 20px',
        },
      });
      return;
    }

    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: Object.values(cart),
        ...formData,
      }),
    });

    const session = await response.json();

    if (session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      clearCart()
      toast.error(session.error, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '12px 20px',
        },
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f2f0]/80 py-8">
      <div className="max-w-4xl mx-auto bg-[#f6f2f0]/80  rounded-lg p-8 mt-10 md:mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="customerName" value={formData.customerName} onChange={handleChange} type="text" className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="John Doe" required />
                {errors.customerName && <span className="text-red-500 text-sm">{errors.customerName}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} type="text" className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="xxxx-xxxxxxx" required />
                {errors.customerPhone && <span className="text-red-500 text-sm">{errors.customerPhone}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="customerEmail" value={formData.customerEmail} onChange={handleChange} type="email" className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="johndoe@example.com" disabled={user.value} required />
                {errors.customerEmail && <span className="text-red-500 text-sm">{errors.customerEmail}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input name="customerZipCode" value={formData.customerZipCode} onChange={handleChange} type="text" className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="12345" required />
                {errors.customerZipCode && <span className="text-red-500 text-sm">{errors.customerZipCode}</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="customerAddress" value={formData.customerAddress} onChange={handleChange} type="text" className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="123 Main St." required />
              {errors.customerAddress && <span className="text-red-500 text-sm">{errors.customerAddress}</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="customerCity" value={formData.customerCity} className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="New York City" readOnly required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input type="text" name="customerDistrict" value={formData.customerDistrict} className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all" placeholder="New York" readOnly required />
              </div>
            </div>
          </form>
        </div>
        {!isEmpty && (
          <div className="bg-[#f6f2f0]/80 backdrop-blur-lg shadow-sm border border-gray-200 px-6 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Order Summary</h2>
            <ol className="space-y-4">
              {Object.entries(cart).map(([key, item]) => (
                <li
                  key={key}
                  className="flex justify-between items-center bg-[#f6f2f0]/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-[#f6f2f0]/20"
                >
                  <div className="flex items-center space-x-4 w-2/3">
                    <Image
                      src={item.image}
                      alt="Product Image"
                      width={64}
                      height={64}
                      className="object-cover transform transition mix-blend-multiply duration-300 ease-out hover:scale-105"
                    />
                    <div className="text-xs md:text-sm text-gray-800">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{item.size} / {item.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-[#f6f2f0]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#f6f2f0]/20">
                    <CiCircleMinus
                      className="text-gray-500 text-sm md:text-xl cursor-pointer hover:text-black transition-transform transform hover:scale-110"
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                    />
                    <span className="text-gray-900 font-medium">{item.quantity}</span>
                    <CiCirclePlus
                      className="text-gray-500 text-sm md:text-xl cursor-pointer hover:text-black transition-transform transform hover:scale-110"
                      onClick={() => addToCart(item.id, item.name, 1, item.price, item.size, item.color, item.image)}
                    />
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex justify-between text-lg font-semibold text-gray-900">
              <div className='ml-2'>
                <span>Subtotal:</span>
                <span className='ml-2 text-green-600'>${subTotal.toFixed(2)}</span>
              </div>
              <CiTrash
                onClick={clearCart}
                className="text-gray-600 text-xl cursor-pointer hover:text-red-600 transition-transform transform hover:scale-110"
              />
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleStripePayment}
            disabled={disablePay}
            className={`m-1 w-28 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#635BFF] to-[#4B46D1] border-0 text-xs py-3 px-4 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
      ${disablePay ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-md' : ''}`}
          >
            {loading ? (
              <>
                Wait...
                <Loader2 className="animate-spin w-4 h-4" />
              </>
            ) : (
              "Pay with Stripe"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
