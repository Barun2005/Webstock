import { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, Activity, Key } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login({ setToken }) {
  const [mode, setMode] = useState('login'); // login | register | forgot | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For success messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      if (mode === 'login' || mode === 'register') {
        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
        const token = res.data.token;
        localStorage.setItem('auth_token', token);
        setToken(token);
      } else if (mode === 'forgot') {
        // Request a reset token
        const res = await axios.post(`${API_URL}/api/auth/forgotpassword`, { email });
        // Since we aren't using email yet, grab it directly from response for the UI Demo
        const generatedToken = res.data.data;
        setMessage('Reset link generated! Moving to reset phase in 3s...');
        setResetToken(generatedToken);
        
        setTimeout(() => {
          setMode('reset');
          setMessage('');
        }, 3000);
      } else if (mode === 'reset') {
        const res = await axios.put(`${API_URL}/api/auth/resetpassword/${resetToken}`, { password });
        const token = res.data.token;
        localStorage.setItem('auth_token', token);
        setToken(token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass-card">
        <div className="login-header">
          <Activity size={48} color="#3b82f6" />
          <h2>Real-Time Operations</h2>
          <p>
            {mode === 'login' && 'Sign in to access telemetry payload'}
            {mode === 'register' && 'Create an advanced admin profile'}
            {mode === 'forgot' && 'Reset your secure credentials'}
            {mode === 'reset' && 'Create a new secure password'}
          </p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        {message && <div style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center'}}>{message}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          
          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="Admin Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          )}
          
          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder={mode === 'reset' ? "New Password" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          )}

          {mode === 'reset' && (
            <div className="input-group">
              <Key className="input-icon" size={20} />
              <input 
                type="text" 
                placeholder="Reset Token (Auto-filled)" 
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required 
              />
            </div>
          )}
          
          <button type="submit" className="login-btn btn-primary">
             {mode === 'login' && 'Secure Login'}
             {mode === 'register' && 'Register Admin'}
             {mode === 'forgot' && 'Send Reset Link'}
             {mode === 'reset' && 'Reset Password'}
          </button>
        </form>
        
        {mode === 'login' && (
          <>
            <p className="toggle-mode" onClick={() => setMode('register')}>
              System Access Not Found? Register.
            </p>
            <p className="toggle-mode" onClick={() => setMode('forgot')} style={{marginTop: '0.5rem'}}>
              Forgot your password?
            </p>
          </>
        )}

        {(mode === 'register' || mode === 'forgot' || mode === 'reset') && (
          <p className="toggle-mode" onClick={() => { setMode('login'); setMessage(''); setError(''); }}>
            Return to Secure Login.
          </p>
        )}
      </div>
    </div>
  );
}
