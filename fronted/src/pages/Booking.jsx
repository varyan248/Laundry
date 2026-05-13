import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingCart, Calendar, MapPin } from 'lucide-react';

const Booking = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [cart, setCart] = useState({});
    const [pickupDate, setPickupDate] = useState('');
    const [address, setAddress] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/services');
                setServices(data);
            } catch (error) {
                toast.error('Failed to load services');
            }
        };
        fetchServices();
        if (user?.address) setAddress(user.address);
    }, [user]);

    const updateQuantity = (serviceId, delta) => {
        setCart(prev => {
            const newCart = { ...prev };
            const currentObj = newCart[serviceId] || { quantity: 0 };
            const newQuantity = Math.max(0, currentObj.quantity + delta);
            
            if (newQuantity === 0) {
                delete newCart[serviceId];
            } else {
                const s = services.find(sec => sec._id === serviceId);
                newCart[serviceId] = { service: serviceId, quantity: newQuantity, subtotal: newQuantity * s.pricePerUnit, name: s.name, price: s.pricePerUnit };
            }
            return newCart;
        });
    };

    const cartItems = Object.values(cart);
    const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    const handleCheckout = async () => {
        if (!pickupDate || !address) {
            return toast.error('Please provide delivery address and pickup date');
        }
        try {
            const token = localStorage.getItem('userToken');
            const items = cartItems.map(item => ({
                service: item.service,
                quantity: item.quantity,
                subtotal: item.subtotal
            }));

            await axios.post('http://localhost:5000/api/orders', {
                items,
                totalAmount,
                address,
                pickupDate,
                paymentMethod: 'Cash' // Cod by default
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Order placed successfully!');
            navigate('/my-orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Schedule Pickup</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Services List */}
                <div className="lg:col-span-2 space-y-6">
                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Select Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map(service => (
                                    <div key={service._id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-gray-50 hover:bg-blue-50 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                            <p className="text-sm text-gray-500">{service.category}</p>
                                            <p className="text-blue-600 font-bold mt-1">${service.pricePerUnit} / unit</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                                            <button onClick={() => updateQuantity(service._id, -1)} className="text-gray-500 hover:text-red-500 disabled:opacity-50" disabled={!cart[service._id]}>
                                                <Minus className="w-4 h-4"/>
                                            </button>
                                            <span className="w-4 text-center font-semibold">{cart[service._id]?.quantity || 0}</span>
                                            <button onClick={() => updateQuantity(service._id, 1)} className="text-gray-500 hover:text-blue-500">
                                                <Plus className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={() => setStep(2)} 
                                    disabled={cartItems.length === 0}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Proceed to Details
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Delivery & Pickup Details</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Pickup Date</label>
                                    <input type="datetime-local" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Delivery Address</label>
                                    <textarea rows="3" value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Enter your full address"></textarea>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <button onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900 font-medium">← Back to Services</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-blue-600"/> Order Summary</h2>
                        
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-sm italic py-4 text-center">Your basket is empty</p>
                        ) : (
                            <div className="space-y-4">
                                <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                                    {cartItems.map((item, idx) => (
                                        <li key={idx} className="py-3 flex justify-between text-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                            </div>
                                            <p className="font-mono font-medium">${item.subtotal.toFixed(2)}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                                        <span>Total</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        onClick={handleCheckout} 
                                        disabled={step === 1 || cartItems.length === 0}
                                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 focus:ring-4 focus:ring-green-100 disabled:bg-gray-300 disabled:text-gray-500 transition-all shadow-sm"
                                    >
                                        Place Order (COD)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
