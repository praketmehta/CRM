const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  workspace: { type: String, required: true, index: true },

  title: { type: String, required: true },
  value: { type: Number, required: true },
  stage: { type: String, default: 'Lead' },
  
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  attachments: [{
    name: { type: String },
    url: { type: String },
    type: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }]
  
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);