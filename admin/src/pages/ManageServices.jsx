import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Layers, Plus, Trash2 } from 'lucide-react';

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', pricePerUnit: '', category: 'Wash' });
    const [isAdding, setIsAdding] = useState(false);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/services');
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:5000/api/services', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Service added successfully');
            setIsAdding(false);
            setFormData({ name: '', description: '', pricePerUnit: '', category: 'Wash' });
            fetchServices();
        } catch (error) {
            toast.error('Failed to add service');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Service deleted');
            fetchServices();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Layers className="w-6 h-6 text-blue-600"/> Manage Services</h1>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
                >
                    {isAdding ? 'Cancel' : <><Plus className="w-4 h-4"/> Add Service</>}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-bold mb-4">Add New Laundry Service</h2>
                    <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g. Wash & Fold" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price per unit ($)</label>
                            <input required name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} type="number" step="0.01" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g. 5.99" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                <option value="Wash">Wash</option>
                                <option value="Iron">Iron</option>
                                <option value="Dry Clean">Dry Clean</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 text-right mt-2">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-green-700 transition">Save Service</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="col-span-full text-center text-gray-500 py-10">Loading services...</div> : 
                 services.map(service => (
                    <div key={service._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">{service.category}</span>
                                <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                            </div>
                            <span className="text-xl font-bold text-gray-900">${service.pricePerUnit}</span>
                        </div>
                        
                        <button 
                            onClick={() => handleDelete(service._id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-50 rounded-lg border border-red-100"
                            title="Delete Service"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {services.length === 0 && !loading && <div className="col-span-full text-center text-gray-500 py-10">No services added yet.</div>}
            </div>
        </div>
    );
};

export default ManageServices;