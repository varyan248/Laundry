import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, Search, Mail, Phone, MapPin } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
             <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-6 h-6 text-blue-600"/> Manage Users</h1>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="col-span-full text-center text-gray-500 py-10">Loading users...</div> : 
                 filteredUsers.map(user => (
                    <div key={user._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{user.name}</h3>
                                <p className="text-xs text-gray-500 font-mono text-ellipsis overflow-hidden">ID: {user._id}</p>
                            </div>
                        </div>

                        <div className="space-y-3 flex-1 mt-2">
                            <p className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400"/> {user.email}
                            </p>
                            <p className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400"/> {user.phone || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                            <p className="flex items-start gap-3 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 min-w-[16px]"/> <span className="line-clamp-2">{user.address || <span className="text-gray-400 italic">Not provided</span>}</span>
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && !loading && <div className="col-span-full text-center text-gray-500 py-10">No users match your criteria.</div>}
            </div>
        </div>
    );
};

export default ManageUsers;
