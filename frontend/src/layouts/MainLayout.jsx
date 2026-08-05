import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }  from '../store/authStore';
import { ROUTES }        from '../constants/routes.constants';

const NAV_ITEMS = [
  { label: 'Dashboard',      path: ROUTES.DASHBOARD,      icon: '🏠' },
  { label: 'AI Assistant',   path: ROUTES.CHATBOT,        icon: '🤖' },
  { label: 'Schemes',        path: ROUTES.SCHEMES,        icon: '🏛️' },
  { label: 'Document Vault', path: ROUTES.DOCUMENTS,      icon: '📄' },
  { label: 'Applications',   path: ROUTES.APPLICATIONS,   icon: '📊' },
  { label: 'Notifications',  path: ROUTES.NOTIFICATIONS,  icon: '🔔' },
  { label: 'Profile',        path: ROUTES.PROFILE,        icon: '👤' },
];

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden selection:bg-white selection:text-slate-900">
      {/* ── Sidebar (desktop) ─────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 shadow-2xl">
        {/* Logo */}
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 hover:bg-slate-850 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-lg">
            🏛️
          </div>
          <div>
            <p className="font-extrabold text-white text-base leading-tight">GovAssist AI</p>
            <p className="text-xs text-slate-400 font-bold">Digital Citizen Portal</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xl'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + actions */}
        <div className="px-3 py-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors"
          >
            🚪 Sign Out
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
              {(user?.fullName?.[0] || user?.email?.[0] || 'C').toUpperCase()}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-extrabold text-white truncate">{user?.fullName || 'Citizen User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'citizen@gov.in'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-slate-900 border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-black text-white text-base">GovAssist AI</span>
          </div>
          <Link to={ROUTES.CHATBOT} className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-extrabold shadow-sm">
            🤖 Ask AI
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile sidebar overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 shadow-2xl flex flex-col border-r border-slate-800"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
                <span className="font-extrabold text-white text-lg">GovAssist AI</span>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">✕</button>
              </div>
              <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
