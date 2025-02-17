'use client';

import React, { useState, useEffect } from 'react';
import { toast, Zoom } from "react-toastify";
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [zipcode, setZipcode] = useState("");
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

  const handleStripePayment = async () => {
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
        position: "top-left",
        autoClose: 2000,
        transition: Zoom,
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
                <input name="customerName" value={formData.customerName} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="xxxx-xxxxxxx" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="customerEmail" value={formData.customerEmail} onChange={handleChange} type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="johndoe@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input name="customerZipCode" value={formData.customerZipCode} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="12345" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input name="customerAddress" value={formData.customerAddress} onChange={handleChange} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="123 Main St." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="customerCity" value={formData.customerCity} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="New York City" readOnly required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input type="text" name="customerDistrict" value={formData.customerDistrict} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" placeholder="New York" readOnly required />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-pink-200 px-5 py-10 mb-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ol className="ml-4 font-semibold list-decimal">
            {Object.entries(cart).map(([key, item]) => (
              <li key={key} className="my-5 flex justify-between items-center">
                <div className="w-2/3 text-sm font-medium">{item.name} ({item.size}/{item.color})</div>
                <div className="w-1/3 flex items-center justify-end space-x-2">
                  <AiFillMinusCircle className="text-devstyle text-lg cursor-pointer hover:text-red-600" onClick={() => removeFromCart(item.id, item.size, item.color)} />
                  <span className="text-md font-semibold">{item.quantity}</span>
                  <AiFillPlusCircle className="text-devstyle text-lg cursor-pointer hover:text-green-600" onClick={() => addToCart(item.id, item.name, 1, item.price, item.size, item.color)} />
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 ml-2 font-bold">Subtotal: ${subTotal.toFixed(2)}</div>
        </div>

        {/* Place Order Button */}
        <div className="flex justify-end">
          <button onClick={handleStripePayment} disabled={disablePay} className={`m-1 w-28 text-white bg-[#635BFF] border-0 text-sm py-3 px-2 rounded-md shadow-sm transition duration-200 ease-in-out ${disablePay ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4B46D1] focus:ring-2 focus:ring-blue-300'}`}>
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
