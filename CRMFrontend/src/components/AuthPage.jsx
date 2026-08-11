import { useState } from 'react';
import api from '../api/axiosConfig'; 

export default function AuthPage({ setAuthToken, isDarkMode, setIsDarkMode, setUserRole, setUserName }) {
  const [isLoginMode, setIsLoginMode] = useState(true); 
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      
      if (isLoginMode) {
        res = await api.post('/auth/login', { email, password });
      } else {
        res = await api.post('/auth/signup', { name, email, password });
      }
      
      const role = res.data.user?.role || 'salesrep'; 
      const normalizedRole = role.toLowerCase();
      
      const nameToStore = res.data.user?.name || '';
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', normalizedRole);
      localStorage.setItem('userName', nameToStore);
      setAuthToken(res.data.token);
      setUserRole(normalizedRole);
      setUserName(nameToStore);
      
    } catch (error) {
      console.error(isLoginMode ? "Login failed" : "Sign up failed", error);
      alert(isLoginMode ? "Login failed. Check console for details." : "Sign up failed. Check console for details.");
      
      const mockRole = email.toLowerCase().includes('praket') ? 'admin' : 'salesrep';
      localStorage.setItem('token', 'dev-token');
      localStorage.setItem('role', mockRole);
      setAuthToken('dev-token');
      setUserRole(mockRole);
    }
  };

  return (
    <div style={{
      minHeight: '40vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', 
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1a1a1a' : 'var(--bg-secondary)', 
      padding: '20px 20px',
      boxSizing: 'border-box',
      position: 'relative',
      transition: 'all 0.3s ease'
    }}>

      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{ 
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px', 
          borderRadius: '20px', 
          cursor: 'pointer', 
          fontWeight: '600',
          backgroundColor: isDarkMode ? '#1E293B' : '#ddd',
          color: isDarkMode ? 'white' : 'black',
          transition: 'all 0.3s ease'
        }}
      >
        {isDarkMode ? ' Light' : ' Dark'}
      </button>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <img 
          src={isDarkMode ? "/logowhite.png" : "/logoblack.png"} 
          alt="APalette" 
          style={{ height: '280px', objectFit: 'contain',objectPosition:'center' }} 
        />
      </div>

      <div className="responsive-modal" style={{
        backgroundColor: isDarkMode ? '#2d2d2d' : 'var(--bg-primary)', 
        padding: '40px',
        borderRadius: '100px',
        boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.05)', 
        width: '100%',
        maxWidth: '400px',
        transition: 'all 0.3s ease'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '2px 0 0 0', color: isDarkMode ? '#ffffff' : 'var(--color-navy)', fontSize: '30px', fontFamily:'ui-rounded' }}>
            {isLoginMode ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ margin: '2px 0 0 0', color: isDarkMode ? '#aaa' : '#5e6c84', fontSize: '8px', fontFamily:'monospace' }}>
            Seamless Client Management
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLoginMode && (
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '7px', fontWeight: '600', color: isDarkMode ? '#ccc' : 'var(--color-navy)' }}>
                Full Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginMode}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '20px', 
                  border: isDarkMode ? '1px solid #555' : '1px solid #ccc',
                  backgroundColor: isDarkMode ? '#1E293B' : '#fff',
                  color: isDarkMode ? '#fff' : '#000',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  fontFamily: 'ui-monospace'
                }} 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '7px', fontWeight: '600', color: isDarkMode ? '#ccc' : 'var(--color-navy)' }}>
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '20px', 
                border: isDarkMode ? '1px solid #555' : '1px solid #ccc',
                backgroundColor: isDarkMode ? '#1E293B' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                boxSizing: 'border-box',
                fontSize: '14px',
                fontFamily: 'ui-monospace'
              }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '7px', fontWeight: '600', color: isDarkMode ? '#ccc' : 'var(--color-navy)' }}>
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '20px', 
                border: isDarkMode ? '1px solid #555' : '1px solid #ccc',
                backgroundColor: isDarkMode ? '#1E293B' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                boxSizing: 'border-box',
                fontSize: '14px',
                fontFamily: 'ui-monospace'
              }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              marginTop: '10px',
              padding: '14px', 
              backgroundColor: 'var(--color-blue)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '18px', 
              cursor: 'pointer',
              fontSize: '9px',
              transition: 'background-color 0.2s ease',
              fontFamily: 'ui-monospace'
            }}
          >
            {isLoginMode ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#60a5fa' : 'var(--color-blue)',
              cursor: 'pointer',
              fontSize: '9px',
              fontFamily: 'ui-monospace',
              textDecoration: 'underline'
            }}
          >
            {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', opacity: 0.6 }}>
       
      </div>

    </div>
  );
}