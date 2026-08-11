const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  // First, set everyone to Sales_Rep
  const res1 = await User.updateMany({}, { $set: { role: 'Sales_Rep' } });
  console.log(`Updated ${res1.modifiedCount} users to Sales_Rep.`);
  
  // Then, set praketmehta05@gmail.com to Admin
  const res2 = await User.updateOne({ email: 'praketmehta05@gmail.com' }, { $set: { role: 'Admin' } });
  console.log(`Updated ${res2.modifiedCount} user to Admin.`);
  
  process.exit(0);
});
