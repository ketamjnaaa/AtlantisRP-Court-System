import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const DEFAULT_DATA = {
  ruoli: [
    { id: 1, nome: 'Procuratore Generale', codice: 'PG', colore: '#8B0000' },
    { id: 2, nome: 'Sostituto Procuratore', codice: 'SP', colore: '#1a3a6b' },
    { id: 3, nome: 'Pubblico Ministero', codice: 'PM', colore: '#2c5f2e' },
    { id: 4, nome: 'Giudice', codice: 'GDC', colore: '#4a3728' },
  ],
  tipiUdienza: [
    { id: 1, nome: 'Convalida Arresto', codice: 'CA' },
    { id: 2, nome: 'Udienza Preliminare', codice: 'UP' },
    { id: 3, nome: 'Dibattimento', codice: 'DIB' },
    { id: 4, nome: 'Incidente Cautelare', codice: 'IC' },
    { id: 5, nome: 'Riesame', codice: 'RIE' },
    { id: 6, nome: 'Appello Cautelare', codice: 'AC' },
  ],
  magistrati: [
    { id: 1, nome: 'Antonio Ferrara', ruoloId: 1, badge: 'PG-001', attivo: true, canAdmin: true },
    { id: 2, nome: 'Laura Conti', ruoloId: 2, badge: 'SP-002', attivo: true, canAdmin: false },
    { id: 3, nome: 'Marco Bianchi', ruoloId: 3, badge: 'PM-003', attivo: true, canAdmin: false },
    { id: 4, nome: 'Sofia Russo', ruoloId: 4, badge: 'GDC-001', attivo: true, canAdmin: false },
  ],
  udienze: [
    {
      id: 1,
      nProcedimento: 'PP-2024-001',
      tipoUdienzaId: 1,
      data: '2024-12-15',
      ora: '10:00',
      nomeImputato: 'Giovanni Esposito',
      nomeGiudice: 'Sofia Russo',
      nomePM: 'Marco Bianchi',
      avvocati: ['Avv. Carlo Verdi', 'Avv. Anna Neri'],
      imputatoPresente: true,
      reatiContestati: 'Art. 416-bis c.p. - Associazione di tipo mafioso; Art. 648 c.p. - Ricettazione',
      penaIrrogata: '8 anni di reclusione',
      accaduto: "L'imputato è stato arrestato in flagranza di reato durante un'operazione della Polizia di Stato. Il GIP ha convalidato l'arresto e disposto la custodia cautelare in carcere.",
      liberato: false,
      stato: 'Conclusa',
    },
  ],
  indagini: [
    {
      id: 1,
      codice: 'IND-2024-001',
      titolo: 'Operazione Aquila Nera',
      nProcedimento: 'PP-2024-001',
      magistratoResponsabileId: 2,
      dataApertura: '2024-11-01',
      dataChiusura: null,
      stato: 'In Corso',
      classificazione: 'Riservata',
      oggetto: 'Traffico internazionale di sostanze stupefacenti e riciclaggio di denaro.',
      indagati: [
        { nome: 'Giovanni Esposito', ruolo: 'Presunto organizzatore' },
        { nome: 'Carla Fontana', ruolo: 'Presunta fiancheggiatrice' },
      ],
      reatiIpotizzati: 'Art. 73 DPR 309/90 - Traffico di stupefacenti; Art. 648-bis c.p. - Riciclaggio',
      attivitaSvolte: [
        { data: '2024-11-05', descrizione: 'Avvio intercettazioni telefoniche ex art. 266 c.p.p.' },
        { data: '2024-11-20', descrizione: 'Perquisizione domiciliare presso abitazione Esposito. Sequestrato materiale informatico.' },
        { data: '2024-12-01', descrizione: 'Arresto in flagranza di reato. Trovati 2 kg di cocaina.' },
      ],
      noteSensibili: 'Coordinamento con DDA in corso. Possibili ramificazioni internazionali.',
      pmAssegnati: ['Marco Bianchi'],
    },
  ],
};

export const ADMIN_CREDENTIALS = { username: 'admin', password: 'procura2024' };

const STORAGE_KEY = 'procura_liberty_bay_data';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Errore caricamento dati salvati, uso dati default.', e);
  }
  return DEFAULT_DATA;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Errore salvataggio dati.', e);
  }
}

export function AppProvider({ children }) {
  const [data, setDataRaw] = useState(() => loadData());
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  // Ogni modifica viene automaticamente salvata nel localStorage
  const setData = (updater) => {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveData(next);
      return next;
    });
  };

  // --- RUOLI ---
  const addRuolo = (ruolo) => setData(d => ({ ...d, ruoli: [...d.ruoli, { ...ruolo, id: Date.now() }] }));
  const updateRuolo = (id, ruolo) => setData(d => ({ ...d, ruoli: d.ruoli.map(r => r.id === id ? { ...r, ...ruolo } : r) }));
  const deleteRuolo = (id) => setData(d => ({ ...d, ruoli: d.ruoli.filter(r => r.id !== id) }));

  // --- TIPI UDIENZA ---
  const addTipoUdienza = (tipo) => setData(d => ({ ...d, tipiUdienza: [...d.tipiUdienza, { ...tipo, id: Date.now() }] }));
  const updateTipoUdienza = (id, tipo) => setData(d => ({ ...d, tipiUdienza: d.tipiUdienza.map(t => t.id === id ? { ...t, ...tipo } : t) }));
  const deleteTipoUdienza = (id) => setData(d => ({ ...d, tipiUdienza: d.tipiUdienza.filter(t => t.id !== id) }));

  // --- MAGISTRATI ---
  const addMagistrato = (mag) => setData(d => ({ ...d, magistrati: [...d.magistrati, { ...mag, id: Date.now() }] }));
  const updateMagistrato = (id, mag) => setData(d => ({ ...d, magistrati: d.magistrati.map(m => m.id === id ? { ...m, ...mag } : m) }));
  const deleteMagistrato = (id) => setData(d => ({ ...d, magistrati: d.magistrati.filter(m => m.id !== id) }));

  // --- UDIENZE ---
  const addUdienza = (udienza) => setData(d => ({ ...d, udienze: [...d.udienze, { ...udienza, id: Date.now() }] }));
  const updateUdienza = (id, udienza) => setData(d => ({ ...d, udienze: d.udienze.map(u => u.id === id ? { ...u, ...udienza } : u) }));
  const deleteUdienza = (id) => setData(d => ({ ...d, udienze: d.udienze.filter(u => u.id !== id) }));

  // --- INDAGINI ---
  const addIndagine = (indagine) => setData(d => ({ ...d, indagini: [...d.indagini, { ...indagine, id: Date.now() }] }));
  const updateIndagine = (id, indagine) => setData(d => ({ ...d, indagini: d.indagini.map(i => i.id === id ? { ...i, ...indagine } : i) }));
  const deleteIndagine = (id) => setData(d => ({ ...d, indagini: d.indagini.filter(i => i.id !== id) }));

  // Ripristina i dati di default (reset completo)
  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDataRaw(DEFAULT_DATA);
  };

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setCurrentUser({ username, role: 'admin', nome: 'Procuratore Generale', canAdmin: true });
      setCurrentPage('dashboard');
      return true;
    }
    const mag = data.magistrati.find(m => m.badge === username && password === 'magistrato123' && m.attivo);
    if (mag) {
      const ruolo = data.ruoli.find(r => r.id === mag.ruoloId);
      setCurrentUser({ username: mag.badge, role: 'magistrato', nome: mag.nome, canAdmin: mag.canAdmin, magistratoId: mag.id, ruolo: ruolo?.nome });
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => { setCurrentUser(null); setCurrentPage('login'); };

  return (
    <AppContext.Provider value={{
      data, currentUser, currentPage, setCurrentPage,
      addRuolo, updateRuolo, deleteRuolo,
      addTipoUdienza, updateTipoUdienza, deleteTipoUdienza,
      addMagistrato, updateMagistrato, deleteMagistrato,
      addUdienza, updateUdienza, deleteUdienza,
      addIndagine, updateIndagine, deleteIndagine,
      resetData, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
