import React from 'react';
import { useApp } from '../context/AppContext';
import { Gavel, Search, Users, FileText, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { data, currentUser, setCurrentPage } = useApp();

  const udienzeOggi = data.udienze.filter(u => u.data === new Date().toISOString().split('T')[0]);
  const indaginiAttive = data.indagini.filter(i => i.stato === 'In Corso');
  const udienzeConcluse = data.udienze.filter(u => u.stato === 'Conclusa');
  const recentUdienze = [...data.udienze].slice(-3).reverse();
  const recentIndagini = [...data.indagini].slice(-3).reverse();

  const stats = [
    { label: 'Udienze Totali', value: data.udienze.length, icon: Gavel, color: '#1e6fc5' },
    { label: 'Indagini Attive', value: indaginiAttive.length, icon: Search, color: '#22c55e' },
    { label: 'Magistrati', value: data.magistrati.filter(m => m.attivo).length, icon: Users, color: '#f07c1e' },
    { label: 'Procedimenti', value: new Set([...data.udienze.map(u => u.nProcedimento), ...data.indagini.map(i => i.nProcedimento)]).size, icon: FileText, color: '#4db3e8' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Fredoka One, cursive', fontSize: 26, color: 'var(--white)', fontWeight: 400 }}>
          Buongiorno, {currentUser?.nome}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>
          {new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.color + '15' }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Ultime Udienze */}
        <div className="card">
          <div className="card-header">
            <h2><Gavel size={16} style={{ marginRight: 8, display: 'inline' }} />Ultime Udienze</h2>
            <button className="btn btn-sm" style={{ background: 'rgba(240,124,30,0.15)', color: 'var(--orange-bright)', border: '1px solid rgba(240,124,30,0.3)', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 800 }} onClick={() => setCurrentPage('udienze')}>
              Vedi tutte
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentUdienze.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Nessuna udienza registrata</div>
            ) : recentUdienze.map(u => {
              const tipo = data.tipiUdienza.find(t => t.id === u.tipoUdienzaId);
              return (
                <div key={u.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>{u.nomeImputato}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                      {u.nProcedimento} · {u.data}
                    </div>
                  </div>
                  <span className="badge badge-navy" style={{ fontSize: 11 }}>{tipo?.codice || '—'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ultime Indagini */}
        <div className="card">
          <div className="card-header">
            <h2><Search size={16} style={{ marginRight: 8, display: 'inline' }} />Indagini Attive</h2>
            <button className="btn btn-sm" style={{ background: 'rgba(240,124,30,0.15)', color: 'var(--orange-bright)', border: '1px solid rgba(240,124,30,0.3)', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 800 }} onClick={() => setCurrentPage('indagini')}>
              Vedi tutte
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentIndagini.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Nessuna indagine registrata</div>
            ) : recentIndagini.map(ind => {
              const mag = data.magistrati.find(m => m.id === ind.magistratoResponsabileId);
              return (
                <div key={ind.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>{ind.titolo}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      PM: {mag?.nome || '—'} · Aperta: {ind.dataApertura}
                    </div>
                  </div>
                  <span className={`badge ${ind.stato === 'In Corso' ? 'status-in-corso' : 'badge-gray'}`} style={{ fontSize: 11 }}>
                    {ind.stato}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div style={{ marginTop: 24, padding: 20, background: 'linear-gradient(135deg, rgba(240,124,30,0.15) 0%, rgba(30,111,197,0.15) 100%)', borderRadius: 16, border: '1px solid rgba(240,124,30,0.2)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ color: 'var(--white)', fontFamily: 'Fredoka One, cursive', fontSize: 17, flex: 1, minWidth: 150 }}>
          Accesso Rapido
        </div>
        {[
          { label: 'Nuova Udienza', page: 'udienze', action: 'new' },
          { label: 'Nuova Indagine', page: 'indagini', action: 'new' },
        ].map(q => (
          <button key={q.label} className="btn btn-gold" onClick={() => setCurrentPage(q.page)}>
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
