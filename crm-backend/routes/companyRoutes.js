const express = require('express');
const router = express.Router();
const companyController = require('../controller/company_controller');

router.post('/add', companyController.addCompany);
router.get('/list', companyController.getCompanies);
router.get('/delete', companyController.deleteCompany);

module.exports = router;
