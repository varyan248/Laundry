import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config';

const statuses = ['Pending', 'Picked', 'Washing', 'Out for Delivery', 'Delivered'];

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const { data } = await axios.get(`${API_URL}/api/orders/myorders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Sort by newest first
                setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-20">Loading your orders...</div>;

    const getStatusIndex = (currentStatus) => statuses.indexOf(currentStatus);

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border shadow-sm">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't placed any laundry orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Order #{order._id.slice(-6)}</p>
                                    <p className="text-sm text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Amount</p>
                                    <p className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 sm:p-6">
                                {/* Tracking Stepper */}
                                <div className="mb-8 hidden sm:block">
                                    <div className="flex items-center justify-between relative">
                                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                                        <div className="absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 -translate-y-1/2 transition-all duration-500" style={{width: `${(getStatusIndex(order.status) / (statuses.length - 1)) * 100}%`}}></div>
                                        
                                        {statuses.map((s, idx) => (
                                            <div key={s} className="flex flex-col items-center gap-2 bg-white px-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${idx <= getStatusIndex(order.status) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                                    {idx < getStatusIndex(order.status) ? <CheckCircle className="w-5 h-5"/> : idx + 1}
                                                </div>
                                                <span className={`text-xs font-medium ${idx <= getStatusIndex(order.status) ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Mobile status indicator */}
                                <div className="sm:hidden mb-6 flex items-center gap-3">
                                    <Info className="text-blue-600" />
                                    <span className="font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full text-sm">Status: {order.status}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Items</h4>
                                        <ul className="text-sm space-y-2">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between text-gray-600">
                                                    <span>{item.quantity}x {item.service?.name || 'Unknown Service'}</span>
                                                    <span>${item.subtotal.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="text-sm bg-blue-50 rounded-lg p-4 border border-blue-100">
                                        <p className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-blue-600"/> <strong>Pickup:</strong> {new Date(order.pickupDate).toLocaleString()}</p>
                                        <p className="flex items-start gap-2"><Truck className="w-4 h-4 text-blue-600 mt-0.5"/> <strong>Deliver To:</strong> {order.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;