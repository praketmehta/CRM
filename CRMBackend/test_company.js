const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: '5f9f1b9b9c9d9e0017a1b1a1', workspaceId: '5f9f1b9b9c9d9e0017a1b1a1' }, 'super_secret_crm_key_for_local_dev_only');

fetch('http://127.0.0.1:3000/companies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ name: 'Test Company' })
})
.then(res => res.text().then(text => ({ status: res.status, text })))
.then(console.log)
.catch(console.error);
