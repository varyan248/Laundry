import React, { useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { LogOut, Bell, Menu } from 'lucide-react';

const Navbar = ({ setIsSidebarOpen }) => {
    const { logout } = useContext(AdminAuthContext);

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center md:hidden">
                    <span className="text-xl font-bold text-gray-900 tracking-wider flex items-center gap-2">
                        🧺 <span className="hidden xs:inline">FreshAdmin</span>
                    </span>
                </div>
                <div className="hidden md:block">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Control Panel</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <span className="sr-only">View notifications</span>
                    <Bell className="w-5 h-5" />
                </button>
                <div className="h-8 w-px bg-gray-200"></div>
                <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign out</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;