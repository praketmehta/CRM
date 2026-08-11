const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_crm_key_123';

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/crm_db');
  const user = await User.findOne({ workspace: { $exists: true } });
  if(!user) return console.log("No valid users found");

  const token = jwt.sign(
    { 
      userId: user._id.toString(),
      workspaceId: user.workspace.toString(), 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '1d' }
  );

  const contactsRes = await fetch('http://localhost:3000/contacts', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const contactsData = await contactsRes.json();
  if (!contactsData || contactsData.length === 0) return console.log("No contacts");
  
  const contactId = contactsData[0]._id;
  
  const res = await fetch(`http://localhost:3000/contacts/${contactId}/email`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ subject: 'Test Subject', message: 'Test Message' })
  });
  
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
  process.exit(0);
}
test();
