import { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import AuthPage from './components/AuthPage';
import ContactDirectory from './components/ContactDirectory';
import TicketBoard from './components/TicketBoard';
import AdminDashboard from './components/AdminDashboard';
import SalesRepDashboard from './components/SalesRepDashboard';
import TaskManager from './components/TaskManager';
import CompanyProfile from './components/CompanyProfile';

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const [userRole, setUserRole] = useState((localStorage.getItem('role') || 'salesrep').toLowerCase());
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [activeView, setActiveView] = useState('pipeline');
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#ffffff';
    document.body.style.margin = '0';
  }, [isDarkMode]);

  const handleEditName = async () => {
    const newName = window.prompt('Enter your new username:', userName);
    if (newName && newName.trim() !== '' && newName !== userName) {
      try {
        const { default: api } = await import('./api/axiosConfig');
        const res = await api.put('/auth/profile', { name: newName.trim() });
        setUserName(res.data.user.name);
        localStorage.setItem('userName', res.data.user.name);
      } catch (err) {
        alert('Failed to update username.');
      }
    }
  };

  if (!authToken) {
    return (
      <AuthPage
        setAuthToken={setAuthToken}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setUserRole={setUserRole}
        setUserName={setUserName}
      />
    );
  }

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1E293B',
      minHeight: '50vh',
      width: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflowX: 'hidden'
    }}>

      <img
        src={isDarkMode ? "/logowhite.png" : "/logoblack.png"}
        alt="APalette Watermark"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxWidth: '800px',
          opacity: isDarkMode ? 0.03 : 0.05,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>

        <div className="responsive-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: `2px solid ${isDarkMode ? '#1E293B' : '#F0F4F8'}`,
          paddingBottom: '20px'
        }}>

          <img
            src={isDarkMode ? "/logowhite.png" : "/logoblack.png"}
            alt="APalette"
            style={{ height: '45px', objectFit: 'contain' }}
          />

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                border: 'none',
                fontWeight: '600',
                backgroundColor: isDarkMode ? '#1E293B' : '#eee',
                color: isDarkMode ? 'white' : 'black'
              }}
            >
              {isDarkMode ? '☀︎' : '⏾'}
            </button>

            <div className="responsive-nav-tabs" style={{ display: 'flex', gap: '5px', backgroundColor: isDarkMode ? '#1E293B' : '#F0F4F8', padding: '4px', borderRadius: '16px' }}>
              <button onClick={() => { setActiveView('pipeline'); setActiveCompanyId(null); }} style={{ padding: '8px 24px', backgroundColor: activeView === 'pipeline' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: activeView === 'pipeline' ? (isDarkMode ? '#fff' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84') }}>Pipeline</button>
              <button onClick={() => { setActiveView('contacts'); setActiveCompanyId(null); }} style={{ padding: '8px 24px', backgroundColor: activeView === 'contacts' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: activeView === 'contacts' ? (isDarkMode ? '#fff' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84') }}>Directory</button>
              <button onClick={() => { setActiveView('service'); setActiveCompanyId(null); }} style={{ padding: '8px 24px', backgroundColor: activeView === 'service' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: activeView === 'service' ? (isDarkMode ? '#fff' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84') }}>Service</button>
              <button onClick={() => { setActiveView('tasks'); setActiveCompanyId(null); }} style={{ padding: '8px 24px', backgroundColor: activeView === 'tasks' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: activeView === 'tasks' ? (isDarkMode ? '#fff' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84') }}>Tasks</button>

              <button onClick={() => { setActiveView('dashboard'); setActiveCompanyId(null); }} style={{ padding: '8px 24px', backgroundColor: activeView === 'dashboard' ? (isDarkMode ? '#1E293B' : 'white') : 'transparent', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: activeView === 'dashboard' ? (isDarkMode ? '#fff' : '#1E293B') : (isDarkMode ? '#aaa' : '#5e6c84') }}>Dashboard</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px', marginRight: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Hello, {userName || 'User'}</span>
              <button
                onClick={handleEditName}
                style={{ padding: '8px 16px', backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff', border: '1px solid #3B82F6', color: '#3B82F6', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}
              >
                Edit Username
              </button>
            </div>

            <button
              onClick={() => {
                setAuthToken(null);
                setUserRole(null);
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.reload();
              }}
              style={{ padding: '8px 16px', backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff', border: '1px solid #de350b', color: '#de350b', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ margin: 0, fontSize: '30px' }}>
            {activeView === 'pipeline' && 'Pipeline Dashboard'}
            {activeView === 'contacts' && 'Contact Directory'}
            {activeView === 'service' && 'Service Hub'}
            {activeView === 'tasks' && 'Sales Rep Tasks'}
            {activeView === 'dashboard' && (userRole === 'admin' ? 'Executive Overview' : 'Sales Rep Dashboard')}
          </h1>
        </div>

        <main style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#F0F4F8',
          padding: '20px',
          borderRadius: '50px',
        }}>
          {activeView === 'pipeline' && <KanbanBoard isDarkMode={isDarkMode} userRole={userRole} />}
          {activeView === 'contacts' && <ContactDirectory
            isDarkMode={isDarkMode}
            userRole={userRole}
            onViewCompany={(id) => { setActiveCompanyId(id); setActiveView('company'); }}
          />}
          {activeView === 'company' && activeCompanyId && (
            <CompanyProfile id={activeCompanyId} onBack={() => setActiveView('contacts')} isDarkMode={isDarkMode} userRole={userRole} />
          )}
          {activeView === 'service' && <TicketBoard isDarkMode={isDarkMode} userRole={userRole} />}
          {activeView === 'tasks' && <TaskManager isDarkMode={isDarkMode} />}

          {activeView === 'dashboard' && userRole === 'admin' && <AdminDashboard isDarkMode={isDarkMode} userRole={userRole} />}
          {activeView === 'dashboard' && userRole === 'sales_rep' && <SalesRepDashboard isDarkMode={isDarkMode} userRole={userRole} />}
        </main>
      </div>

    </div>
  );
}