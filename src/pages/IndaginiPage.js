import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Eye, X, Check, AlertTriangle } from 'lucide-react';

const STATI = ['In Corso', 'Conclusa', 'Archiviata', 'Sospesa'];
const CLASSIFICAZIONI = ['Ordinaria', 'Riservata', 'Segreta'];

const EMPTY_INDAGINE = {
  codice: '', titolo: '', nProcedimento: '',
  magistratoResponsabileId: '', dataApertura: '', dataChiusura: '',
  stato: 'In Corso', classificazione: 'Ordinaria',
  oggetto: '', indagati: [], reatiIpotizzati: '',
  attivitaSvolte: [], noteSensibili: '', pmAssegnati: [],
};

function IndagineModal({ indagine, magistrati, onClose, onSave }) {
  const [form, setForm] = useState(indagine ? { ...indagine } : EMPTY_INDAGINE);
  const [nuovaAttivita, setNuovaAttivita] = useState({ data: '', descrizione: '' });
  const [nuovoIndagato, setNuovoIndagato] = useState({ nome: '', ruolo: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addAttivita = () => {
    if (!nuovaAttivita.descrizione) return;
    set('attivitaSvolte', [...form.attivitaSvolte, { ...nuovaAttivita, id: Date.now() }]);
    setNuovaAttivita({ data: '', descrizione: '' });
  };

  const addIndagato = () => {
    if (!nuovoIndagato.nome) return;
    set('indagati', [...form.indagati, { ...nuovoIndagato }]);
    setNuovoIndagato({ nome: '', ruolo: '' });
  };

  const handleSave = () => {
    if (!form.titolo || !form.nProcedimento) { alert('Titolo e N° Procedimento sono obbligatori.'); return; }
    onSave(form);
  };

  const pmDisponibili = magistrati.filter(m => m.attivo && m.ruoloId !== 4); // non giudici

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>🔍 {indagine?.id ? 'Modifica Indagine' : 'Nuova Indagine'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          {/* Dati base */}
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Codice Indagine</label>
              <input className="form-control" value={form.codice} onChange={e => set('codice', e.target.value)} placeholder="IND-2024-001" />
            </div>
            <div className="form-group">
              <label className="form-label">N° Procedimento Penale *</label>
              <input className="form-control" value={form.nProcedimento} onChange={e => set('nProcedimento', e.target.value)} placeholder="PP-2024-001" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Titolo Operazione *</label>
            <input className="form-control" value={form.titolo} onChange={e => set('titolo', e.target.value)} placeholder="Es. Operazione Aquila Nera" />
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Stato</label>
              <select className="form-control" value={form.stato} onChange={e => set('stato', e.target.value)}>
                {STATI.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Classificazione</label>
              <select className="form-control" value={form.classificazione} onChange={e => set('classificazione', e.target.value)}>
                {CLASSIFICAZIONI.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Magistrato Responsabile</label>
              <select className="form-control" value={form.magistratoResponsabileId} onChange={e => set('magistratoResponsabileId', parseInt(e.target.value))}>
                <option value="">— Seleziona —</option>
                {magistrati.filter(m => m.attivo).map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label">Data Apertura</label>
              <input className="form-control" type="date" value={form.dataApertura} onChange={e => set('dataApertura', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Data Chiusura</label>
              <input className="form-control" type="date" value={form.dataChiusura} onChange={e => set('dataChiusura', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Oggetto dell'Indagine</label>
            <textarea className="form-control" value={form.oggetto} onChange={e => set('oggetto', e.target.value)} rows={3} placeholder="Descrizione dell'oggetto dell'indagine..." />
          </div>

          <div className="form-group">
            <label className="form-label">Reati Ipotizzati</label>
            <textarea className="form-control" value={form.reatiIpotizzati} onChange={e => set('reatiIpotizzati', e.target.value)} rows={2} placeholder="Art. ... c.p. — Reato" />
          </div>

          {/* PM Assegnati */}
          <div className="form-group">
            <label className="form-label">PM Assegnati</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {pmDisponibili.map(m => (
                <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, cursor: 'pointer', background: form.pmAssegnati?.includes(m.nome) ? '#0d1b2a' : 'white', color: form.pmAssegnati?.includes(m.nome) ? '#c9a84c' : '#1a1410', fontSize: 13 }}>
                  <input type="checkbox" style={{ display: 'none' }}
                    checked={form.pmAssegnati?.includes(m.nome)}
                    onChange={e => {
                      const arr = form.pmAssegnati || [];
                      set('pmAssegnati', e.target.checked ? [...arr, m.nome] : arr.filter(n => n !== m.nome));
                    }}
                  />
                  {m.nome}
                </label>
              ))}
            </div>
          </div>

          {/* Indagati */}
          <hr className="section-divider" />
          <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 15, color: 'var(--white)', marginBottom: 12, fontWeight: 600 }}>Soggetti Indagati</div>
          {form.indagati.map((ind, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 4, marginBottom: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{ind.nome}</span>
                {ind.ruolo && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginLeft: 8 }}>— {ind.ruolo}</span>}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => set('indagati', form.indagati.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginTop: 8 }}>
            <input className="form-control" placeholder="Nome indagato" value={nuovoIndagato.nome} onChange={e => setNuovoIndagato(p => ({ ...p, nome: e.target.value }))} />
            <input className="form-control" placeholder="Ruolo (es. Organizzatore)" value={nuovoIndagato.ruolo} onChange={e => setNuovoIndagato(p => ({ ...p, ruolo: e.target.value }))} />
            <button className="btn btn-ghost btn-sm" onClick={addIndagato}>+ Aggiungi</button>
          </div>

          {/* Attività Svolte */}
          <hr className="section-divider" />
          <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 15, color: 'var(--white)', marginBottom: 12, fontWeight: 600 }}>Attività Svolte</div>
          <div className="timeline" style={{ marginBottom: 16 }}>
            {form.attivitaSvolte.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Nessuna attività registrata.</p>}
            {form.attivitaSvolte.map((a, i) => (
              <div key={i} className="timeline-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    {a.data && <div className="tl-date">{a.data}</div>}
                    <div className="tl-desc">{a.descrizione}</div>
                  </div>
                  <button onClick={() => set('attivitaSvolte', form.attivitaSvolte.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#b22222', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8 }}>
            <input className="form-control" type="date" value={nuovaAttivita.data} onChange={e => setNuovaAttivita(p => ({ ...p, data: e.target.value }))} style={{ width: 150 }} />
            <input className="form-control" placeholder="Descrizione attività svolta..." value={nuovaAttivita.descrizione} onChange={e => setNuovaAttivita(p => ({ ...p, descrizione: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addAttivita()} />
            <button className="btn btn-ghost btn-sm" onClick={addAttivita}>+ Aggiungi</button>
          </div>

          {/* Note Sensibili */}
          <hr className="section-divider" />
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={12} color="#b22222" /> Note Riservate / Sensibili
            </label>
            <textarea className="form-control" value={form.noteSensibili} onChange={e => set('noteSensibili', e.target.value)} rows={3} placeholder="Note riservate accessibili solo al magistrato responsabile e all'admin..." style={{ borderColor: 'rgba(178,34,34,0.3)' }} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
          <button className="btn btn-primary" onClick={handleSave}><Check size={15} /> Salva Indagine</button>
        </div>
      </div>
    </div>
  );
}

function IndagineDetail({ indagine, magistrati, onClose }) {
  const mag = magistrati.find(m => m.id === indagine.magistratoResponsabileId);
  const statClass = {
    'In Corso': 'status-in-corso', 'Conclusa': 'status-conclusa',
    'Archiviata': 'status-archiviata', 'Sospesa': 'status-sospesa',
  }[indagine.stato] || 'badge-gray';

  const classifClass = {
    'Riservata': 'classif-riservata', 'Segreta': 'classif-segreta', 'Ordinaria': 'classif-ordinaria'
  }[indagine.classificazione] || 'classif-ordinaria';

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>🔍 {indagine.titolo}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className={`badge ${statClass}`}>{indagine.stato}</span>
            <span className={`badge ${classifClass}`}>{indagine.classificazione}</span>
            <span className="badge badge-navy font-mono">{indagine.codice}</span>
          </div>

          <div className="detail-grid">
            <div className="detail-field"><label>N° Procedimento</label><p className="font-mono">{indagine.nProcedimento}</p></div>
            <div className="detail-field"><label>Magistrato Responsabile</label><p style={{ fontWeight: 600 }}>{mag?.nome || '—'}</p></div>
            <div className="detail-field"><label>Data Apertura</label><p>{indagine.dataApertura || '—'}</p></div>
            <div className="detail-field"><label>Data Chiusura</label><p>{indagine.dataChiusura || 'Aperta'}</p></div>
            <div className="detail-field detail-field-full"><label>PM Assegnati</label><p>{indagine.pmAssegnati?.join(', ') || '—'}</p></div>
            <div className="detail-field detail-field-full"><label>Oggetto</label><p style={{ whiteSpace: 'pre-wrap' }}>{indagine.oggetto || '—'}</p></div>
            <div className="detail-field detail-field-full"><label>Reati Ipotizzati</label><p style={{ whiteSpace: 'pre-wrap' }}>{indagine.reatiIpotizzati || '—'}</p></div>
          </div>

          {indagine.indagati?.length > 0 && (
            <>
              <hr className="section-divider" />
              <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 12 }}>Soggetti Indagati</div>
              {indagine.indagati.map((ind, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 4, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{ind.nome}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{ind.ruolo}</span>
                </div>
              ))}
            </>
          )}

          {indagine.attivitaSvolte?.length > 0 && (
            <>
              <hr className="section-divider" />
              <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 15, fontWeight: 600, color: 'var(--white)', marginBottom: 16 }}>Cronologia Attività</div>
              <div className="timeline">
                {indagine.attivitaSvolte.map((a, i) => (
                  <div key={i} className="timeline-item">
                    {a.data && <div className="tl-date">{a.data}</div>}
                    <div className="tl-desc">{a.descrizione}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {indagine.noteSensibili && (
            <>
              <hr className="section-divider" />
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(178,34,34,0.2)', borderRadius: 6, padding: 16 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: '#b22222', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={12} /> NOTE RISERVATE
                </div>
                <p style={{ fontSize: 14, color: 'var(--white)' }}>{indagine.noteSensibili}</p>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  );
}

export default function IndaginiPage() {
  const { data, addIndagine, updateIndagine, deleteIndagine } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStato, setFilterStato] = useState('');

  const filtered = data.indagini.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.titolo.toLowerCase().includes(q) || i.nProcedimento.toLowerCase().includes(q) || i.codice.toLowerCase().includes(q);
    const matchStato = !filterStato || i.stato === filterStato;
    return matchSearch && matchStato;
  });

  const handleSave = (form) => {
    if (modal?.edit?.id) updateIndagine(modal.edit.id, form);
    else addIndagine(form);
    setModal(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'Fredoka One, cursive', fontSize: 24, color: 'var(--white)' }}>Registro Indagini</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{data.indagini.length} indagini registrate</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>
          <Plus size={15} /> Nuova Indagine
        </button>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="Cerca per titolo, codice, procedimento..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ width: 180 }} value={filterStato} onChange={e => setFilterStato(e.target.value)}>
          <option value="">Tutti gli stati</option>
          {STATI.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Codice</th>
                <th>Titolo</th>
                <th>Procedimento</th>
                <th>Responsabile</th>
                <th>Apertura</th>
                <th>Indagati</th>
                <th>Classif.</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="empty-state">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <h3>Nessuna indagine trovata</h3>
                    <p>Crea la prima indagine con il pulsante in alto</p>
                  </div>
                </td></tr>
              ) : filtered.map(ind => {
                const mag = data.magistrati.find(m => m.id === ind.magistratoResponsabileId);
                const statClass = { 'In Corso': 'status-in-corso', 'Conclusa': 'status-conclusa', 'Archiviata': 'status-archiviata', 'Sospesa': 'status-sospesa' }[ind.stato] || 'badge-gray';
                const classifClass = { 'Riservata': 'classif-riservata', 'Segreta': 'classif-segreta' }[ind.classificazione] || 'classif-ordinaria';
                return (
                  <tr key={ind.id}>
                    <td><span className="font-mono badge badge-navy" style={{ fontSize: 11 }}>{ind.codice || '—'}</span></td>
                    <td style={{ fontWeight: 600, maxWidth: 200 }}>{ind.titolo}</td>
                    <td className="font-mono" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{ind.nProcedimento}</td>
                    <td style={{ fontSize: 13 }}>{mag?.nome || '—'}</td>
                    <td style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{ind.dataApertura || '—'}</td>
                    <td style={{ textAlign: 'center' }}><span className="badge badge-gray">{ind.indagati?.length || 0}</span></td>
                    <td><span className={`badge ${classifClass}`} style={{ fontSize: 11 }}>{ind.classificazione}</span></td>
                    <td><span className={`badge ${statClass}`} style={{ fontSize: 11 }}>{ind.stato}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ view: ind })}><Eye size={13} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ edit: ind })}><Edit2 size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Eliminare?')) deleteIndagine(ind.id); }}><Trash2 size={13} /></button>
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
        <IndagineModal indagine={modal?.edit} magistrati={data.magistrati} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.view && (
        <IndagineDetail indagine={modal.view} magistrati={data.magistrati} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
