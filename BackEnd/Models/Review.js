const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  reviewerName: { type: String },
  reviewText: { type: String, required: true }, // <-- replaced comment
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
