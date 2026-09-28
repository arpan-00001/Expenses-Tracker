import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiHome, HiCreditCard, HiChartPie, HiCurrencyRupee,
  HiFlag, HiUser, HiLogout, HiMenu, HiX, HiLightBulb
} from 'react-icons/hi';
import './AppLayout.css';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { to: '/dashboard', icon: <HiHome />, label: 'Dashboard' },
    { to: '/transactions', icon: <HiCreditCard />, label: 'Transactions' },
    { to: '/budgets', icon: <HiCurrencyRupee />, label: 'Budgets' },
    { to: '/savings', icon: <HiFlag />, label: 'Savings Goals' },
    { to: '/analytics', icon: <HiChartPie />, label: 'Analytics' },
    { to: '/recommendations', icon: <HiLightBulb />, label: 'Insights' },
    { to: '/profile', icon: <HiUser />, label: 'Profile' },
  ];

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">TeenTrack</span>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close menu">
            <HiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} aria-label="Log out">
            <HiLogout />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-bar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <HiMenu />
          </button>
          <div className="top-bar-right">
            <span className="greeting">Hey, {user?.name?.split(' ')[0] || 'there'}! 👋</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
