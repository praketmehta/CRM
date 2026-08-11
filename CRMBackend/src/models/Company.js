const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  workspace: { type: String, required: true, index: true },
  
  name: { type: String, required: true },
  domain: { type: String }, 
  website: { type: String },
  industry: { type: String },
  phone: { type: String },
  city: { type: String },
  state: { type: String },
  
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

companySchema.virtual('contacts', {
  ref: 'Contact',
  localField: '_id',
  foreignField: 'company'
});

companySchema.virtual('deals', {
  ref: 'Deal',
  localField: '_id',
  foreignField: 'company'
});

companySchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'company'
});

companySchema.set('toJSON', { virtuals: true });
companySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Company', companySchema);