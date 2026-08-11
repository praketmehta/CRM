const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

router.get('/', authenticate, dealController.getDeals);
router.post('/', authenticate, dealController.createDeal);
router.get('/export', authenticate, dealController.exportDeals);
router.put('/:id', authenticate, dealController.updateDeal);
router.delete('/:id', authenticate, dealController.deleteDeal);

router.post('/:id/notes', authenticate, dealController.addDealNote);
router.post('/:id/upload', authenticate, upload.single('document'), dealController.uploadDealFile);

module.exports = router;