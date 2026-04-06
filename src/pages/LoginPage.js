import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError('Inserire credenziali.'); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) setError('Credenziali non valide.');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-crest">⚖️</span>
          <div className="login-title">Procura della Repubblica</div>
          <div className="login-subtitle" style={{ color: '#c9a84c', fontWeight: 600 }}>LIBERTY BAY</div>
          <div className="login-subtitle" style={{ marginTop: 4 }}>Sistema Gestione Procedimenti</div>
        </div>
        <div className="login-body">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Badge / Matricola</label>
            <input
              className="form-control"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Es. PG-001 oppure admin"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                style={{ paddingRight: 40 }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9e9588' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            className="btn btn-orange w-full"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: 15, borderRadius: 24 }}
            onClick={handleLogin}
            disabled={loading}
          >
            <Shield size={16} />
            {loading ? 'Accesso in corso...' : 'Accedi al Sistema'}
          </button>
          <div style={{ marginTop: 20, padding: 14, background: 'rgba(0,0,0,0.2)', borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
            <div style={{ marginBottom: 4, fontWeight: 600 }}>DEMO ACCESSI:</div>
            <div>Admin: admin / procura2024</div>
            <div>Magistrato: PG-001 / magistrato123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
