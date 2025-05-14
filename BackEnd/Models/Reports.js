const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  abstract: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  methodology: [{ type: String }],
  pi: { type: String, required: true },
  institution: { type: String, required: true },
  collaborators: [{ type: String }],
  visibility: { type: String, required: true, enum: ['published'] },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true }, // Link to original project
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('reports', reportSchema);
