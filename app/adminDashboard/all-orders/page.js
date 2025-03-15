"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [visibleOrders, setVisibleOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/all-orders", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data)
        setHasMore(data.length > 0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      const startIndex = (page - 1) * 5
      const endIndex = startIndex + 5
      const newOrders = orders.slice(startIndex, endIndex)
      setVisibleOrders((prev) => [...prev, ...newOrders])
      setHasMore(endIndex < orders.length)
    }
  }, [page, orders])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading, hasMore])

  if (loading)
    return (
      <motion.div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"
        ></motion.div>
      </motion.div>
    )

  if (error)
    return (
      <motion.div className="flex items-center justify-center h-screen">
        <p className="text-center text-red-500 text-lg font-semibold">
          Error: {error}
        </p>
      </motion.div>
    )

  return (
    <>
      <div className="bg-gray-900 px-6 py-4">
        <h2 className="text-2xl ml-[4.5rem] font-bold text-white">
          All Orders
        </h2>
      </div>

      <motion.div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total Amount",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-medium uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleOrders.map((order, index) => (
                  <motion.tr
                  key={`${order.orderId}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      <p className="text-sm">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-left">
                      <ul className="list-disc pl-4">
                        {order.items.map((item, i) => (
                          <li key={`${item.name}-${i}`}>
                            {item.name} ({item.size}, {item.color}) - {item.quantity} x ${item.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">${order.totalAmount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 text-white rounded-full capitalize ${order.status === "paid" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center h-48 md:h-64"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-indigo-500"
              ></motion.div>
            </motion.div>
          )}
          {!hasMore && (
            <p className="text-gray-500 text-sm text-center mt-6">
              No more orders available.
            </p>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default OrdersPage