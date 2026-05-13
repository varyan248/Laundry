import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-[90vh]">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Premium Laundry Service at Your Doorstep
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Schedule a pickup today and experience crisp, clean, and perfectly folded clothes delivered within 48 hours. FreshPress is your trusted clothing care partner.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/booking" className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all transform hover:scale-105">
                            Schedule Pickup
                        </Link>
                        <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 group">
                            Create Account <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
