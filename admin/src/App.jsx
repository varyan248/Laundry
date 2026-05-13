import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminAuthContext, AdminAuthProvider } from './context/AdminAuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ManageOrders from './pages/ManageOrders';
import ManageServices from './pages/ManageServices';
import ManageUsers from './pages/ManageUsers';
import Login from './pages/Login';

const AdminRoute = ({ children }) => {
    const { admin } = useContext(AdminAuthContext);
    return admin ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    const { admin } = useContext(AdminAuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            <Toaster position="top-right" />
            
            {admin && (
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            )}
            
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {admin && (
                    <Navbar setIsSidebarOpen={setIsSidebarOpen} />
                )}
                
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100/50">
                    <Routes>
                        <Route path="/login" element={!admin ? <Login /> : <Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                        <Route path="/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
                        <Route path="/services" element={<AdminRoute><ManageServices /></AdminRoute>} />
                        <Route path="/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                        <Route path="*" element={<Navigate to={admin ? "/dashboard" : "/login"} />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

const App = () => {
    return (
        <AdminAuthProvider>
            <AppRoutes />
        </AdminAuthProvider>
    );
};

export default App;