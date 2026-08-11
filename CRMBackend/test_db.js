const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const indexes = await mongoose.connection.collection('companies').indexes();
  console.log(JSON.stringify(indexes, null, 2));
  process.exit(0);
});
