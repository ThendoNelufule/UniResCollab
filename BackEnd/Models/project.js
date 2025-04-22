const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Fix here

  // Core Setup
  title: { type: String, required: true, minlength: 10 },
  domain: { 
    type: String, 
    required: true, 
    enum: [
      'Information Technology', 
      'Geology', 
      'Actuary', 
      'Medicine', 
      'Pharmacy', 
      'Dental', 
      'Radiology', 
      'Mining', 
      'Chemical',
      'Electrical',
      'Mechanical',
      'Civil'
    ]
  },
  abstract: { type: String, required: true, minlength: 10, maxlength: 2000 },

  // Timeline
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  // Methodology
  methodology: [{ type: String, enum: [
    'experimental',
    'computational',
    'fieldwork',
    'clinical',
    'archival',
    'survey'
  ]}],

  // Collaboration
  pi: { type: String, required: true },
  institution: { type: String, required: true },

  // Visibility options
  visibility: { 
    type: String, 
    required: true, 
    enum: ['private', 'institutional', 'public', 'embargoed'] 
  },

  // Optional fields
  ethics: { type: String },
  dataPolicy: { type: String },
  collaborators: [{ type: String }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('projects', projectSchema);
