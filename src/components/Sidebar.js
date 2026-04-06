import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Gavel, Search, Users, Settings,
  Scale, LogOut, Shield
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard', section: 'PRINCIPALE' },
  { label: 'Udienze', icon: Gavel, page: 'udienze', section: 'PROCEDIMENTI' },
  { label: 'Indagini', icon: Search, page: 'indagini', section: 'PROCEDIMENTI' },
  { label: 'Magistrati', icon: Users, page: 'magistrati', section: 'REGISTRO' },
  { label: 'Pannello Admin', icon: Settings, page: 'admin', section: 'AMMINISTRAZIONE', adminOnly: true },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, currentUser, logout } = useApp();

  const sections = [...new Set(NAV_ITEMS.map(n => n.section))];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span className="crest">⚖️</span>
        <h1>Procura della<br />Repubblica</h1>
        <p>Liberty Bay</p>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => {
          const items = NAV_ITEMS.filter(n => n.section === section && (!n.adminOnly || currentUser?.canAdmin));
          if (!items.length) return null;
          return (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map(item => (
                <div
                  key={item.page}
                  className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.page)}
                >
                  <item.icon size={16} />
                  {item.label}
                </div>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(240,124,30,0.2)', border: '2px solid rgba(240,124,30,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={14} color="#ff9a30" />
          </div>
          <div>
            <div className="user-name">{currentUser?.nome}</div>
            <div className="user-role">{currentUser?.ruolo || (currentUser?.canAdmin ? 'Amministratore' : '')}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={logout}>
          <LogOut size={14} /> Esci
        </button>
      </div>
    </div>
  );
}
