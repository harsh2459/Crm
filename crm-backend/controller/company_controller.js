const Company = require('../model/company');

exports.addCompany = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const exists = await Company.findOne({ name });
        if (exists) {
            return res.status(400).json({ error: 'Company already exists' });
        }

        const newCompany = new Company({ name });
        await newCompany.save();

        res.status(201).json({ message: 'Company added', company: newCompany });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const { name } = req.params;

        const company = await Company.findOneAndDelete({ name });
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.status(200).json({ message: 'Company deleted', company });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
