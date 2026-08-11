const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  workspace: { type: String, required: true, index: true },
  
  type: { 
    type: String, 
    enum: ['Note', 'Email', 'Call', 'Meeting', 'Stage_Change', 'Task_Completed', 'System_Update'],
    required: true
  },
  
  content: { type: String, required: true },
  
  associatedTo: {
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
  },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
