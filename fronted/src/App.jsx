import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import LaundryDashboard from './pages/LaundryDashboard';
import OrderHistory from './pages/OrderHistory';

// Protects the route
const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                        🧺 <span>FreshPress</span>
                    </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center font-medium">
                        <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
                        {user ? (
                            <>
                                <Link to="/booking" className="hover:text-blue-200 transition-colors">Book Now</Link>
                                <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
                                <Link to="/my-orders" className="hover:text-blue-200 transition-colors">Orders</Link>
                                <button onClick={logout} className="ml-4 bg-white text-blue-600 px-4 py-1.5 rounded-full shadow hover:bg-gray-100 transition focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                                <Link to="/register" className="bg-white text-blue-600 px-6 py-1.5 rounded-full shadow hover:bg-gray-100 transition">Get Started</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none p-2">
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col space-y-3 pt-2">
                        <Link to="/" onClick={() => setIsOpen(false)} className="hover:bg-blue-700 px-3 py-2 rounded-md">Home</Link>
                        {user ? (
                            <>
                                <Link to="/booking" onClick={() => setIsOpen(false)} className="hover:bg-blue-700 px-3 py-2 rounded-md">Book Now</Link>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:bg-blue-700 px-3 py-2 rounded-md">Dashboard</Link>
                                <Link to="/my-orders" onClick={() => setIsOpen(false)} className="hover:bg-blue-700 px-3 py-2 rounded-md">Orders</Link>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="bg-white text-blue-600 px-4 py-2 rounded-md font-bold text-center">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="hover:bg-blue-700 px-3 py-2 rounded-md text-center">Login</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="bg-white text-blue-600 px-4 py-2 rounded-md font-bold text-center">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

function AppRoutes() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Toaster position="top-center" />
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
                        <Route path="/dashboard" element={<PrivateRoute><LaundryDashboard /></PrivateRoute>} />
                        <Route path="/my-orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                    </Routes>
                </main>
                <footer className="bg-gray-900 text-gray-400 py-6 text-center">
                    <p>&copy; {new Date().getFullYear()} FreshPress Laundry Service. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}