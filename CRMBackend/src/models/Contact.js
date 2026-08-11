const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  workspace: { type: String, required: true, index: true }, 

  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String },
  
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  customFields: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);