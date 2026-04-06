import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Eye, X, Check, XCircle, ChevronDown } from 'lucide-react';

const EMPTY_UDIENZA = {
  nProcedimento: '', tipoUdienzaId: '', data: '', ora: '',
  nomeImputato: '', nomeGiudice: '', nomePM: '', avvocati: [],
  imputatoPresente: false, reatiContestati: '', penaIrrogata: '',
  accaduto: '', liberato: false, stato: 'In Corso',
};

function TagInput({ values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) { onChange([...values, v]); }
    setInput('');
  };
  return (
    <div>
      <div className="tag-list">
        {values.map((v, i) => (
          <span key={i} className="tag">
            {v}
            <button onClick={() => onChange(values.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          style={{ flex: 1 }}
        />
        <button className="btn btn-ghost btn-sm" onClick={add} type="button">+ Aggiungi</button>
      </div>
    </div>
  );
}

function UdienzaModal({ udienza, onClose, onSave, tipiUdienza }) {
  const [form, setForm] = useState(udienza || EMPTY_UDIENZA);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.nProcedimento || !form.nomeImputato) { alert('Campi obbligatori mancanti.'); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>⚖️ {udienza?.id ? 'Modifica Udienza' : 'Nuova Udienza'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">N° Procedimento Penale *</label>
              <input className="form-control" value={form.nProcedimento} onChange={e => set('nProcedimento', e.target.value)} placeholder="PP-2024-001" />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo Udienza *</label>
              <select className="form-control" value={form.tipoUdienzaId} onChange={e => set('tipoUdienzaId', parseInt(e.target.value))}>
                <option value="">— Seleziona —</option>
                {tipiUdienza.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stato</label>
              <select className="form-control" value={form.stato} onChange={e => set('stato', e.target.value)}>
                <option>In Corso</option>
                <option>Conclusa</option>
                <option>Rinviata</option>
              </select>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Data</label>
              <input className="form-control" type="date" value={form.data} onChange={e => set('data', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ora</label>
              <input className="form-control" type="time" value={form.ora} onChange={e => set('ora', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome Imputato *</label>
            <input className="form-control" value={form.nomeImputato} onChange={e => set('nomeImputato', e.target.value)} placeholder="Nome e Cognome" />
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Giudice Presidente</label>
              <input className="form-control" value={form.nomeGiudice} onChange={e => set('nomeGiudice', e.target.value)} placeholder="Dott. Nome Cognome" />
            </div>
            <div className="form-group">
              <label className="form-label">Pubblico Ministero</label>
              <input className="form-control" value={form.nomePM} onChange={e => set('nomePM', e.target.value)} placeholder="Dott. Nome Cognome" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avvocati Presenti</label>
            <TagInput values={form.avvocati} onChange={v => set('avvocati', v)} placeholder="Avv. Nome Cognome (premi Invio)" />
          </div>

          <div className="form-group">
            <label className="form-label">Reati Contestati</label>
            <textarea className="form-control" value={form.reatiContestati} onChange={e => set('reatiContestati', e.target.value)} placeholder="Art. ... c.p. - Descrizione reato" rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Pena Irrogata</label>
            <input className="form-control" value={form.penaIrrogata} onChange={e => set('penaIrrogata', e.target.value)} placeholder="Es. 5 anni di reclusione / Assolto / —" />
          </div>

          <div className="form-group">
            <label className="form-label">Accaduto / Verbale Sintetico</label>
            <textarea className="form-control" value={form.accaduto} onChange={e => set('accaduto', e.target.value)} placeholder="Descrizione sintetica di quanto accaduto durante l'udienza..." rows={4} />
          </div>

          <div className="form-row form-row-2">
            <label className="checkbox-row">
              <input type="checkbox" checked={form.imputatoPresente} onChange={e => set('imputatoPresente', e.target.checked)} />
              <span>Imputato Presente in Aula</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={form.liberato} onChange={e => set('liberato', e.target.checked)} />
              <span>Imputato Liberato</span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
          <button className="btn btn-primary" onClick={handleSave}><Check size={15} /> Salva Udienza</button>
        </div>
      </div>
    </div>
  );
}

function UdienzaDetail({ udienza, tipiUdienza, onClose }) {
  const tipo = tipiUdienza.find(t => t.id === udienza.tipoUdienzaId);
  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>📋 Udienza — {udienza.nProcedimento}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className="badge badge-navy">{tipo?.nome || '—'}</span>
            <span className={`badge ${udienza.stato === 'Conclusa' ? 'badge-green' : 'badge-orange'}`}>{udienza.stato}</span>
            {udienza.imputatoPresente ? <span className="badge badge-green">Imputato Presente</span> : <span className="badge badge-red">Imputato Assente</span>}
            {udienza.liberato ? <span className="badge badge-green">Liberato</span> : <span className="badge badge-red">Detenuto</span>}
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <label>N° Procedimento</label>
              <p className="font-mono">{udienza.nProcedimento}</p>
            </div>
            <div className="detail-field">
              <label>Data e Ora</label>
              <p>{udienza.data} {udienza.ora && `alle ${udienza.ora}`}</p>
            </div>
            <div className="detail-field">
              <label>Imputato</label>
              <p style={{ fontWeight: 600 }}>{udienza.nomeImputato}</p>
            </div>
            <div className="detail-field">
              <label>Giudice</label>
              <p>{udienza.nomeGiudice || '—'}</p>
            </div>
            <div className="detail-field">
              <label>Pubblico Ministero</label>
              <p>{udienza.nomePM || '—'}</p>
            </div>
            <div className="detail-field">
              <label>Avvocati</label>
              <p>{udienza.avvocati?.length ? udienza.avvocati.join(', ') : '—'}</p>
            </div>
            <div className="detail-field detail-field-full">
              <label>Reati Contestati</label>
              <p style={{ whiteSpace: 'pre-wrap' }}>{udienza.reatiContestati || '—'}</p>
            </div>
            <div className="detail-field">
              <label>Pena Irrogata</label>
              <p style={{ fontWeight: 600, color: udienza.penaIrrogata ? '#8b1a1a' : '#9e9588' }}>{udienza.penaIrrogata || '—'}</p>
            </div>
            <div className="detail-field detail-field-full">
              <label>Accaduto</label>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{udienza.accaduto || '—'}</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}

export default function UdienzePageWrapper() {
  const { data, addUdienza, updateUdienza, deleteUdienza, currentUser } = useApp();
  const [modal, setModal] = useState(null); // null | 'new' | {edit: udienza} | {view: udienza}
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const filtered = data.udienze.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.nProcedimento.toLowerCase().includes(q) || u.nomeImputato.toLowerCase().includes(q) || u.nomePM?.toLowerCase().includes(q);
    const matchTipo = !filterTipo || u.tipoUdienzaId === parseInt(filterTipo);
    return matchSearch && matchTipo;
  });

  const handleSave = (form) => {
    if (modal?.edit?.id) updateUdienza(modal.edit.id, form);
    else addUdienza(form);
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Eliminare questa udienza?')) deleteUdienza(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'Fredoka One, cursive', fontSize: 24, color: 'var(--white)' }}>Registro Udienze</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{data.udienze.length} udienze registrate</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={15} /> Nuova Udienza
        </button>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="Cerca per procedimento, imputato, PM..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ width: 200 }} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Tutti i Tipi</option>
          {data.tipiUdienza.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Procedimento</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Imputato</th>
                <th>Giudice</th>
                <th>PM</th>
                <th>Stato</th>
                <th>Presente</th>
                <th>Liberato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <div className="empty-state">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚖️</div>
                    <h3>Nessuna udienza trovata</h3>
                    <p>Crea la prima udienza con il pulsante in alto</p>
                  </div>
                </td></tr>
              ) : filtered.map(u => {
                const tipo = data.tipiUdienza.find(t => t.id === u.tipoUdienzaId);
                return (
                  <tr key={u.id}>
                    <td><span className="font-mono" style={{ fontSize: 13 }}>{u.nProcedimento}</span></td>
                    <td><span className="badge badge-navy" style={{ fontSize: 11 }}>{tipo?.codice || '—'}</span></td>
                    <td style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{u.data}</td>
                    <td style={{ fontWeight: 600 }}>{u.nomeImputato}</td>
                    <td style={{ fontSize: 13 }}>{u.nomeGiudice || '—'}</td>
                    <td style={{ fontSize: 13 }}>{u.nomePM || '—'}</td>
                    <td>
                      <span className={`badge ${u.stato === 'Conclusa' ? 'badge-green' : u.stato === 'Rinviata' ? 'badge-orange' : 'badge-gray'}`} style={{ fontSize: 11 }}>
                        {u.stato}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {u.imputatoPresente ? <Check size={16} color="#2d7a2d" /> : <XCircle size={16} color="#b22222" />}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {u.liberato ? <Check size={16} color="#2d7a2d" /> : <XCircle size={16} color="#b22222" />}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ view: u })} title="Visualizza"><Eye size={13} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ edit: u })} title="Modifica"><Edit2 size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)} title="Elimina"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === 'new' || modal?.edit) && (
        <UdienzaModal udienza={modal?.edit} onClose={() => setModal(null)} onSave={handleSave} tipiUdienza={data.tipiUdienza} />
      )}
      {modal?.view && (
        <UdienzaDetail udienza={modal.view} tipiUdienza={data.tipiUdienza} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
