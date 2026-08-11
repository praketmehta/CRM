import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Phone, Mail, CheckCircle, RefreshCcw, Info } from 'lucide-react';

const ActivityTimeline = ({ entityType, entityId, isDarkMode = false }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [entityId]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/activities?${entityType}=${entityId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Note': return <MessageSquare size={18} color="#3B82F6" />;
      case 'Email': return <Mail size={18} color="#4f46e5" />;
      case 'Call': return <Phone size={18} color="#3B82F6" />;
      case 'Meeting': return <Clock size={18} color="#3B82F6" />;
      case 'Stage_Change': return <RefreshCcw size={18} color="#FF991F" />;
      case 'Task_Completed': return <CheckCircle size={18} color="#00b8d9" />;
      default: return <Info size={18} color="#8993a4" />;
    }
  };

  const textMain = isDarkMode ? '#ffffff' : '#1E293B';
  const textMuted = isDarkMode ? '#aaaaaa' : '#5e6c84';
  const borderCol = isDarkMode ? '#555555' : '#F0F4F8';
  const cardBg = isDarkMode ? '#222222' : 'white';
  const iconBg = isDarkMode ? '#1E293B' : '#ffffff';

  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: textMuted }}>Loading timeline...</div>;

  return (
    <div style={{ marginTop: '20px' }}>
      {activities.length === 0 ? (
        <div style={{ textAlign: 'center', color: textMuted, padding: '30px 0', fontStyle: 'italic' }}>
          No activities recorded yet.
        </div>
      ) : (
        <div style={{ position: 'relative', borderLeft: `2px solid ${borderCol}`, marginLeft: '12px', paddingBottom: '20px' }}>
          {activities.map((activity) => (
            <div key={activity._id} style={{ marginBottom: '25px', marginLeft: '25px', position: 'relative' }}>
              
              {/* Icon Circle */}
              <span style={{ 
                position: 'absolute', left: '-40px', top: '0px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                width: '32px', height: '32px', backgroundColor: iconBg, 
                borderRadius: '50%', border: `1px solid ${borderCol}`, 
                boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 2px rgba(0,0,0,0.05)',
                zIndex: 1
              }}>
                {getIcon(activity.type)}
              </span>
              
              {/* Activity Card */}
              <div style={{ 
                backgroundColor: cardBg, border: `1px solid ${borderCol}`, 
                padding: '16px', borderRadius: '20px', 
                boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: textMain, marginRight: '8px', fontSize: '15px' }}>
                      {activity.type.replace('_', ' ')}
                    </span>
                    {activity.createdBy && (
                      <span style={{ fontSize: '13px', color: textMuted }}>by {activity.createdBy.name || 'User'}</span>
                    )}
                  </div>
                  <time style={{ fontSize: '12px', color: textMuted, whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </time>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: textMain, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                  {activity.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
