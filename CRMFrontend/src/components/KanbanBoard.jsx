import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import DealModal from './DealModal';

export default function KanbanBoard({ isDarkMode, userRole }) {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', company: '', value: '', stage: 'Lead' });
  const [newCompanyName, setNewCompanyName] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeColumn, setActiveColumn] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [viewMode, setViewMode] = useState('board');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const stages = ['Lead', 'Contacted', 'Proposal', 'Won'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsRes, companiesRes] = await Promise.all([
        api.get('/deals'),
        api.get('/companies')
      ]);
      setDeals(dealsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/companies', { name: newCompanyName });
      setCompanies([...companies, response.data]);
      setNewCompanyName('');
      setShowCompanyForm(false);
      setFormData({...formData, company: response.data._id});
    } catch (error) {
      alert("Failed to create company.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company) return alert("Please select a company!");
    
    try {
      await api.post('/deals', formData);
      fetchData(); 
      setFormData({ title: '', company: '', value: '', stage: 'Lead' });
      setShowForm(false);
    } catch (error) {
      alert("Failed to add deal. (Did you select a company?)");
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/deals/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'deals.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to export deals');
    }
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      await api.put(`/deals/${dealId}`, { stage: newStage });
      fetchData(); 
    } catch (error) {
      alert("Error shifting deal stage.");
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/deals/${dealId}`);
      setDeals(deals.filter(deal => deal._id !== dealId));
    } catch (error) {
      alert("Error deleting deal.");
    }
  };

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData("text/plain", dealId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    if (activeColumn !== stage) setActiveColumn(stage);
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setActiveColumn(null);
    const dealId = e.dataTransfer.getData("text/plain");
    if (!dealId) return;
    await handleStageChange(dealId, targetStage);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (deal.company?.name && deal.company.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesFilter = true;
    if (activeFilter === 'Leads') matchesFilter = deal.stage === 'Lead';
    if (activeFilter === 'High Value') matchesFilter = Number(deal.value) >= 5000;
    if (activeFilter === 'Won') matchesFilter = deal.stage === 'Won';

    return matchesSearch && matchesFilter;
  });

  const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
  const totalWonValue = filteredDeals.filter(d => d.stage === 'Won').reduce((sum, d) => sum + Number(d.value || 0), 0);

  if (loading) return <p style={{ color: isDarkMode ? 'white' : 'black' }}>Loading workspace...</p>;

  return (
    <div>
      {selectedDeal && (
        <DealModal 
          deal={selectedDeal} 
          onClose={() => setSelectedDeal(null)} 
          onRefresh={() => { fetchData(); setSelectedDeal(null); }}
          isDarkMode={isDarkMode} 
          userRole={userRole} 
        />
      )}

      <div className="responsive-flex-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: '1', backgroundColor: isDarkMode ? '#2d2d2d' : '#F0F4F8', padding: '15px 20px', borderRadius: '20px', borderLeft: '5px solid #3B82F6', transition: 'all 0.3s ease' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', color: isDarkMode ? '#aaa' : '#5e6c84', fontWeight: 'bold' }}>Total Pipeline</span>
          <h2 style={{ margin: '5px 0 0 0', color: isDarkMode ? '#ffffff' : '#1E293B' }}>${totalPipelineValue.toLocaleString()}</h2>
        </div>
        <div style={{ flex: '1', backgroundColor: isDarkMode ? '#1E3A8A' : '#DBEAFE', padding: '15px 20px', borderRadius: '20px', borderLeft: '5px solid #3B82F6', transition: 'all 0.3s ease' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', color: isDarkMode ? '#3B82F6' : '#3B82F6', fontWeight: 'bold' }}>Closed / Won</span>
          <h2 style={{ margin: '5px 0 0 0', color: isDarkMode ? '#3B82F6' : '#3B82F6' }}>${totalWonValue.toLocaleString()}</h2>
        </div>
      </div>

      <div className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: isDarkMode ? '#222222' : 'white', padding: '15px', borderRadius: '16px', boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
        
        <div className="responsive-flex-row" style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '100%' }}>
          <input 
            type="text" 
            placeholder=" Search deals..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', maxWidth: '280px', padding: '10px 15px', borderRadius: '20px', border: isDarkMode ? '1px solid #1E293B' : '1px solid #dfe1e6', backgroundColor: isDarkMode ? '#1E293B' : 'white', color: isDarkMode ? 'white' : 'black', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}
          />
          
          <div style={{ display: 'flex', backgroundColor: isDarkMode ? '#1E293B' : '#F0F4F8', borderRadius: '20px', padding: '4px', transition: 'all 0.3s ease' }}>
            <button 
              onClick={() => setViewMode('list')}
              style={{ padding: '6px 16px', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: viewMode === 'list' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: viewMode === 'list' ? (isDarkMode ? 'white' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84'), transition: 'all 0.2s ease' }}
            >
              ≡ List
            </button>
            <button 
              onClick={() => setViewMode('board')}
              style={{ padding: '6px 16px', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: viewMode === 'board' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', boxShadow: viewMode === 'board' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: viewMode === 'board' ? (isDarkMode ? 'white' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84'), transition: 'all 0.2s ease' }}
            >
              ◫ Board
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExport} style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            Export CSV
          </button>
          
          <button onClick={() => { setShowCompanyForm(!showCompanyForm); setShowForm(false); }} style={{ padding: '10px 20px', backgroundColor: showCompanyForm ? '#ff5630' : '#3B82F6', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showCompanyForm ? 'Cancel' : '+ New Company'}
          </button>
          
          <button onClick={() => { setShowForm(!showForm); setShowCompanyForm(false); }} style={{ padding: '10px 20px', backgroundColor: showForm ? '#ff5630' : '#3B82F6', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showForm ? 'Cancel' : '+ New Deal'}
          </button>
        </div>
      </div> 
      
      <div style={{ display: 'flex', gap: '25px', borderBottom: isDarkMode ? '2px solid #1E293B' : '2px solid #F0F4F8', marginBottom: '20px', paddingLeft: '10px' }}>
        {['All', 'Leads', 'High Value', 'Won'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: activeFilter === filter ? (isDarkMode ? '#60a5fa' : '#3B82F6') : (isDarkMode ? '#aaa' : '#5e6c84'),
              borderBottom: activeFilter === filter ? (isDarkMode ? '3px solid #60a5fa' : '3px solid #3B82F6') : '3px solid transparent',
              marginBottom: '-2px', 
              transition: 'all 0.2s ease'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {showCompanyForm && (
        <div style={{ backgroundColor: isDarkMode ? '#2a2d45' : '#eae6ff', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
          <form onSubmit={handleCreateCompany} className="responsive-flex-row" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Company Name" 
              value={newCompanyName} 
              onChange={(e) => setNewCompanyName(e.target.value)}
              style={{ padding: '10px', borderRadius: '16px', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', backgroundColor: isDarkMode ? '#1E293B' : 'white', color: isDarkMode ? 'white' : 'black', flex: 1, width: '100%', boxSizing: 'border-box' }}
              required 
            />
            <button type="submit" className="responsive-form-item" style={{ padding: '10px 20px', backgroundColor: '#403294', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Company
            </button>
          </form>
        </div>
      )}

      {showForm && (
        <div style={{ backgroundColor: isDarkMode ? '#2d2d2d' : '#F0F4F8', padding: '20px', borderRadius: '16px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}>
          <form onSubmit={handleSubmit} className="responsive-flex-row" style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <div className="responsive-form-item" style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: isDarkMode ? '#ccc' : 'black' }}>Deal Title</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ padding: '10px', borderRadius: '16px', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', backgroundColor: isDarkMode ? '#1E293B' : 'white', color: isDarkMode ? 'white' : 'black', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div className="responsive-form-item" style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: isDarkMode ? '#ccc' : 'black' }}>Company</label>
              <select required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} style={{ padding: '10px', borderRadius: '16px', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', backgroundColor: isDarkMode ? '#1E293B' : 'white', color: isDarkMode ? 'white' : 'black', width: '100%', boxSizing: 'border-box' }}>
                <option value="" disabled>Select a company...</option>
                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="responsive-form-item" style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', color: isDarkMode ? '#ccc' : 'black' }}>Value ($)</label>
              <input required type="number" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} style={{ padding: '10px', borderRadius: '16px', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', backgroundColor: isDarkMode ? '#1E293B' : 'white', color: isDarkMode ? 'white' : 'black', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" className="responsive-form-item" style={{ padding: '11px 25px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold', height: 'fit-content' }}>
              Save Deal
            </button>
          </form>
        </div>
      )}
    
      {viewMode === 'board' ? (
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const isColumnHovered = activeColumn === stage;

            return (
              <div 
                key={stage} 
                onDragOver={(e) => handleDragOver(e, stage)}
                onDrop={(e) => handleDrop(e, stage)}
                onDragLeave={() => setActiveColumn(null)}
                style={{ flex: '1', minWidth: '260px', backgroundColor: isColumnHovered ? (isDarkMode ? '#2a3b52' : '#e2e4e9') : (isDarkMode ? '#1E293B' : '#F0F4F8'), borderRadius: '16px', padding: '15px', transition: 'all 0.3s ease' }}
              >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: isDarkMode ? 'white' : '#1E293B' }}>{stage} ({stageDeals.length})</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '200px' }}>
                  {stageDeals.map((deal) => (
                    <div 
                      key={deal._id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal._id)}
                      onClick={() => setSelectedDeal(deal)} 
                      style={{ backgroundColor: isDarkMode ? '#222222' : 'white', padding: '15px', borderRadius: '20px', boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.12)', position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      {userRole === 'admin' && (
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal._id); }} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#de350b', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                      )}
                      
                      <strong style={{ display: 'block', marginBottom: '5px', color: isDarkMode ? 'white' : '#1E293B' }}>{deal.title}</strong>
                      
                      <div style={{ fontSize: '13px', color: isDarkMode ? '#aaaaaa' : '#5e6c84', marginBottom: '12px', fontWeight: '500' }}>
                        🏢 {deal.company?.name || 'Unknown Company'}
                        {userRole === 'admin' && (
                          <div style={{ marginTop: '5px', fontSize: '11px', color: isDarkMode ? '#888' : '#888' }}>
                            👤 Added by: {deal.owner?.email === 'praketmehta05@gmail.com' ? 'ADMIN' : (deal.owner?.name || 'Unknown')}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ backgroundColor: isDarkMode ? '#1E3A8A' : '#DBEAFE', color: isDarkMode ? '#3B82F6' : '#3B82F6', padding: '2px 6px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' }}>
                        ${Number(deal.value).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ backgroundColor: isDarkMode ? '#222222' : 'white', borderRadius: '16px', boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto', transition: 'all 0.3s ease' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: isDarkMode ? '#2d2d2d' : '#fafbfc', borderBottom: isDarkMode ? '2px solid #1E293B' : '2px solid #F0F4F8' }}>
              <tr>
                <th style={{ padding: '15px', color: isDarkMode ? '#aaa' : '#5e6c84', fontSize: '12px' }}>DEAL NAME</th>
                <th style={{ padding: '15px', color: isDarkMode ? '#aaa' : '#5e6c84', fontSize: '12px' }}>COMPANY</th>
                <th style={{ padding: '15px', color: isDarkMode ? '#aaa' : '#5e6c84', fontSize: '12px' }}>STAGE</th>
                <th style={{ padding: '15px', color: isDarkMode ? '#aaa' : '#5e6c84', fontSize: '12px' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: isDarkMode ? '#aaa' : '#5e6c84' }}>No deals found.</td></tr>
              ) : (
                filteredDeals.map(deal => (
                  <tr 
                    key={deal._id} 
                    onClick={() => setSelectedDeal(deal)}
                    style={{ borderBottom: isDarkMode ? '1px solid #1E293B' : '1px solid #F0F4F8', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: isDarkMode ? '#222222' : 'white' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#1E293B' : '#F0F4F8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#222222' : 'white'}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold', color: isDarkMode ? '#60a5fa' : '#3B82F6' }}>{deal.title}</td>
                    <td style={{ padding: '15px', color: isDarkMode ? 'white' : '#1E293B' }}>{deal.company?.name || 'Unknown'}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ backgroundColor: isDarkMode ? '#1E293B' : '#F0F4F8', padding: '4px 8px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold', color: isDarkMode ? '#ccc' : '#42526E' }}>{deal.stage}</span>
                      {userRole === 'admin' && (
                        <div style={{ fontSize: '11px', marginTop: '4px', color: isDarkMode ? '#888' : '#888' }}>
                          Added by: {deal.owner?.email === 'praketmehta05@gmail.com' ? 'ADMIN' : (deal.owner?.name || 'Unknown')}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '15px', color: isDarkMode ? '#3B82F6' : '#3B82F6', fontWeight: 'bold' }}>${Number(deal.value).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}