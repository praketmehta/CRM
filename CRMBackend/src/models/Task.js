const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  workspace: { type: String, required: true, index: true },
  
  title: { type: String, required: true },
  description: { type: String },
  
  type: { 
    type: String, 
    enum: ['Call', 'Email', 'To-Do', 'Meeting'],
    default: 'To-Do'
  },
  
  status: { 
    type: String, 
    enum: ['Pending', 'In_Progress', 'Completed', 'Deferred'],
    default: 'Pending'
  },
  
  dueDate: { type: Date },
  
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  associatedTo: {
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
