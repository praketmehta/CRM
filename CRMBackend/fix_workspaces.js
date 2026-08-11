const mongoose = require('mongoose');
const User = require('./src/models/User');
const Deal = require('./src/models/Deal');
const Contact = require('./src/models/Contact');
const Company = require('./src/models/Company');
const Ticket = require('./src/models/Ticket');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  try {
    const admin = await User.findOne({ email: 'praketmehta05@gmail.com' });
    const adminWorkspaceId = admin.workspace;
    console.log("Admin Workspace ID:", adminWorkspaceId);
    
    const r1 = await User.updateMany({}, { $set: { workspace: adminWorkspaceId } });
    const r2 = await Deal.updateMany({}, { $set: { workspace: adminWorkspaceId } });
    const r3 = await Contact.updateMany({}, { $set: { workspace: adminWorkspaceId } });
    const r4 = await Company.updateMany({}, { $set: { workspace: adminWorkspaceId } });
    const r5 = await Ticket.updateMany({}, { $set: { workspace: adminWorkspaceId } });
    
    console.log("Updated Users:", r1.modifiedCount);
    console.log("Updated Deals:", r2.modifiedCount);
    console.log("Updated Contacts:", r3.modifiedCount);
    console.log("Updated Companies:", r4.modifiedCount);
    console.log("Updated Tickets:", r5.modifiedCount);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
});
