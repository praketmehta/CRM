const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  try {
    const res1 = await User.updateMany(
      { email: { $ne: 'praketmehta05@gmail.com' } }, 
      { $set: { role: 'Sales_Rep' } }
    );
    console.log('Updated to Sales_Rep:', res1);
    
    const res2 = await User.updateOne(
      { email: 'praketmehta05@gmail.com' }, 
      { $set: { role: 'Admin' } }
    );
    console.log('Updated praket to Admin:', res2);
    
    const users = await User.find({}, 'email role');
    console.log('Current users:', users);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
});
