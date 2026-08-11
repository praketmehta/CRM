const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const res = await User.updateMany({}, { $set: { role: 'Admin' } });
  console.log(`Updated ${res.modifiedCount} users to Admin.`);
  process.exit(0);
});
