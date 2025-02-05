import Link from 'next/link';
import React from 'react'

const Order = ({ params }) => {
  // Mock order data 
  const order = {
    id: params.orderId,
    date: "October 10, 2023",
    status: "Confirmed",
    items: [
      { id: 1, name: "Code Your Look - Tshirt", price: 799, quantity: 1 },
      { id: 2, name: "Code Your Look - Mug", price: 399, quantity: 2 },
    ],
    total: 1198,
    shippingAddress: {
      name: "John Doe",
      address: "123 Main St",
      city: "Islamabad",
      state: "Punjab",
      zip: "10001",
    },
    paymentMethod: "Credit Card (**** 4242)",
  };
  return (

    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Order Confirmation</h1>
        <p className="text-gray-600 mb-8 text-center">
          Thank you for your order! Your order has been confirmed and will be
          shipped soon.
        </p>

        {/* Order Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-semibold">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date</span>
              <span className="font-semibold">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Status</span>
              <span className="font-semibold text-green-600">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>Rs.{item.price.toFixed(0)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs.{order.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Shipping Address</h2>
          <div className="space-y-2">
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zip}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Payment Method</h2>
          <p>{order.paymentMethod}</p>
        </div>

        {/* Continue Shopping Button */}
        <div className="flex justify-center md:justify-end">
          <Link href="/">
            <button className="m-2 text-white bg-devstyle border-0 text-xs md:text-base py-1 px-2 md:p-3 focus:outline-none hover:bg-red-700 rounded">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Order
