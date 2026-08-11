const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const user = await User.findOne({ email: 'praketmehta05@gmail.com' });
  console.log("Admin User:", user);
  process.exit(0);
});
