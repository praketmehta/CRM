const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const users = await User.find({}, 'email role');
  console.log(users);
  process.exit(0);
});
