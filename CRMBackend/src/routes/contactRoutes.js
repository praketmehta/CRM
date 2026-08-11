const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, contactController.createContact);
router.get('/', authenticate, contactController.getContacts);
router.get('/export', authenticate, contactController.exportContacts);
router.post('/:id/email', authenticate, contactController.emailContact);

module.exports = router;