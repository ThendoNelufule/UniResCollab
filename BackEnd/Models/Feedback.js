const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
