import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import './index.css';

import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UdienzePageWrapper from './pages/UdienzePageWrapper';
import IndaginiPage from './pages/IndaginiPage';
import MagistratiPage from './pages/MagistratiPage';
import AdminPage from './pages/AdminPage';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  udienze: 'Registro Udienze',
  indagini: 'Registro Indagini',
  magistrati: 'Registro Magistrati',
  admin: 'Pannello Amministrativo',
};

function AppContent() {
  const { currentUser, currentPage } = useApp();

  if (!currentUser) return <LoginPage />;

  const pages = {
    dashboard: <Dashboard />,
    udienze: <UdienzePageWrapper />,
    indagini: <IndaginiPage />,
    magistrati: <MagistratiPage />,
    admin: <AdminPage />,
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">
            {PAGE_TITLES[currentPage] || 'Procura di Liberty Bay'}
          </div>
          <div className="topbar-actions">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#9e9588', letterSpacing: '0.05em' }}>
              SISTEMA GESTIONE PROCEDIMENTI
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2d7a2d', boxShadow: '0 0 6px #2d7a2d' }} title="Sistema Online" />
          </div>
        </div>
        <div className="page-content">
          {pages[currentPage] || <Dashboard />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
