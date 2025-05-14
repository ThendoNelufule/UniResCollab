const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
