import CustomLink from '../../components/CustomLink';
import React from 'react';
import { connectDB } from '../lib/mongodb';
import Order from '../../models/Order';
import ClientOrderPage from './ClientOrderPage';

const OrderPage = async ({ searchParams }) => {
  await connectDB()
  const {id} = await searchParams;
  const order = await Order.findOne({ orderId: id }).lean();

  const plainOrder = {
    ...order,
    createdAt: new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    updatedAt: new Date(order.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  return (

    <div className="min-h-screen bg-[#f6f2f0] py-8 mt-16">
      <div className="max-w-4xl mx-auto bg-[#f6f2f0] shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Order Confirmation</h1>
        <p className="text-gray-600 mb-8 text-center">
          Thank you for your order! Your order has been confirmed and will be
          shipped soon.
        </p>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-semibold">#{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date</span>
              <span className="font-semibold">{plainOrder.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Status</span>
              <span className="font-semibold text-green-600 capitalize">{order.status}</span>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 shadow-lg rounded-lg">
              <thead>
                <tr className="bg-gray-900 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Item</th>
                  <th className="py-3 px-6 text-left">Size/Color</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-center">Price</th>
                  <th className="py-3 px-6 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {order.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">{item.size} / {item.color}</td>
                    <td className="py-3 px-6 text-center">{item.quantity}</td>
                    <td className="py-3 px-6 text-center">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-6 text-center font-semibold">
                      ${(item.price * item.quantity).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-900 font-semibold text-white">
                  <td colSpan="5" className="py-3 px-6 text-right">Total Amount:</td>
                  <td className="py-3 px-6 text-center">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Shipping Address</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {order.customerName}</p>
            <p><span className="font-semibold">Address:</span> {order.customerAddress}</p>
            <p><span className="font-semibold">Zip Code:</span> {order.customerZipCode}</p>
            <p><span className="font-semibold">City:</span> {order.customerCity}</p>
            <p><span className="font-semibold">District:</span> {order.customerDistrict}</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Payment Method</h2>
          <p>Card</p>
        </div>
        <div className="flex justify-center md:justify-end">
          <CustomLink href="/">
            <button className="m-2 text-white bg-gray-900 border-0 text-xs md:text-base py-1 px-2 md:p-3 focus:outline-none hover:bg-gray-700 rounded">
              Continue Shopping
            </button>
          </CustomLink>
        </div>
      </div>
      <ClientOrderPage />
    </div>
  )
}

export default OrderPage
