import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

export default function SalesRepDashboard({ isDarkMode, userRole }) {
  const [stats, setStats] = useState({
    activeDeals: 0,
    wonDeals: 0,
    openTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'sales_rep') {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    try {
      const [dealsRes] = await Promise.all([
        api.get('/deals').catch(() => ({ data: [] }))
      ]);

      const deals = dealsRes.data;
      const activeDeals = deals.filter(d => d.stage !== 'Won').length;
      const wonDeals = deals.filter(d => d.stage === 'Won').length;

      // Note: If tasks endpoint exists we could fetch tasks here, but for now we mock it or set to 0.
      setStats({
        activeDeals,
        wonDeals,
        openTasks: 0 // Placeholder for future task integration
      });

    } catch (error) {
      console.error("Failed to fetch sales rep analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'sales_rep') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: isDarkMode ? '#ff9980' : '#de350b' }}>
        <h2>🔒 Access Denied</h2>
        <p>You do not have permission to view the sales rep dashboard.</p>
      </div>
    );
  }

  if (loading) return <p style={{ color: isDarkMode ? 'white' : '#1E293B' }}>Loading your dashboard...</p>;

  const cardBg = isDarkMode ? '#222222' : 'white';
  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const shadow = isDarkMode ? '0 4px 6px rgba(0,0,0,0.4)' : '0 4px 6px rgba(0,0,0,0.05)';

  return (
    <div>
      <h2 style={{ color: textMain, marginBottom: '20px' }}>Welcome back, Sales Rep!</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #3B82F6', display: 'flex', alignItems: 'center' }}>
          <Briefcase size={32} color="#3B82F6" style={{ marginRight: '15px' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Deals</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: textMain }}>{stats.activeDeals}</p>
          </div>
        </div>
        
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #10b981', display: 'flex', alignItems: 'center' }}>
          <CheckCircle size={32} color="#10b981" style={{ marginRight: '15px' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Deals Won</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: textMain }}>{stats.wonDeals}</p>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #f59e0b', display: 'flex', alignItems: 'center' }}>
          <Clock size={32} color="#f59e0b" style={{ marginRight: '15px' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Open Tasks</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: textMain }}>{stats.openTasks}</p>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: cardBg, padding: '25px', borderRadius: '20px', boxShadow: shadow }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: textMain }}>Quick Actions</h3>
        <p style={{ color: textMuted, fontSize: '14px' }}>Head over to the <strong>Pipeline</strong> to manage your deals, or check the <strong>Directory</strong> to contact clients.</p>
      </div>
    </div>
  );
}
