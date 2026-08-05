import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }  from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { ROUTES }        from '../constants/routes.constants';

const ADMIN_NAV = [
  { label: 'Dashboard',   path: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
  { label: 'Schemes',     path: ROUTES.ADMIN_SCHEMES,   icon: '📋' },
  { label: 'Users',       path: ROUTES.ADMIN_USERS,     icon: '👥' },
  { label: 'Complaints',  path: ROUTES.ADMIN_COMPLAINTS,icon: '📣' },
  { label: 'Analytics',   path: ROUTES.ADMIN_ANALYTICS, icon: '📈' },
  { label: 'Audit Logs',  path: ROUTES.ADMIN_AUDIT_LOGS,icon: '🔍' },
];

export default function AdminLayout() {
  const { user, logout }   = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden selection:bg-white selection:text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 shrink-0 shadow-2xl">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-white text-slate-900 font-black flex items-center justify-center text-sm shadow-md">
            A
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-tight">GovAssist Admin</p>
            <p className="text-slate-400 text-xs font-semibold">Control Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold min-h-[44px] transition-all duration-200 ${
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

        <div className="px-3 py-4 border-t border-slate-800 space-y-2">
          <button onClick={toggle} aria-label="Toggle theme mode" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white min-h-[44px] transition-colors">
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => { logout(); navigate(ROUTES.LOGIN); }} aria-label="Sign out of admin panel"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 min-h-[44px] transition-colors">
            🚪 Sign Out
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
              {(user?.displayName?.[0] || 'A').toUpperCase()}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-extrabold text-white truncate">{user?.displayName || 'Admin User'}</p>
              <p className="text-[11px] text-slate-400 truncate capitalize">{user?.role || 'administrator'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-slate-950 border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation drawer"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-black text-white text-base">GovAssist Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 shadow-2xl flex flex-col border-r border-slate-800"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
                <span className="font-extrabold text-white text-lg">GovAssist Admin</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">✕</button>
              </div>
              <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
                {ADMIN_NAV.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold min-h-[44px] transition-all ${
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
