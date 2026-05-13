const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    quantity: { type: Number, required: true },
    subtotal: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date },
  paymentMethod: { type: String, enum: ['Cash', 'Online'], default: 'Cash' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  status: { 
    type: String, 
    enum: ['Pending', 'Picked', 'Washing', 'Out for Delivery', 'Delivered'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);