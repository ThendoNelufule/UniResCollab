const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String], 
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Here I am referencing to the Researcher who created the project
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Here I am listing all collaborators who are invited to work on the project
  }],
  isPublic: {
    type: Boolean,
    default: true // This is to indicate whether the project public or private
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('projects', projectSchema);
