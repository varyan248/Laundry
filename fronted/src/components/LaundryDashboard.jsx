import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LaundryDashboard = () => {
  // State for Services (fetched from your backend)
  const [services, setServices] = useState([]);
  // State for the "Clothes Cart"
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Fetch available services from your backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };
    fetchServices();
  }, []);

  // 2. Add clothing item to the booking
  const addToCart = (service) => {
    const exists = cart.find((item) => item.service === service._id);
    if (exists) {
      setCart(cart.map((item) => 
        item.service === service._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { service: service._id, name: service.name, price: service.pricePerUnit, quantity: 1 }]);
    }
  };

  // 3. Remove/Decrease item
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.service !== id));
  };

  // 4. Calculate total cost
  const totalCost = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // 5. Submit Booking to Backend
  const handleBooking = async () => {
    if (!address || !pickupDate || cart.length === 0) {
      alert("Please fill in all details and add clothes!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken'); // Assumes you stored JWT here
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const bookingData = {
        items: cart.map(item => ({ service: item.service, quantity: item.quantity })),
        address,
        pickupDate,
        paymentMethod: 'Cash'
      };

      await axios.post('http://localhost:5000/api/orders/book', bookingData, config);
      setMessage("Booking Successful! Pickup scheduled.");
      setCart([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking Failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50 min-h-screen">
      
      {/* Left Side: Service List */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Select Laundry Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-gray-500 text-sm">{s.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-blue-600 font-bold">${s.pricePerUnit} / unit</span>
                <button 
                  onClick={() => addToCart(s)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                  Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Cart and Checkout */}
      <div className="bg-white p-6 rounded-xl shadow-xl h-fit border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Your Appointment</h2>
        
        {/* Item List */}
        <div className="space-y-4 mb-6">
          {cart.length === 0 && <p className="text-gray-400 italic">No clothes added yet...</p>}
          {cart.map((item) => (
            <div key={item.service} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.service)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Pickup Address</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded mt-1" 
              placeholder="123 Laundry Lane"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pickup Date</label>
            <input 
              type="datetime-local" 
              className="w-full border p-2 rounded mt-1"
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        </div>

        {/* Total and Submit */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
          <button 
            disabled={loading}
            onClick={handleBooking}
            className={`w-full mt-6 py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
            {loading ? "Processing..." : "Confirm Pickup"}
          </button>
          {message && <p className="mt-4 text-center text-sm font-semibold text-blue-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default LaundryDashboard;