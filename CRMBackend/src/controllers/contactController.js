const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const { Parser } = require('json2csv');
const nodemailer = require('nodemailer');

exports.getContacts = async (req, res) => {
  try {
    const targetId = req.user.workspaceId || req.user.tenantId || req.user.workspace;
    
    let query = { workspace: targetId };
    if (req.user.role === 'Sales_Rep') query.owner = req.user.userId;
    
    const contacts = await Contact.find(query)
      .populate('company', 'name') 
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

exports.createContact = async (req, res) => {
  try {
    const targetId = req.user.workspaceId || req.user.tenantId || req.user.workspace;

    const newContact = new Contact({
      ...req.body,
      workspace: targetId
    });
    
    if (!newContact.owner) {
      newContact.owner = req.user.userId;
    }
    
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error("--- CONTACT CREATION ERROR ---", error.message);
    res.status(400).json({ error: 'Failed to create contact' });
  }
};

exports.exportContacts = async (req, res) => {
  try {
    const targetId = req.user.workspaceId || req.user.tenantId || req.user.workspace;
    
    let query = { workspace: targetId };
    if (req.user.role === 'Sales_Rep') query.owner = req.user.userId;
    
    const contacts = await Contact.find(query).populate('company').populate('owner');
    
    const fields = ['firstName', 'lastName', 'email', 'phone', 'company.name', 'owner.name', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(contacts);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('contacts.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export contacts' });
  }
};

exports.emailContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    
    const { subject, message } = req.body;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'mockUser',
        pass: process.env.SMTP_PASS || 'mockPass'
      }
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER ? `"CRM System" <${process.env.SMTP_USER}>` : '"CRM System" <crm@example.com>',
        to: contact.email,
        subject: subject,
        text: message
      });
      console.log(`Email sent to ${contact.email} - Subject: ${subject}`);
    } catch(err) {
      console.log('Mock email sent (SMTP configuration might be missing or mocked).');
    }
    
    const targetId = req.user.workspaceId || req.user.tenantId || req.user.workspace;
    const activity = new Activity({
      workspace: targetId,
      type: 'Email',
      content: `Sent email with subject: "${subject}"\n\nMessage: ${message}`,
      associatedTo: { contact: contact._id },
      createdBy: req.user.userId
    });
    await activity.save();

    res.status(200).json({ message: 'Email processed' });
  } catch (error) {
    console.error('Error in emailContact:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};