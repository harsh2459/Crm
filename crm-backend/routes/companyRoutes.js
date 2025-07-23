const express = require('express');
const router = express.Router();
const companyController = require('../controller/company_controller');
const { verifyToken } = require('../middleware/auth');

router.post('/add',  companyController.addCompany);
router.get('/list', companyController.getCompanies);
router.get('/delete', verifyToken, companyController.deleteCompany);

module.exports = router;
