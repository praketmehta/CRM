import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Mail, Phone, Plus } from 'lucide-react';
import api from '../api/axiosConfig';

const TaskManager = ({ isDarkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'To-Do', dueDate: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      fetchTasks();
      setShowModal(false);
      setNewTask({ title: '', description: '', type: 'To-Do', dueDate: '' });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Call': return <Phone size={16} color="#3B82F6" style={{ marginRight: '8px' }} />;
      case 'Email': return <Mail size={16} color="#3B82F6" style={{ marginRight: '8px' }} />;
      case 'Meeting': return <Clock size={16} color="#3B82F6" style={{ marginRight: '8px' }} />;
      default: return <CheckCircle size={16} color="#FF991F" style={{ marginRight: '8px' }} />;
    }
  };

  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const borderCol = isDarkMode ? '#555555' : '#cccccc';
  const cardBg = isDarkMode ? '#222222' : 'white';
  const hoverBg = isDarkMode ? '#2d2d2d' : '#F0F4F8';
  const inputBg = isDarkMode ? '#1E293B' : '#ffffff';

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderRadius: '50px' }}>
        <h2 style={{ color: textMain, margin: 0, fontSize: '24px' }}>Task Manager</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#ffffff', color: '#3B82F6', padding: '10px 18px',
            borderRadius: '20px', border: 'none', cursor: 'pointer', bordercolor: '#3B82F6',
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Task List */}
      <div style={{
        backgroundColor: cardBg, borderRadius: '16px',
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden', border: `1px solid ${borderCol}`
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: textMuted }}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: textMuted }}>No tasks found. Create one to get started!</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.map((task, index) => (
              <li
                key={task._id}
                style={{
                  display: 'flex', alignItems: 'flex-start', padding: '20px',
                  borderBottom: index !== tasks.length - 1 ? `1px solid ${borderCol}` : 'none',
                  backgroundColor: task.status === 'Completed' ? hoverBg : 'transparent',
                  opacity: task.status === 'Completed' ? 0.7 : 1,
                  transition: 'background-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleTaskStatus(task._id, task.status)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '2px 15px 0 0', display: 'flex', alignItems: 'center'
                  }}
                >
                  {task.status === 'Completed' ? (
                    <CheckCircle size={24} color="#3B82F6" />
                  ) : (
                    <Circle size={24} color={textMuted} />
                  )}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    {getIcon(task.type)}
                    <span style={{
                      fontWeight: 'bold', fontSize: '16px', color: textMain,
                      textDecoration: task.status === 'Completed' ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </span>
                  </div>

                  {task.description && (
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: textMuted, lineHeight: '1.4' }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: textMuted, fontWeight: '500' }}>
                    {task.dueDate && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.assignedTo && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👤 Assigned to: {task.assignedTo.name || 'You'}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="responsive-modal" style={{ backgroundColor: cardBg, padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 20px 0', color: textMain, fontSize: '20px' }}>Create New Task</h3>

            <form onSubmit={createTask}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: textMuted }}>Title</label>
                <input
                  required
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '20px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: textMuted }}>Type</label>
                <select
                  value={newTask.type}
                  onChange={e => setNewTask({ ...newTask, type: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '20px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, boxSizing: 'border-box' }}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: textMuted }}>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '20px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: textMuted }}>Description</label>
                <textarea
                  rows="3"
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '20px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, boxSizing: 'border-box', resize: 'vertical' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 15px', background: 'transparent', border: `1px solid ${borderCol}`, borderRadius: '20px', cursor: 'pointer', color: textMain, fontWeight: 'bold' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
