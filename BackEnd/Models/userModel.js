const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  providerId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    default: null,
    unique: true,
  },  
  role: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('users', userSchema);
