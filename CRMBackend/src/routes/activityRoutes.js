const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, activityController.createActivity);
router.get('/', authenticate, activityController.getActivities);

module.exports = router;
