const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

mongoose.connect('mongodb://localhost:27017/crm_db').then(async () => {
  const user = await User.findOne({ email: 'praketmehta05@gmail.com' });
  
  try {
    const newTask = new Task({
      title: "Hello",
      type: "To-Do",
      dueDate: "2026-08-08",
      description: "task 1",
      workspace: user.workspace,
      assignedTo: undefined // simulating req.user._id which is undefined
    });
    await newTask.save();
    console.log("Task created successfully!");
  } catch (e) {
    console.error("Task creation failed:", e.message);
  }
  
  process.exit(0);
});
