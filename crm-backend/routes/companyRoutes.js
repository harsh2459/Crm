const express = require('express');
const router = express.Router();
const companyController = require('../controller/company_controller');

// use http://localhost:5000/api/...

router.post('/company_add', companyController.addCompany);
router.get('/company_list', companyController.getCompanies);
router.get('/comany_delete', companyController.deleteCompany);

module.exports = router;
