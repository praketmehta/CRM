const User = require('../models/User');
const Workspace = require('../models/Workspace');
const bcrypt = require('bcryptjs'); // used for hashing
const jwt = require('jsonwebtoken'); // used for creating tokens for pass

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_crm_key_123';

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    let targetWorkspaceId;
    const admin = await User.findOne({ email: 'praketmehta05@gmail.com' });
    if (admin && admin.workspace) {
      targetWorkspaceId = admin.workspace;
    } else {
      const newWorkspace = new Workspace({ name: `${name}'s Workspace` });
      await newWorkspace.save();
      targetWorkspaceId = newWorkspace._id;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      workspace: targetWorkspaceId,
      role: email === 'praketmehta05@gmail.com' ? 'Admin' : 'Sales_Rep'
    });
    await newUser.save();

    res.status(201).json({ message: 'Workspace and Account created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

   const token = jwt.sign(
      { 
        userId: user._id.toString(),
        workspaceId: user.workspace.toString(), 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.name = name;
    await user.save();
    
    res.status(200).json({ message: 'Profile updated', user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};