import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, X, Check, Shield, User } from 'lucide-react';

const EMPTY_MAG = { nome: '', ruoloId: '', badge: '', attivo: true, canAdmin: false };

function MagistratoModal({ magistrato, ruoli, onClose, onSave }) {
  const [form, setForm] = useState(magistrato || EMPTY_MAG);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>👤 {magistrato?.id ? 'Modifica Magistrato' : 'Nuovo Magistrato'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nome e Cognome *</label>
            <input className="form-control" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Dott. Nome Cognome" />
          </div>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Ruolo *</label>
              <select className="form-control" value={form.ruoloId} onChange={e => set('ruoloId', parseInt(e.target.value))}>
                <option value="">— Seleziona Ruolo —</option>
                {ruoli.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Badge / Matricola *</label>
              <input className="form-control" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="PM-001" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.attivo} onChange={e => set('attivo', e.target.checked)} />
              <span>Magistrato Attivo (può accedere al sistema)</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.canAdmin} onChange={e => set('canAdmin', e.target.checked)} />
              <div>
                <div style={{ fontWeight: 600 }}>Accesso Pannello Amministrativo</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Può gestire tipi udienza, ruoli e altri magistrati</div>
              </div>
            </label>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 4, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani, sans-serif' }}>
            Password di accesso predefinita: <strong>magistrato123</strong>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
          <button className="btn btn-primary" onClick={() => { if (!form.nome || !form.badge) { alert('Nome e Badge obbligatori'); return; } onSave(form); }}><Check size={15} /> Salva</button>
        </div>
      </div>
    </div>
  );
}

export default function MagistratiPage() {
  const { data, addMagistrato, updateMagistrato, deleteMagistrato, currentUser } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = data.magistrati.filter(m => {
    const q = search.toLowerCase();
    return !q || m.nome.toLowerCase().includes(q) || m.badge.toLowerCase().includes(q);
  });

  const handleSave = (form) => {
    if (modal?.edit?.id) updateMagistrato(modal.edit.id, form);
    else addMagistrato(form);
    setModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'Fredoka One, cursive', fontSize: 24, color: 'var(--white)' }}>Registro Magistrati</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{data.magistrati.filter(m => m.attivo).length} magistrati attivi</p>
        </div>
        {currentUser?.canAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('new')}>
            <Plus size={15} /> Nuovo Magistrato
          </button>
        )}
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="Cerca per nome o badge..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(m => {
          const ruolo = data.ruoli.find(r => r.id === m.ruoloId);
          return (
            <div key={m.id} className="card" style={{ opacity: m.attivo ? 1 : 0.6 }}>
              <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: ruolo?.colore || '#0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={22} color="#c9a84c" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 16, fontWeight: 400, color: 'var(--white)' }}>{m.nome}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontFamily: 'Rajdhani, sans-serif' }}>{m.badge}</div>
                </div>
                {m.canAdmin && <Shield size={16} color="#c9a84c" title="Accesso Admin" />}
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {ruolo && <span className="badge badge-navy" style={{ fontSize: 11 }}>{ruolo.nome}</span>}
                  {!m.attivo && <span className="badge badge-red" style={{ fontSize: 11, marginLeft: 6 }}>Inattivo</span>}
                </div>
                {currentUser?.canAdmin && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setModal({ edit: m })}><Edit2 size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Eliminare magistrato?')) deleteMagistrato(m.id); }}><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(modal === 'new' || modal?.edit) && (
        <MagistratoModal magistrato={modal?.edit} ruoli={data.ruoli} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}
