const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const collInfos = await mongoose.connection.db.listCollections({ name: 'companies' }).toArray();
  console.log(JSON.stringify(collInfos, null, 2));
  process.exit(0);
});
