const Activity = require('../models/Activity');

exports.createActivity = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    
    const newActivity = new Activity({
      ...req.body,
      workspace: targetId,
      createdBy: req.user._id
    });
    
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create activity' });
  }
};

exports.getActivities = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    const query = { workspace: targetId };
    
    if (req.query.dealId) query['associatedTo.deal'] = req.query.dealId;
    if (req.query.contactId) query['associatedTo.contact'] = req.query.contactId;
    if (req.query.companyId) query['associatedTo.company'] = req.query.companyId;
    
    const activities = await Activity.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};
