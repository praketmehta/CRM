import { useState } from 'react';
import api from '../api/axiosConfig';
import jsPDF from 'jspdf';
import ActivityTimeline from './ActivityTimeline';

export default function DealModal({ deal, onClose, onRefresh, isDarkMode, userRole }) {
  const [activeTab, setActiveTab] = useState('details');

  const [owner, setOwner] = useState(deal.owner?._id || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      const payload = {};
      if (owner) payload.owner = owner;

      await api.put(`/deals/${deal._id}`, payload);
      onRefresh();
    } catch (error) {
      alert("Failed to update deal details.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      await api.post(`/deals/${deal._id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File uploaded successfully!');
      onRefresh();
    } catch (error) {
      alert('Failed to upload file.');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Deal Quote: ${deal.title}`, 20, 20);

    doc.setFontSize(14);
    doc.text(`Company: ${deal.company?.name || 'Unknown'}`, 20, 35);
    doc.text(`Value: $${Number(deal.value).toLocaleString()}`, 20, 45);
    doc.text(`Stage: ${deal.stage}`, 20, 55);
    doc.text(`Owner: ${deal.owner?.email === 'praketmehta05@gmail.com' ? 'ADMIN' : (deal.owner?.name || 'Unassigned')}`, 20, 65);
    doc.text(`Created: ${new Date(deal.createdAt).toLocaleDateString()}`, 20, 75);

    doc.save(`${deal.title.replace(/\s+/g, '_')}_Quote.pdf`);
  };

  const bg = isDarkMode ? '#222222' : '#ffffff';
  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const borderCol = isDarkMode ? '#1E293B' : '#F0F4F8';
  const inputBg = isDarkMode ? '#1E293B' : '#fafbfc';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }}>
      <div className="responsive-modal" style={{
        backgroundColor: bg,
        width: '90%', maxWidth: '600px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        maxHeight: '85vh'
      }}>

        <div style={{ padding: '20px 25px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: textMain, fontSize: '22px' }}>{deal.title}</h2>
            <div style={{ color: textMuted, fontSize: '13px', marginTop: '5px' }}>
              🏢 {deal.company?.name || 'Unknown Company'}  •  💰 ${Number(deal.value).toLocaleString()}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', color: textMuted, cursor: 'pointer' }}>×</button>
        </div>

        <div className="responsive-nav-tabs" style={{ display: 'flex', borderBottom: `1px solid ${borderCol}`, padding: '0 25px', backgroundColor: isDarkMode ? '#2d2d2d' : '#F0F4F8' }}>
          {['details', 'notes', 'documents', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px', background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: 'bold', textTransform: 'capitalize',
                color: activeTab === tab ? (isDarkMode ? '#60a5fa' : '#3B82F6') : textMuted,
                borderBottom: activeTab === tab ? `3px solid ${isDarkMode ? '#60a5fa' : '#3B82F6'}` : '3px solid transparent',
                marginBottom: '-1px', transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '25px', overflowY: 'auto', flex: 1, minHeight: '300px' }}>

          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: textMuted, marginBottom: '8px' }}>Current Stage</label>
                <div style={{ display: 'inline-block', backgroundColor: isDarkMode ? '#1E293B' : '#F0F4F8', padding: '6px 12px', borderRadius: '16px', fontWeight: 'bold', color: textMain }}>
                  {deal.stage}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: textMuted, marginBottom: '8px' }}>Owner ID</label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Enter User ObjectId"
                  style={{ width: '100%', padding: '10px', borderRadius: '20px', border: `1px solid ${borderCol}`, backgroundColor: inputBg, color: textMain }}
                />
                <p style={{ fontSize: '11px', color: textMuted, marginTop: '4px' }}>
                  Current Owner: {deal.owner?.email === 'praketmehta05@gmail.com' ? 'ADMIN' : (deal.owner?.name || 'Unassigned')}
                </p>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button
                  onClick={handleSaveDetails}
                  disabled={isSaving}
                  style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#3B82F6', color: 'white', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {isSaving ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ padding: '20px', textAlign: 'center', color: textMuted }}>
              <p>Notes are now part of the Universal Activity Timeline.</p>
              <p>Please check the "Activity" tab.</p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '20px', padding: '20px', border: `2px dashed ${borderCol}`, borderRadius: '16px', textAlign: 'center', backgroundColor: inputBg }}>
                <p style={{ color: textMuted, marginBottom: '10px' }}>Drag & drop a file here, or click to upload.</p>
                <input type="file" onChange={handleFileUpload} style={{ color: textMain }} />
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', color: textMain }}>Attached Files</h4>
                {(!deal.attachments || deal.attachments.length === 0) ? (
                  <p style={{ color: textMuted, fontSize: '13px', fontStyle: 'italic' }}>No files attached yet.</p>
                ) : (
                  deal.attachments.map((file, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginBottom: '10px', backgroundColor: inputBg, borderRadius: '20px', border: `1px solid ${borderCol}` }}>
                      <span style={{ fontSize: '13px', color: textMain }}>📄 {file.name}</span>
                      <a href={`http://localhost:3000${file.url}`} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#3B82F6', textDecoration: 'none', fontWeight: 'bold' }}>Download</a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{ height: '100%', overflowY: 'auto' }}>
              <ActivityTimeline entityType="dealId" entityId={deal._id} />
            </div>
          )}
        </div>

        <div className="responsive-header" style={{ padding: '15px 25px', borderTop: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', backgroundColor: isDarkMode ? '#2d2d2d' : '#fafbfc' }}>
          <button onClick={generatePDF} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
            Export PDF Quote
          </button>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: 'transparent', color: textMuted, cursor: 'pointer', fontWeight: 'bold' }}>
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}