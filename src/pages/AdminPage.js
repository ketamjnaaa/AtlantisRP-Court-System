import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, X, Check, Settings, Gavel, Users, FileText, BarChart2 } from 'lucide-react';

// ── Ruoli CRUD ──────────────────────────────────────────────
function RuoliSection() {
  const { data, addRuolo, updateRuolo, deleteRuolo } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', codice: '', colore: '#0d1b2a' });

  const openNew = () => { setForm({ nome: '', codice: '', colore: '#0d1b2a' }); setEditing('new'); };
  const openEdit = (r) => { setForm({ nome: r.nome, codice: r.codice, colore: r.colore }); setEditing(r.id); };

  const save = () => {
    if (!form.nome) return;
    if (editing === 'new') addRuolo(form);
    else updateRuolo(editing, form);
    setEditing(null);
  };

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-header">
        <h2><Users size={15} style={{ marginRight: 8, display: 'inline' }} />Gestione Ruoli</h2>
        <button className="btn btn-sm" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={openNew}>
          <Plus size={13} /> Nuovo
        </button>
      </div>
      {editing && (
        <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px auto auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label className="form-label">Nome Ruolo</label>
              <input className="form-control" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Es. Sostituto Procuratore" />
            </div>
            <div>
              <label className="form-label">Codice</label>
              <input className="form-control" value={form.codice} onChange={e => setForm(f => ({ ...f, codice: e.target.value }))} placeholder="SP" />
            </div>
            <div>
              <label className="form-label">Colore</label>
              <input type="color" className="form-control" style={{ height: 38, padding: 4 }} value={form.colore} onChange={e => setForm(f => ({ ...f, colore: e.target.value }))} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={save}><Check size={13} /></button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}><X size={13} /></button>
          </div>
        </div>
      )}
      <div className="card-body" style={{ padding: 0 }}>
        <table><thead><tr><th>Nome</th><th>Codice</th><th>Colore</th><th>Azioni</th></tr></thead>
          <tbody>
            {data.ruoli.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.nome}</td>
                <td><span className="badge badge-navy font-mono">{r.codice}</span></td>
                <td><span style={{ display: 'inline-block', width: 24, height: 24, background: r.colore, borderRadius: 4, border: '1px solid rgba(0,0,0,0.15)' }} /></td>
                <td><div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Edit2 size={13} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Eliminare?')) deleteRuolo(r.id); }}><Trash2 size={13} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tipi Udienza CRUD ────────────────────────────────────────
function TipiUdienzaSection() {
  const { data, addTipoUdienza, updateTipoUdienza, deleteTipoUdienza } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nome: '', codice: '' });

  const openNew = () => { setForm({ nome: '', codice: '' }); setEditing('new'); };
  const openEdit = (t) => { setForm({ nome: t.nome, codice: t.codice }); setEditing(t.id); };
  const save = () => {
    if (!form.nome) return;
    if (editing === 'new') addTipoUdienza(form);
    else updateTipoUdienza(editing, form);
    setEditing(null);
  };

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-header">
        <h2><Gavel size={15} style={{ marginRight: 8, display: 'inline' }} />Tipi di Udienza</h2>
        <button className="btn btn-sm" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={openNew}>
          <Plus size={13} /> Nuovo
        </button>
      </div>
      {editing && (
        <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px auto auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label className="form-label">Nome Tipo Udienza</label>
              <input className="form-control" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Es. Convalida Arresto" />
            </div>
            <div>
              <label className="form-label">Codice Breve</label>
              <input className="form-control" value={form.codice} onChange={e => setForm(f => ({ ...f, codice: e.target.value }))} placeholder="CA" />
            </div>
            <button className="btn btn-primary btn-sm" onClick={save}><Check size={13} /></button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}><X size={13} /></button>
          </div>
        </div>
      )}
      <div className="card-body" style={{ padding: 0 }}>
        <table><thead><tr><th>Nome</th><th>Codice</th><th>Utilizzi</th><th>Azioni</th></tr></thead>
          <tbody>
            {data.tipiUdienza.map(t => {
              const utilizzi = data.udienze.filter(u => u.tipoUdienzaId === t.id).length;
              return (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.nome}</td>
                  <td><span className="badge badge-navy font-mono">{t.codice}</span></td>
                  <td><span className="badge badge-gray">{utilizzi}</span></td>
                  <td><div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}><Edit2 size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Eliminare?')) deleteTipoUdienza(t.id); }}><Trash2 size={13} /></button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Statistiche ──────────────────────────────────────────────
function StatisticheSection() {
  const { data } = useApp();

  const udPerTipo = data.tipiUdienza.map(t => ({
    nome: t.nome, count: data.udienze.filter(u => u.tipoUdienzaId === t.id).length
  })).sort((a, b) => b.count - a.count);

  const indPerStato = ['In Corso', 'Conclusa', 'Archiviata', 'Sospesa'].map(s => ({
    stato: s, count: data.indagini.filter(i => i.stato === s).length
  }));

  const maxUd = Math.max(...udPerTipo.map(x => x.count), 1);

  return (
    <div className="card">
      <div className="card-header"><h2><BarChart2 size={15} style={{ marginRight: 8, display: 'inline' }} />Statistiche Generali</h2></div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 14 }}>Udienze per Tipo</div>
            {udPerTipo.map(x => (
              <div key={x.nome} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{x.nome}</span><span style={{ fontWeight: 600 }}>{x.count}</span>
                </div>
                <div style={{ height: 6, background: '#ede9e0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(x.count / maxUd) * 100}%`, background: '#0d1b2a', borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
            {udPerTipo.every(x => x.count === 0) && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Nessuna udienza registrata.</p>}
          </div>
          <div>
            <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 14 }}>Indagini per Stato</div>
            {indPerStato.map(x => (
              <div key={x.stato} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 13 }}>{x.stato}</span>
                <span className="badge badge-navy">{x.count}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 14, background: 'rgba(0,0,0,0.2)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: 8 }}>RIEPILOGO SISTEMA</div>
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { label: 'Udienze', value: data.udienze.length },
                  { label: 'Indagini', value: data.indagini.length },
                  { label: 'Magistrati', value: data.magistrati.filter(m => m.attivo).length },
                  { label: 'Tipi Udienza', value: data.tipiUdienza.length },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 24, fontWeight: 400, color: 'var(--white)' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorageSection() {
  const { resetData, data } = useApp();

  const storageSize = (() => {
    try {
      const raw = localStorage.getItem('procura_liberty_bay_data') || '';
      return (new Blob([raw]).size / 1024).toFixed(1) + ' KB';
    } catch { return 'N/A'; }
  })();

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procura-liberty-bay-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        localStorage.setItem('procura_liberty_bay_data', JSON.stringify(parsed));
        window.location.reload();
      } catch {
        alert('File JSON non valido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-header">
        <h2>💾 Gestione Dati</h2>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '14px 20px', flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 11, color: 'var(--blue-sky)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Dati Salvati</div>
            <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 22, color: 'var(--white)' }}>{storageSize}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Salvati nel browser (localStorage)</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleExport}>
              ⬇️ Esporta Backup JSON
            </button>
            <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
              ⬆️ Importa JSON
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
            </label>
            <button className="btn btn-danger" onClick={() => {
              if (window.confirm('⚠️ ATTENZIONE: Questo eliminerà TUTTI i dati (magistrati, udienze, indagini) e ripristinerà i dati di default. Sei sicuro?')) {
                resetData();
              }
            }}>
              🗑️ Reset Dati Default
            </button>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(240,124,30,0.08)', border: '1px solid rgba(240,124,30,0.2)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          💡 I dati vengono salvati automaticamente ad ogni modifica nel browser. Usa "Esporta Backup" per salvare una copia sul tuo computer.
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { currentUser } = useApp();

  if (!currentUser?.canAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: 'Fredoka One, cursive', color: 'var(--white)', marginBottom: 8 }}>Accesso Negato</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Non hai i permessi per accedere al pannello amministrativo.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Fredoka One, cursive', fontSize: 24, color: 'var(--white)' }}>
          <Settings size={20} style={{ display: 'inline', marginRight: 10, verticalAlign: 'middle' }} />
          Pannello Amministrativo
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>Gestione ruoli, tipi di udienza e configurazioni di sistema</p>
      </div>

      <RuoliSection />
      <TipiUdienzaSection />
      <StatisticheSection />
      <StorageSection />
    </div>
  );
}
