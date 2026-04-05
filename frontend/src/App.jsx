import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Activity, Users, AlertOctagon, LogOut, Moon, Sun } from 'lucide-react';
import Login from './components/Login';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

// Dynamically use the live Render URL if deployed, or localhost if running on your computer!
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);
  
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState({ activeUsers: 0, eventsPerSec: 0, errorRate: 0.0 });
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState(Array(20).fill(0));

  useEffect(() => {
    if (!token) return;

    // Connect to WebSocket AFTER successful login
    const socket = io(SOCKET_URL);
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_dashboard');
    });
    socket.on('disconnect', () => setIsConnected(false));
    
    // Accumulate history data for our beautiful glowing graph array
    socket.on('metrics_update', (data) => {
      setMetrics(data);
      setHistory(prev => {
        const newHist = [...prev, data.eventsPerSec];
        if(newHist.length > 20) newHist.shift(); // keep 20s sliding window limit
        return newHist;
      });
    });
    
    socket.on('alert_trigger', (data) => {
      setAlerts(prev => [...prev, data]);
      setTimeout(() => setAlerts(prev => prev.slice(1)), 5000);
    });

    return () => socket.disconnect();
  }, [token]);

  // Authenticated Requests
  const fireMockEvent = async (type) => {
    try {
      await axios.post(`${SOCKET_URL}/api/events`, 
        { eventType: type, userId: `user_${Math.floor(Math.random() * 1000)}`, payload: { src: 'demo' } },
        { headers: { Authorization: `Bearer ${token}` } } // We enforce JWT Validation directly to backend
      );
    } catch (error) {
      if(error.response?.status === 401) handleLogout();
      console.error(error);
    }
  };

  const simulateTrafficSpike = () => {
    for(let i=0; i<25; i++) fireMockEvent(Math.random() > 0.7 ? 'error' : 'page_view');
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setHistory(Array(20).fill(0));
  };

  if (!token) return <Login setToken={setToken} />;

  const chartOptions = {
    responsive: true,
    animation: { duration: 0 },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { display: false } }
    },
    plugins: { legend: { display: false }, tooltip: { padding: 12, backgroundColor: '#0f172a', borderColor:'rgba(255,255,255,0.1)', borderWidth:1 } },
    elements: { point: { radius: 0 } }
  };

  const chartDataObj = {
    labels: history.map((_, i) => i),
    datasets: [{
      fill: true,
      data: history,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <div className="dashboard-container">
      <header>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <Activity size={32} color="#3b82f6" />
          <h1 className="title" style={{margin:0}}>Operations Hub</h1>
        </div>
        
        <div style={{display:'flex', alignItems:'center', gap:'2rem'}}>
          <div style={{cursor: 'pointer', color: 'var(--text-main)', transition: 'transform 0.2s'}} 
               onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Light/Dark Theme">
             {isDarkMode ? <Sun size={24}/> : <Moon size={24}/>}
          </div>
          
          <div className={`status-badge ${!isConnected ? 'disconnected' : ''}`}>
            <div className="dot"></div>
            {isConnected ? 'System Secure' : 'Connecting...'}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Session End
          </button>
        </div>
      </header>

      {alerts.map((alert, i) => (
        <div key={i} className="alert-banner">
          <div className="alert-message">
            <strong>⚠️ {alert.level} ALERT:</strong> {alert.message}
          </div>
        </div>
      ))}

      <div className="grid">
        <div className="glass-card">
          <div className="card-header"><Users size={24} color="#3b82f6" /><span>Active Users</span></div>
          <p className="metric-value">{metrics.activeUsers}</p>
        </div>
        <div className="glass-card">
          <div className="card-header"><Activity size={24} color="#10b981" /><span>Events / sec</span></div>
          <p className="metric-value">{metrics.eventsPerSec}</p>
        </div>
        <div className="glass-card">
          <div className="card-header"><AlertOctagon size={24} color={metrics.errorRate > 0 ? "#ef4444" : "#10b981"} /><span>Node Faults</span></div>
          <p className="metric-value">{metrics.errorRate}%</p>
        </div>
      </div>

      <div className="glass-card chart-container">
         <div className="card-header"><Activity size={20} color="#3b82f6" /><span>Live Traffic Waveform Analysis</span></div>
         <div style={{height: '350px'}}>
            <Line options={chartOptions} data={chartDataObj} />
         </div>
      </div>

      <div className="glass-card mt-2" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
            <h3 style={{marginTop: 0, color: 'white'}}>Authorized CLI Simulator</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: 0}}>Commands are explicitly validated using Admin JWT.</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button onClick={() => fireMockEvent('page_view')} className="btn-primary">
             Inject Secure Packet
          </button>
          <button onClick={simulateTrafficSpike} className="btn-danger">
             Simulate DDoS / Load
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
