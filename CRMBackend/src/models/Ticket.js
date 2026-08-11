const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: 'New' },
  priority: { type: String, default: 'Medium' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  workspace: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);