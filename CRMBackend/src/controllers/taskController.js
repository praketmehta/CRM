const Task = require('../models/Task');
const Activity = require('../models/Activity');

exports.createTask = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    
    const newTask = new Task({
      ...req.body,
      workspace: targetId,
      assignedTo: req.body.assignedTo || req.user.userId
    });
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    const query = { workspace: targetId };
    
    if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;
    if (req.query.status) query.status = req.query.status;
    
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('associatedTo.contact')
      .populate('associatedTo.deal')
      .sort({ dueDate: 1, createdAt: -1 });
      
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    
    const oldTask = await Task.findOne({ _id: req.params.id, workspace: targetId });
    if (!oldTask) return res.status(404).json({ error: 'Task not found' });
    
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, workspace: targetId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (req.body.status === 'Completed' && oldTask.status !== 'Completed') {
      const activity = new Activity({
        workspace: targetId,
        type: 'Task_Completed',
        content: `Task completed: ${updatedTask.title}`,
        associatedTo: updatedTask.associatedTo,
        createdBy: req.user.userId
      });
      await activity.save();
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const targetId = req.user.workspace || req.user.workspaceId || req.user.tenantId;
    await Task.findOneAndDelete({ _id: req.params.id, workspace: targetId });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
};
