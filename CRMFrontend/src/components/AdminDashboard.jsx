import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AdminDashboard({ isDarkMode, userRole }) {
  const [stats, setStats] = useState({
    totalRevenue: 0, wonRevenue: 0, totalDeals: 0, wonDeals: 0,
    openTickets: 0, totalContacts: 0
  });
  
  const [chartData, setChartData] = useState({ pipeline: [], tickets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    try {
      const [dealsRes, ticketsRes, contactsRes] = await Promise.all([
        api.get('/deals').catch(() => ({ data: [] })),
        api.get('/tickets').catch(() => ({ data: [] })),
        api.get('/contacts').catch(() => ({ data: [] }))
      ]);

      const deals = dealsRes.data;
      const tickets = ticketsRes.data;
      const contacts = contactsRes.data;

      const wonDeals = deals.filter(d => d.stage === 'Won');
      const totalRevenue = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
      const wonRevenue = wonDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
      const openTickets = tickets.filter(t => t.status !== 'Closed').length;

      setStats({
        totalRevenue, wonRevenue, totalDeals: deals.length,
        wonDeals: wonDeals.length, openTickets, totalContacts: contacts.length
      });

      const stages = ['Lead', 'Contacted', 'Proposal', 'Won'];
      const pipelineAgg = stages.map(stage => ({
        name: stage,
        value: deals.filter(d => d.stage === stage).reduce((sum, d) => sum + Number(d.value || 0), 0)
      }));

      const statuses = ['New', 'In Progress', 'Waiting on Customer', 'Closed'];
      const ticketAgg = statuses.map(status => ({
        name: status === 'Waiting on Customer' ? 'Waiting' : status,
        value: tickets.filter(t => t.status === status).length
      }));

      setChartData({ pipeline: pipelineAgg, tickets: ticketAgg });

    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: isDarkMode ? '#ff9980' : '#de350b' }}>
        <h2>🔒 Access Denied</h2>
        <p>You do not have permission to view the analytics dashboard.</p>
      </div>
    );
  }

  if (loading) return <p style={{ color: isDarkMode ? 'white' : '#1E293B' }}>Crunching numbers...</p>;

  const cardBg = isDarkMode ? '#222222' : 'white';
  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const shadow = isDarkMode ? '0 4px 6px rgba(0,0,0,0.4)' : '0 4px 6px rgba(0,0,0,0.05)';
  const gridLine = isDarkMode ? '#1E293B' : '#eee';
  
  const pieColors = ['#3B82F6', '#ffab00', '#ff5630', '#3B82F6'];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #3B82F6' }}>
          <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Pipeline</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: textMain }}>${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #3B82F6' }}>
          <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Revenue Won</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: isDarkMode ? '#3B82F6' : '#3B82F6' }}>${stats.wonRevenue.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #ffab00' }}>
          <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Win Rate</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: textMain }}>{stats.totalDeals ? Math.round((stats.wonDeals / stats.totalDeals) * 100) : 0}%</p>
        </div>
        <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '20px', boxShadow: shadow, borderTop: '4px solid #ff5630' }}>
          <h3 style={{ margin: 0, fontSize: '11px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>Open Tickets</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: textMain }}>{stats.openTickets}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        <div style={{ backgroundColor: cardBg, padding: '25px', borderRadius: '20px', boxShadow: shadow }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: textMain }}>Revenue by Stage</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.pipeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridLine} vertical={false} />
                <XAxis dataKey="name" stroke={textMuted} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textMuted} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{ fill: isDarkMode ? '#1E293B' : '#F0F4F8' }}
                  contentStyle={{ backgroundColor: cardBg, borderColor: gridLine, color: textMain, borderRadius: '16px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="value" fill={isDarkMode ? '#60a5fa' : '#3B82F6'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, padding: '25px', borderRadius: '20px', boxShadow: shadow }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: textMain }}>Ticket Status Overview</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData.tickets} 
                  cx="50%" cy="50%" 
                  innerRadius={70} outerRadius={100} 
                  paddingAngle={5} dataKey="value"
                  stroke="none"
                >
                  {chartData.tickets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: cardBg, borderColor: gridLine, color: textMain, borderRadius: '16px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: textMain }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}