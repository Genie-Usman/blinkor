'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CiCirclePlus, CiCircleMinus, CiTrash } from "react-icons/ci";
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from "jwt-decode";
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart, user } = useCart();
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
  const isEmpty = Object.keys(cart).length === 0;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded.email); // Decode the token
      setFormData((prevData) => ({
        ...prevData,
        customerEmail: decoded.email, // Set the decoded email in the formData
      }));
    }
  }, []);

  useEffect(() => {
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');
    setDisablePay(!isFormValid);
  }, [formData]);

  const handleCheckZipcode = async (zipcode) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/zipcodes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch zipcodes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched Zipcode Data:", data);

      const matchedEntry = data.zipcodes.find(zip => zip.postal_code === zipcode);
      console.log("Matched Entry:", matchedEntry);

      setFormData(prev => {
        const updatedForm = {
          ...prev,
          customerCity: matchedEntry ? matchedEntry.city : '',
          customerDistrict: matchedEntry ? matchedEntry.district : '',
        };
        console.log("Updated Form Data:", updatedForm);
        return updatedForm;
      });

    } catch (error) {
      console.error("Error checking zipcode:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
    // Check if required fields are filled
    if (!formData.customerName) formErrors.customerName = "Full Name is required.";
    if (!formData.customerPhone) formErrors.customerPhone = "Phone Number is required.";
    if (!formData.customerEmail) formErrors.customerEmail = "Email is required.";
    if (!formData.customerZipCode) formErrors.customerZipCode = "Zip Code is required.";
    if (!formData.customerAddress) formErrors.customerAddress = "Address is required.";

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.customerEmail && !emailPattern.test(formData.customerEmail)) {
      formErrors.customerEmail = "Please enter a valid email address.";
    }

    // Phone number validation (example: xxxx-xxxxxx format)
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {/* Shipping Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="customerName" value={formData.customerName} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="John Doe" required />
                {errors.customerName && <span className="text-red-500 text-sm">{errors.customerName}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="xxxx-xxxxxxx" required />
                {errors.customerPhone && <span className="text-red-500 text-sm">{errors.customerPhone}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="customerEmail" value={formData.customerEmail} onChange={handleChange} type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="johndoe@example.com" disabled={user.value} required />
                {errors.customerEmail && <span className="text-red-500 text-sm">{errors.customerEmail}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input name="customerZipCode" value={formData.customerZipCode} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="12345" required />
                {errors.customerZipCode && <span className="text-red-500 text-sm">{errors.customerZipCode}</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="customerAddress" value={formData.customerAddress} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="123 Main St." required />
              {errors.customerAddress && <span className="text-red-500 text-sm">{errors.customerAddress}</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="customerCity" value={formData.customerCity} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="New York City" readOnly required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input type="text" name="customerDistrict" value={formData.customerDistrict} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-devstyle focus:ring-1" placeholder="New York" readOnly required />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        {!isEmpty && (<div className="bg-[#BCB8B1] px-5 py-10 mb-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ol className="ml-4 font-semibold list-decimal">
            {Object.entries(cart).map(([key, item]) => (
              <li key={key} className="my-5 flex justify-between items-center">
                <div className="w-2/3 text-sm font-medium">{item.name} ({item.size}/{item.color})</div>
                <div className="w-1/3 flex items-center justify-end space-x-2">
                  <CiCircleMinus className="text-gray-700 text-xl cursor-pointer hover:text-gray-200" onClick={() => removeFromCart(item.id, item.size, item.color)} />
                  <span className="text-md font-semibold">{item.quantity}</span>
                  <CiCirclePlus className="text-gray-700 text-xl cursor-pointer hover:text-gray-200" onClick={() => addToCart(item.id, item.name, 1, item.price, item.size, item.color)} />
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 ml-2 flex justify-between font-bold">Subtotal: ${subTotal.toFixed(2)}
            <CiTrash onClick={clearCart} className="text-gray-700 text-xl cursor-pointer hover:text-gray-200" />
          </div>
        </div>)}

        {/* Place Order Button */}
        <div className="flex justify-end">
          <button
            onClick={handleStripePayment}
            disabled={disablePay}
            className={`m-1 w-32 flex items-center justify-center gap-2 text-white bg-[#635BFF] border-0 text-sm py-3 px-4 rounded-md shadow-md transition-all duration-300 ease-in-out 
  ${disablePay ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4B46D1] focus:ring-2 focus:ring-blue-300'}`}
          >
            {loading ? (
              <>
              Processing
                <Loader2 className="animate-spin w-5 h-5" />
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
