const mongoose = require('mongoose');

const FundingRequirementSchema = new mongoose.Schema({
  category: String,
  plannedBudget: Number,
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fundingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Funding' }
});

module.exports = mongoose.model('FundingRequirement', FundingRequirementSchema);


