import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function ContactDirectory({ isDarkMode, userRole, onViewCompany }) {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: ''
  });
  const [emailModal, setEmailModal] = useState({ open: false, contactId: null, subject: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, companiesRes] = await Promise.all([
        api.get('/contacts'),
        api.get('/companies')
      ]);
      setContacts(contactsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company) return alert("Please select a company!");

    try {
      await api.post('/contacts', formData);
      fetchData();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '' });
      setShowForm(false);
    } catch (error) {
      alert("Failed to create contact.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/contacts/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to export contacts');
    }
  };

  const handleSendEmail = async () => {
    try {
      await api.post(`/contacts/${emailModal.contactId}/email`, {
        subject: emailModal.subject,
        message: emailModal.message
      });
      alert('Email queued successfully!');
      setEmailModal({ open: false, contactId: null, subject: '', message: '' });
    } catch (error) {
      alert('Failed to send email.');
    }
  };

  const filteredContacts = contacts.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company?.name && c.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const borderCol = isDarkMode ? '#555555' : '#cccccc';
  const inputBg = isDarkMode ? '#1E293B' : '#ffffff';
  const cardBg = isDarkMode ? '#222222' : 'white';
  const formBg = isDarkMode ? '#2d2d2d' : '#F0F4F8';

  if (loading) return <p style={{ color: textMain }}>Loading directory...</p>;

  return (
    <div>
      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: textMain, margin: 0, display: 'none' }}>Contact Directory</h2>

        <div className="responsive-flex-row" style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
          <input
            type="text"
            placeholder="🔍 Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', maxWidth: '250px', padding: '10px 15px', borderRadius: '16px',
              border: `1px solid ${borderCol}`, backgroundColor: inputBg,
              color: textMain, outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box'
            }}
          />

          <button
            onClick={handleExport}
            style={{
              padding: '10px 15px',
              backgroundColor: '#3B82F6',
              color: 'white', border: 'none', borderRadius: '16px',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
            Export CSV
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: showForm ? '#ff5630' : '#3B82F6',
              color: 'white', border: 'none', borderRadius: '16px',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
            {showForm ? 'Cancel' : '+ New Contact'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="responsive-flex-row" style={{
          backgroundColor: formBg, padding: '20px', borderRadius: '16px',
          marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap',
          alignItems: 'flex-end', transition: 'all 0.3s ease',
          boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div className="responsive-form-item">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>First Name</label>
            <input required type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={{ padding: '8px', borderRadius: '16px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div className="responsive-form-item">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Last Name</label>
            <input required type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={{ padding: '8px', borderRadius: '16px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div className="responsive-form-item">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Email</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ padding: '8px', borderRadius: '16px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div className="responsive-form-item">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Phone</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '8px', borderRadius: '16px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div className="responsive-form-item">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Company</label>
            <select required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ padding: '8px', borderRadius: '16px', border: `1px solid ${borderCol}`, width: '100%', maxWidth: '200px', backgroundColor: inputBg, color: textMain, boxSizing: 'border-box' }}>
              <option value="" disabled>Select a company...</option>
              {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="responsive-form-item" style={{ padding: '9px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}>Save Contact</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredContacts.map(contact => (
          <div key={contact._id} style={{
            backgroundColor: cardBg, padding: '20px', borderRadius: '16px',
            boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.12)',
            borderLeft: '4px solid #3B82F6', transition: 'all 0.3s ease'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: textMain }}>{contact.firstName} {contact.lastName}</h3>
            {contact.company && (
              <div
                onClick={() => onViewCompany(contact.company._id)}
                style={{ fontSize: '13px', color: '#3B82F6', marginBottom: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🏢 {contact.company.name}
              </div>
            )}
            {!contact.company && (
              <div style={{ fontSize: '13px', color: textMuted, marginBottom: '5px' }}>🏢 Unknown Company</div>
            )}
            <div style={{ fontSize: '13px', color: textMuted, marginBottom: '5px' }}>👤 Owner: {contact.owner?.name || 'Unassigned'}</div>
            <div style={{ fontSize: '13px', color: textMuted, marginBottom: '5px' }}>✉️ {contact.email}</div>
            <div style={{ fontSize: '13px', color: textMuted, marginBottom: '15px' }}>📞 {contact.phone || 'N/A'}</div>
            <button
              onClick={() => setEmailModal({ open: true, contactId: contact._id, subject: '', message: '' })}
              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✉️ Email Contact
            </button>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <p style={{ color: textMuted, gridColumn: '1 / -1' }}>No contacts found. Add one above!</p>
        )}
      </div>

      {emailModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="responsive-modal" style={{ backgroundColor: inputBg, padding: '25px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 15px 0', color: textMain }}>Send Email</h3>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Subject</label>
            <input
              type="text"
              value={emailModal.subject}
              onChange={(e) => setEmailModal({ ...emailModal, subject: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '16px', border: `1px solid ${borderCol}`, backgroundColor: formBg, color: textMain, boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: textMuted }}>Message</label>
            <textarea
              value={emailModal.message}
              onChange={(e) => setEmailModal({ ...emailModal, message: e.target.value })}
              rows={5}
              style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '16px', border: `1px solid ${borderCol}`, backgroundColor: formBg, color: textMain, boxSizing: 'border-box', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setEmailModal({ open: false, contactId: null, subject: '', message: '' })}
                style={{ padding: '8px 15px', background: 'transparent', border: `1px solid ${borderCol}`, borderRadius: '16px', cursor: 'pointer', color: textMain }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                style={{ padding: '8px 15px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}