const mongoose = require('mongoose');

const fundingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  startDate: Date,
  endDate: Date,
  amountSpent: { type: Number, default: 0 }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
 
}, { timestamps: true });

module.exports = mongoose.model('Funding', fundingSchema);
