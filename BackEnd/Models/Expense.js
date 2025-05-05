const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: String,
  amount: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fundingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Funding' }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
