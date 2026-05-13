import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await axios.get('http://localhost:5000/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data);
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('adminToken');
    await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAllOrders();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Admin Management</h2>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">User</th>
            <th className="p-4">Status</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="border-t">
              <td className="p-4">{o.address}</td>
              <td className="p-4 font-bold text-blue-600">{o.status}</td>
              <td className="p-4">${o.totalAmount}</td>
              <td className="p-4">
                <select onChange={(e) => updateStatus(o._id, e.target.value)} className="border p-1 rounded">
                  <option>Change Status</option>
                  <option value="Picked">Picked</option>
                  <option value="Washing">Washing</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;