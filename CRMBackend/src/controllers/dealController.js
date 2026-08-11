const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const { Parser } = require('json2csv');

exports.getDeals = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    
    let query = { workspace: targetId };
    if (req.user.role === 'Sales_Rep') query.owner = req.user.userId;
    
    const deals = await Deal.find(query)
      .populate('company')
      .populate('owner', 'name email')
      .populate('contacts')
      .sort({ createdAt: -1 });
      
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
};

exports.createDeal = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;

    const newDeal = new Deal({
      ...req.body,
      workspace: targetId 
    });
    
    // If no owner is specified, default to the user creating it
    if (!newDeal.owner) {
      newDeal.owner = req.user.userId;
    }
    
    const savedDeal = await newDeal.save();
    res.status(201).json(savedDeal);
  } catch (error) {
    console.error("--- DEAL CREATION ERROR ---", error.message);
    res.status(400).json({ error: 'Failed to create deal' });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const targetId = req.user.workspaceId || req.user.tenantId || req.user.workspace;

    const oldDeal = await Deal.findOne({ _id: req.params.id, workspace: targetId });
    if (!oldDeal) return res.status(404).json({ error: 'Deal not found' });

    const updates = { ...req.body };

    const updatedDeal = await Deal.findOneAndUpdate(
      { _id: req.params.id, workspace: targetId },
      updates,
      { new: true }
    ).populate('company').populate('owner', 'name email').populate('contacts');
    
    if (updates.stage && updates.stage !== oldDeal.stage) {
      const activity = new Activity({
        workspace: targetId,
        type: 'Stage_Change',
        content: `Stage changed from ${oldDeal.stage} to ${updates.stage}`,
        associatedTo: { deal: updatedDeal._id },
        createdBy: req.user.userId
      });
      await activity.save();
    }
    
    if (updates.owner && updates.owner.toString() !== (oldDeal.owner ? oldDeal.owner.toString() : '')) {
      const activity = new Activity({
        workspace: targetId,
        type: 'System_Update',
        content: `Owner was updated`,
        associatedTo: { deal: updatedDeal._id },
        createdBy: req.user.userId
      });
      await activity.save();
    }
    
    res.status(200).json(updatedDeal);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update deal' });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const targetId = req.user.workspaceId || req.user.tenantId;

    await Deal.findOneAndDelete({ _id: req.params.id, workspace: targetId });
    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete deal' });
  }
};

exports.addDealNote = async (req, res) => {
  try {
    const targetId = req.user.workspaceId || req.user.tenantId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Note text is required." });
    }

    const activity = new Activity({
      workspace: targetId,
      type: 'Note',
      content: text,
      associatedTo: { deal: req.params.id },
      createdBy: req.user.userId
    });
    
    await activity.save();

    const deal = await Deal.findOne({ _id: req.params.id, workspace: targetId }).populate('company');
    res.status(200).json(deal); // Or return the activity
  } catch (error) {
    console.error("--- NOTE CREATION ERROR ---", error.message);
    res.status(500).json({ error: 'Failed to add note to deal' });
  }
};

exports.exportDeals = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    
    let query = { workspace: targetId };
    if (req.user.role === 'Sales_Rep') query.owner = req.user.userId;
    
    const deals = await Deal.find(query)
      .populate('company')
      .populate('owner', 'name email');
    
    const fields = ['title', 'value', 'stage', 'company.name', 'owner.name', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(deals);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('deals.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export deals' });
  }
};

exports.uploadDealFile = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const newAttachment = {
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype
    };

    const updatedDeal = await Deal.findOneAndUpdate(
      { _id: req.params.id, workspace: targetId },
      { 
        $push: { attachments: newAttachment }
      },
      { new: true }
    ).populate('company');
    
    const activity = new Activity({
      workspace: targetId,
      type: 'System_Update',
      content: `Uploaded file: ${req.file.originalname}`,
      associatedTo: { deal: updatedDeal._id },
      createdBy: req.user.userId
    });
    await activity.save();

    res.status(200).json(updatedDeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};