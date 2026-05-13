import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, MapPin, Phone, Package, ArrowRight } from 'lucide-react';

const LaundryDashboard = () => {
    const { user, login } = useContext(AuthContext); // Can re-use login or create updateProfile in context for simplicity, but let's just do it directly here
    const [profileData, setProfileData] = useState({ name: '', phone: '', address: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({ ...user, password: '' });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const { data } = await axios.put('http://localhost:5000/api/users/profile', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Profile updated successfully');
            setIsEditing(false);
            window.location.reload(); // Quick sync
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {user?.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-blue-600"/> Profile</h2>
                            <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-blue-600 font-medium hover:underline">
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Name"/>
                                <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Phone"/>
                                <textarea value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Address"></textarea>
                                <input type="password" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="New Password (optional)"/>
                                <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700">Save Changes</button>
                            </form>
                        ) : (
                            <div className="space-y-4 text-sm text-gray-600 mt-6">
                                <p className="flex items-center gap-3"><User className="w-4 h-4 text-gray-400"/> {user?.email}</p>
                                <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-gray-400"/> {user?.phone || 'No phone added'}</p>
                                <p className="flex items-start gap-3"><MapPin className="w-4 h-4 text-gray-400 mt-1"/> {user?.address || 'No address added'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Overview */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-md p-8 text-white flex items-center justify-between transform transition-all hover:scale-[1.01]">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Need a Wash?</h2>
                            <p className="text-blue-100 mb-6 max-w-sm">Schedule your next pickup today and leave the laundry to us.</p>
                            <Link to="/booking" className="bg-white text-blue-600 px-6 py-2.5 rounded-full font-semibold shadow-sm hover:bg-blue-50 transition-colors">
                                Book Service
                            </Link>
                        </div>
                        <Package className="w-32 h-32 text-white/20 hidden sm:block" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Orders</h2>
                            <p className="text-sm text-gray-500">Track and view your laundry history</p>
                        </div>
                        <Link to="/my-orders" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg">
                            View All <ArrowRight className="w-4 h-4"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaundryDashboard;
