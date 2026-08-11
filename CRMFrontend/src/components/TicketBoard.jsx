import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function TicketBoard({ isDarkMode, userRole }) {
  const [tickets, setTickets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', company: '', priority: 'Medium', status: 'New' });
  const [activeColumn, setActiveColumn] = useState(null);

  const statuses = ['New', 'In Progress', 'Waiting on Customer', 'Closed'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes] = await Promise.all([
        api.get('/companies').catch(() => ({ data: [] }))
      ]);
      setCompanies(companiesRes.data);

      try {
        const ticketsRes = await api.get('/tickets');
        setTickets(ticketsRes.data);
      } catch (err) {
        console.error("Tickets failed to load, but companies are ready.");
      }
    } catch (error) {
      console.error("Critical error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ticketData = {
      title: formData.title,
      company: formData.company,
      priority: formData.priority,
      status: 'New'
    };

    try {
      await api.post('/tickets', ticketData);
      fetchData();
      setFormData({ title: '', company: '', priority: 'Medium', status: 'New' });
      setShowForm(false);
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      alert("Failed to add ticket. Check console for details.");
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert("Error updating ticket status.");
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this support ticket?")) return;
    try {
      await api.delete(`/tickets/${ticketId}`);
      setTickets(tickets.filter(t => t._id !== ticketId));
    } catch (error) {
      alert("Error deleting ticket.");
    }
  };

  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData("text/plain", ticketId);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    if (activeColumn !== status) setActiveColumn(status);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveColumn(null);
    const ticketId = e.dataTransfer.getData("text/plain");
    if (!ticketId) return;
    await handleStatusChange(ticketId, targetStatus);
  };

  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const borderCol = isDarkMode ? '#1E293B' : '#ccc';
  const inputBg = isDarkMode ? '#1E293B' : 'white';
  const cardBg = isDarkMode ? '#222222' : 'white';
  const formBg = isDarkMode ? '#2d2d2d' : '#F0F4F8';

  const getPriorityStyle = (priority) => {
    if (priority === 'Urgent') return { bg: isDarkMode ? '#4a1515' : '#ffebe6', color: isDarkMode ? '#ff9980' : '#bf2600' };
    if (priority === 'High') return { bg: isDarkMode ? '#4a3300' : '#fffae6', color: isDarkMode ? '#ffcc66' : '#ff8b00' };
    return { bg: isDarkMode ? '#003322' : '#DBEAFE', color: isDarkMode ? '#66ffcc' : '#3B82F6' };
  };

  if (loading) return <p style={{ color: textMain }}>Loading Service Hub...</p>;

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', backgroundColor: cardBg, padding: '15px',
        borderRadius: '16px', boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ margin: 0, color: textMain, display: 'none' }}>Service Hub</h2>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: showForm ? '#ff5630' : '#3B82F6', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showForm ? 'Cancel' : '+ New Ticket'}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: formBg, padding: '20px', borderRadius: '16px',
          marginBottom: '20px', boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}>
          <form onSubmit={handleSubmit} className="responsive-flex-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
            <div className="responsive-form-item" style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Issue / Ticket Title</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ padding: '10px', height: '42px', borderRadius: '16px', border: `1px solid ${borderCol}`, width: '100%', boxSizing: 'border-box', backgroundColor: inputBg, color: textMain }} />
            </div>
            <div className="responsive-form-item" style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Company</label>
              <select
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={{
                  padding: '10px', height: '42px', borderRadius: '16px',
                  border: `1px solid ${borderCol}`, width: '100%', boxSizing: 'border-box',
                  backgroundColor: inputBg, color: textMain, fontSize: '14px'
                }}
              >
                <option value="" disabled>Select a company...</option>
                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="responsive-form-item" style={{ flex: 1, minWidth: '120px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={{ padding: '10px', height: '42px', borderRadius: '16px', border: `1px solid ${borderCol}`, width: '100%', boxSizing: 'border-box', backgroundColor: inputBg, color: textMain, fontSize: '14px' }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <button type="submit" className="responsive-form-item" style={{ padding: '11px 25px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', height: '42px' }}>
              Save Ticket
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
        {statuses.map((status) => {
          const colTickets = tickets.filter(t => t.status === status);
          const isHovered = activeColumn === status;

          return (
            <div key={status} onDragOver={(e) => handleDragOver(e, status)} onDrop={(e) => handleDrop(e, status)} onDragLeave={() => setActiveColumn(null)}
              style={{
                flex: '1', minWidth: '260px',
                backgroundColor: isHovered ? (isDarkMode ? '#2a3b52' : '#e2e4e9') : (isDarkMode ? '#1E293B' : '#F0F4F8'),
                borderRadius: '16px', padding: '15px', transition: 'all 0.3s ease'
              }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: isDarkMode ? 'white' : '#1E293B' }}>{status} ({colTickets.length})</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
                {colTickets.map(ticket => {
                  const styleProps = getPriorityStyle(ticket.priority);

                  return (
                    <div key={ticket._id} draggable onDragStart={(e) => handleDragStart(e, ticket._id)}
                      style={{
                        backgroundColor: cardBg, padding: '15px', borderRadius: '20px',
                        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.12)',
                        position: 'relative', cursor: 'grab', transition: 'all 0.2s ease'
                      }}>

                      {userRole === 'admin' && (
                        <button onClick={() => handleDelete(ticket._id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#de350b', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                      )}

                      <strong style={{ display: 'block', marginBottom: '5px', color: textMain }}>{ticket.title}</strong>

                      <div style={{ fontSize: '13px', color: textMuted, marginBottom: '12px' }}>
                        🏢 {ticket.company?.name || 'Unknown'}
                      </div>

                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', backgroundColor: styleProps.bg, color: styleProps.color }}>
                        {ticket.priority}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}