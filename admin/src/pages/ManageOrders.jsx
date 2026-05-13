import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, Search, Edit2 } from 'lucide-react';
import API_URL from '../config';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Picked': 'bg-blue-100 text-blue-800 border-blue-200',
        'Washing': 'bg-purple-100 text-purple-800 border-purple-200',
        'Out for Delivery': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Delivered': 'bg-green-100 text-green-800 border-green-200'
    };

    return (
        <div className="space-y-6">
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Package className="w-6 h-6 text-blue-600"/> Manage Orders</h1>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-4">Order ID & Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                            ) : orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900 border-b border-dashed border-gray-300 inline-block pb-0.5">#{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-gray-900">{order.user?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{order.user?.phone}</p>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">${order.totalAmount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="relative inline-block text-left">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="block w-full text-xs font-medium bg-white border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1.5 pr-6 cursor-pointer shadow-sm disabled:bg-gray-100"
                                                disabled={order.status === 'Delivered'}
                                            >
                                                {['Pending', 'Picked', 'Washing', 'Out for Delivery', 'Delivered'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;