const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const user = await User.findOne({ email: 'masterpraket05@gmail.com' });
  const token = jwt.sign(
    { 
      userId: user._id.toString(),
      workspaceId: user.workspace.toString(), 
      role: user.role 
    }, 
    'super_secret_crm_key_123', 
    { expiresIn: '1d' }
  );
  console.log("Token:", token);
  
  // Also try to create a task to see why it fails
  try {
    const newTask = new Task({
      title: "Hello",
      type: "To-Do",
      dueDate: "2026-08-08",
      description: "task 1",
      workspace: user.workspace.toString(),
      assignedTo: user._id.toString()
    });
    await newTask.save();
    console.log("Task created successfully!");
  } catch (e) {
    console.error("Task creation failed:", e);
  }
  
  process.exit(0);
});
