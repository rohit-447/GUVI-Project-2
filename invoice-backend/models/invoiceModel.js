const mongoose = require('mongoose');

// Schema for individual invoice items
const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  unitPrice: Number,
});

// Main invoice schema
const invoiceSchema = new mongoose.Schema({
  invoiceInfo: {       // Basic invoice details
    number: String,
    date: Date,
    dueDate: Date,
  },
  client: {            // Client details
    name: String,
    address: String,
    contactPerson: String,
    email: String,
    phone: String,
  },
  project: {           // Project details
      name: String,
      id: String,
      description: String,
  },
  items: [itemSchema], // Array of items
  summary: {           // Invoice totals
    subtotal: Number,
    tax: Number,
    total: Number,
  },
  paymentStatus: {     // Payment status
    type: String,
    default: 'Pending',
  },
  createdAt: {         // Invoice creation timestamp
    type: Date,
    default: Date.now,
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
