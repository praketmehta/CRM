const Ticket = require('../models/Ticket');

exports.getTickets = async (req, res) => {
  try {
    const targetId = req.user?.workspace || req.user?.workspaceId || req.user?.tenantId;
    
    if (!targetId) {
      return res.status(401).json({ error: "Unauthorized: No workspace ID found." });
    }

    let query = { workspace: targetId };
    if (req.user.role === 'Sales_Rep') query.owner = req.user.userId;

    const tickets = await Ticket.find(query)
      .populate('company')
      .sort({ createdAt: -1 });
      
    res.status(200).json(tickets);
  } catch (error) {
    console.error("--- TICKET FETCH ERROR ---", error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const targetId = req.user?.workspace || req.user?.workspaceId || req.user?.tenantId;
    
    const newTicket = new Ticket({
      title: req.body.title,
      company: req.body.company,
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'New',
      workspace: targetId,
      owner: req.user.userId
    });
    
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("--- TICKET CREATE ERROR ---", error);
    res.status(400).json({ error: error.message }); // Send back the actual validation error
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update ticket' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete ticket' });
  }
};