require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const agenda = require('./src/services/agenda');
const companyRoutes = require('./src/routes/companyRoutes');
const app = express();
const ticketRoutes = require('./src/routes/ticketRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

app.use(cors());
app.use(express.json()); 

const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

const authRoutes = require('./src/routes/authRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const dealRoutes = require('./src/routes/dealRoutes');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);
app.use('/deals', dealRoutes);
app.use('/tickets', ticketRoutes);
app.use('/activities', activityRoutes);
app.use('/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected.'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

agenda.start().then(() => console.log('✅ MongoDB Automation Queue started.'));
app.use('/companies', companyRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 MERN Server running at http://localhost:${PORT}`);
});