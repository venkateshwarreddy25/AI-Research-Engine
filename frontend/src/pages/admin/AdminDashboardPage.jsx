import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const stats = [
    { label: 'Total Users',       value: '1,240', icon: '👥' },
    { label: 'Active Schemes',    value: '2,000+', icon: '📋' },
    { label: 'Pending Reviews',   value: '14', icon: '⏳' },
    { label: 'Resolved Today',    value: '89', icon: '✅' },
  ];

  const adminLinks = [
    { label: 'Manage Schemes',     icon: '📋', to: ROUTES.ADMIN_SCHEMES, desc: 'Sync & edit government scheme catalog' },
    { label: 'Manage Users',       icon: '👥', to: ROUTES.ADMIN_USERS, desc: 'View citizen accounts & permissions' },
    { label: 'Analytics',          icon: '📈', to: ROUTES.ADMIN_ANALYTICS, desc: 'Platform usage & RAG metrics' },
    { label: 'Complaints',         icon: '📝', to: ROUTES.ADMIN_COMPLAINTS, desc: 'Review feedback & citizen support' },
    { label: 'Notifications',      icon: '🔔', to: ROUTES.ADMIN_NOTIFICATIONS, desc: 'Broadcast policy alerts' },
    { label: 'Audit Logs',         icon: '🔍', to: ROUTES.ADMIN_AUDIT_LOGS, desc: 'System security & API transaction logs' },
  ];

  return (
    <div className="space-y-8 text-white font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back, {user?.fullName || 'Admin User'}. Overview of system activity & telemetry.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl hover:border-slate-500 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-slate-700 flex items-center justify-center text-xl mb-3 shadow-md">
              {stat.icon}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
            <div className="text-xs sm:text-sm font-bold text-slate-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-4">Admin Control Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {adminLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="group p-5 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 shadow-xl hover:-translate-y-0.5 transition-all duration-200 min-h-[100px] flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">{link.icon}</div>
                <div className="font-extrabold text-white text-sm group-hover:text-slate-200 transition-colors">
                  {link.label}
                </div>
                <div className="text-xs text-slate-400 mt-1">{link.desc}</div>
              </div>
              <div className="text-xs font-bold text-slate-400 group-hover:text-white pt-2 inline-block">Access →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
