import React, { useState, useEffect } from 'react';
import { Building2, Globe, Phone, MapPin, ArrowLeft, Users, Briefcase, Ticket } from 'lucide-react';

const CompanyProfile = ({ id, onBack, isDarkMode, userRole }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/companies/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCompany(data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/companies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        onBack();
      } else {
        alert("Failed to delete company.");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company.");
    }
  };

  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const borderCol = isDarkMode ? '#555555' : '#cccccc';
  const cardBg = isDarkMode ? '#222222' : 'white';
  const hoverBg = isDarkMode ? '#2d2d2d' : '#F0F4F8';
  const tabActiveBg = isDarkMode ? '#1E293B' : '#ffffff';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: textMuted }}>Loading Company Hub...</div>;
  if (!company) return <div style={{ padding: '40px', textAlign: 'center', color: '#de350b' }}>Company not found.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={onBack} 
        style={{ 
          display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: 'bold', 
          color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '25px' 
        }}
      >
        <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
      </button>

      <div className="responsive-header" style={{ 
        backgroundColor: cardBg, borderRadius: '20px', padding: '30px', marginBottom: '30px', 
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${borderCol}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #c7d2fe',
            flexShrink: 0
          }}>
            <Building2 size={40} color="#4f46e5" />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: textMain, margin: '0 0 10px 0' }}>{company.name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: textMuted }}>
              {company.website && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Globe size={16} style={{ marginRight: '6px' }} /> 
                  <a href={`https://${company.website}`} target="_blank" rel="noreferrer" style={{ color: '#3B82F6', textDecoration: 'none' }}>{company.website}</a>
                </span>
              )}
              {company.phone && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ marginRight: '6px' }} /> {company.phone}
                </span>
              )}
              {(company.city || company.state) && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} style={{ marginRight: '6px' }} /> {[company.city, company.state].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {userRole === 'admin' && (
            <button onClick={handleDeleteCompany} style={{ 
              padding: '10px 20px', backgroundColor: isDarkMode ? '#2d0000' : '#fee2e2', border: `1px solid ${isDarkMode ? '#7f1d1d' : '#f87171'}`, 
              color: isDarkMode ? '#fca5a5' : '#b91c1c', borderRadius: '16px', fontWeight: '600', cursor: 'pointer' 
            }}>
              Delete Company
            </button>
          )}
          <button style={{ 
            padding: '10px 20px', backgroundColor: isDarkMode ? '#1E293B' : '#fff', border: `1px solid ${borderCol}`, 
            color: textMain, borderRadius: '16px', fontWeight: '600', cursor: 'pointer' 
          }}>
            Edit Details
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: cardBg, borderRadius: '20px', overflow: 'hidden',
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${borderCol}`
      }}>
        <div className="responsive-nav-tabs" style={{ display: 'flex', borderBottom: `1px solid ${borderCol}`, backgroundColor: isDarkMode ? '#1a1a1a' : '#f9fafb', padding: '10px 10px 0' }}>
          {[
            { id: 'contacts', label: 'Contacts', icon: Users, count: company.contacts?.length || 0 },
            { id: 'deals', label: 'Deals', icon: Briefcase, count: company.deals?.length || 0 },
            { id: 'tickets', label: 'Tickets', icon: Ticket, count: company.tickets?.length || 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', padding: '12px 24px', fontWeight: '600', fontSize: '14px',
                border: 'none', borderBottom: activeTab === tab.id ? '3px solid #3B82F6' : '3px solid transparent',
                backgroundColor: activeTab === tab.id ? tabActiveBg : 'transparent',
                color: activeTab === tab.id ? '#3B82F6' : textMuted,
                cursor: 'pointer', transition: 'all 0.2s',
                borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
              }}
            >
              <tab.icon size={16} style={{ marginRight: '8px' }} />
              {tab.label}
              <span style={{ 
                marginLeft: '10px', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', 
                backgroundColor: activeTab === tab.id ? '#e0e7ff' : (isDarkMode ? '#1E293B' : '#e5e7eb'),
                color: activeTab === tab.id ? '#3730a3' : (isDarkMode ? '#ddd' : '#374151')
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ padding: '30px', minHeight: '400px' }}>
          {activeTab === 'contacts' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {company.contacts?.length === 0 ? (
                <p style={{ color: textMuted, fontStyle: 'italic', gridColumn: '1 / -1', textAlign: 'center' }}>No contacts associated.</p>
              ) : (
                company.contacts?.map(contact => (
                  <div key={contact._id} style={{ 
                    border: `1px solid ${borderCol}`, padding: '20px', borderRadius: '20px', 
                    display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' 
                  }}>
                    <div style={{ 
                      width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e0e7ff', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold', fontSize: '18px', flexShrink: 0
                    }}>
                      {contact.firstName[0]}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: textMain, fontSize: '16px' }}>{contact.firstName} {contact.lastName}</h4>
                      <p style={{ margin: 0, color: textMuted, fontSize: '13px' }}>{contact.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'deals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {company.deals?.length === 0 ? (
                <p style={{ color: textMuted, fontStyle: 'italic', textAlign: 'center' }}>No deals associated.</p>
              ) : (
                company.deals?.map(deal => (
                  <div key={deal._id} style={{ 
                    border: `1px solid ${borderCol}`, padding: '20px', borderRadius: '20px', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' 
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: textMain, fontSize: '16px' }}>{deal.title}</h4>
                      <p style={{ margin: 0, color: textMuted, fontSize: '14px' }}>Value: ${deal.value.toLocaleString()}</p>
                    </div>
                    <span style={{ 
                      padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0369a1', 
                      borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #bae6fd' 
                    }}>
                      {deal.stage}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {company.tickets?.length === 0 ? (
                <p style={{ color: textMuted, fontStyle: 'italic', textAlign: 'center' }}>No support tickets associated.</p>
              ) : (
                company.tickets?.map(ticket => (
                  <div key={ticket._id} style={{ 
                    border: `1px solid ${borderCol}`, padding: '20px', borderRadius: '20px', backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: textMain, fontSize: '16px' }}>{ticket.title}</h4>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: ticket.status === 'Resolved' ? '#dcfce7' : '#ffedd5',
                        color: ticket.status === 'Resolved' ? '#166534' : '#9a3412'
                      }}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
