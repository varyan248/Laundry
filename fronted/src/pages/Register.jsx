import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.phone, formData.address);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-8 py-10 shadow-2xl rounded-2xl border border-gray-100">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-8">
                        Create FreshPress Account
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Full Name *</label>
                            <input name="name" type="text" required onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Email address *</label>
                            <input name="email" type="email" required onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Password *</label>
                            <input name="password" type="password" required onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                            <input name="phone" type="text" onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Delivery Address</label>
                            <textarea name="address" rows="2" onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all"></textarea>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all">
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;