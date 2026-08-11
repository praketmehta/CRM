const Company = require('../models/Company');

exports.getCompanies = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;    
    let query = { workspace: targetId };
    
    if (req.user.role === 'Sales_Rep') {
      query.owner = req.user.userId;
    }
    
    const companies = await Company.find(query).sort({ name: 1 });
    
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};
exports.createCompany = async (req, res) => {
  try {
const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    if (!targetId) {
      return res.status(400).json({ error: "No workspace or tenant ID found in token." });
    }

    console.log("DEBUG createCompany req.body:", req.body);
    const newCompany = new Company({
      ...req.body,
      workspace: targetId,
      owner: req.body.owner || req.user.userId 
    });
    
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error("--- MONGOOSE ERROR IN CONTROLLER ---", error.message);
    res.status(400).json({ error: 'Failed to create company', details: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    const company = await Company.findOne({ _id: req.params.id, workspace: targetId })
      .populate('contacts')
      .populate('deals')
      .populate('tickets')
      .populate('owner', 'name email');
      
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    const updatedCompany = await Company.findOneAndUpdate(
      { _id: req.params.id, workspace: targetId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedCompany) return res.status(404).json({ error: 'Company not found' });
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update company' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    const deletedCompany = await Company.findOneAndDelete({ _id: req.params.id, workspace: targetId });
    if (!deletedCompany) return res.status(404).json({ error: 'Company not found' });
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete company' });
  }
};