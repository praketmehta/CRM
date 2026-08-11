const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, companyController.getCompanies);
router.post('/', authenticate, companyController.createCompany);
router.get('/:id', authenticate, companyController.getCompanyById);
router.put('/:id', authenticate, companyController.updateCompany);
router.delete('/:id', authenticate, companyController.deleteCompany);

module.exports = router;