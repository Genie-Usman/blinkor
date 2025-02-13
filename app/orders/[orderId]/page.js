import { notFound } from 'next/navigation';
import CustomLink from '../../../components/CustomLink';
import { BsCheckCircleFill } from "react-icons/bs";
import { FaTruck, FaClock } from "react-icons/fa";


// Mock data for a single order
const orders = [
    { id: 1, date: '2023-10-01', total: 120.0, status: 'Delivered', items: ['Item 1', 'Item 2'] },
    { id: 2, date: '2023-09-25', total: 80.0, status: 'Shipped', items: ['Item 3'] },
    { id: 3, date: '2023-09-20', total: 200.0, status: 'Processing', items: ['Item 4', 'Item 5'] },
];

export default function OrderDetails({ params }) {
    const order = orders.find((o) => o.id === parseInt(params.orderId));

    if (!order) {
        notFound();
    }

    let statusIcon;
    let statusColor;
    switch (order.status) {
        case 'Delivered':
            statusIcon = <BsCheckCircleFill className="w-6 h-6 text-green-500" />;
            statusColor = 'text-green-500';
            break;
        case 'Shipped':
            statusIcon = <FaTruck className="w-6 h-6 text-blue-500" />;
            statusColor = 'text-blue-500';
            break;
        case 'Processing':
            statusIcon = <FaClock className="w-6 h-6 text-yellow-500" />;
            statusColor = 'text-yellow-500';
            break;
        default:
            statusIcon = <FaClock className="w-6 h-6 text-gray-500" />;
            statusColor = 'text-gray-500';
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 mt-9">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-5 text-center">Order Details</h1>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            {/* Order Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Order #{order.id}</h2>
                                <div className={`flex items-center space-x-2 ${statusColor}`}>
                                    {statusIcon}
                                    <span className="text-lg font-medium">{order.status}</span>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Date</h3>
                                    <p className="text-gray-600">{order.date}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Total</h3>
                                    <p className="text-gray-600">Rs.{order.total}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="mb-1">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Back to Orders Link */}
                            <div className="mt-8">
                                <CustomLink
                                    href="/orders"
                                    className="inline-flex items-center px-6 py-3 bg-devstyle text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
                                >
                                    Back to Orders
                                </CustomLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}