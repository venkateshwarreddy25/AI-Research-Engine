import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';
import { useAuthStore } from '../../store/authStore';
import GovernmentCenterLocatorModal from '../../components/gis/GovernmentCenterLocatorModal';

const FLAGSHIP_SCHEMES = [
  { name: 'PM-KISAN',              icon: '🌾', category: 'Agriculture', benefit: '₹6,000/yr DBT',       url: 'https://pmkisan.gov.in',        match: 94, color: 'from-emerald-600 to-teal-700' },
  { name: 'Ayushman Bharat PM-JAY',icon: '🏥', category: 'Health',      benefit: '₹5L Health Cover',     url: 'https://pmjay.gov.in',          match: 88, color: 'from-rose-600 to-pink-700' },
  { name: 'PMAY Urban 2.0',        icon: '🏠', category: 'Housing',     benefit: '₹2.5L Subsidy',        url: 'https://pmay-urban.gov.in',     match: 76, color: 'from-blue-600 to-indigo-700' },
  { name: 'PM Vidyalaxmi / NSP',   icon: '🎓', category: 'Education',   benefit: 'Collateral-free Loan', url: 'https://scholarships.gov.in',   match: 81, color: 'from-purple-600 to-violet-700' },
  { name: 'PM Vishwakarma',        icon: '⚒️', category: 'MSME',        benefit: '₹3L Loan + Training',  url: 'https://pmvishwakarma.gov.in',  match: 72, color: 'from-amber-600 to-orange-700' },
  { name: 'Lakhpati Didi',         icon: '👩', category: 'Women',       benefit: 'SHG Income ₹1L+',      url: 'https://lakhpatididi.gov.in',   match: 68, color: 'from-fuchsia-600 to-pink-700' },
];

const QUICK_ACTIONS = [
  { label: 'AI Government Helpdesk', icon: '🤖', to: ROUTES.CHATBOT,     desc: 'Ask anything about schemes', color: 'from-slate-700 to-slate-800', bg: 'bg-slate-800', border: 'border-slate-700' },
  { label: 'Browse All Schemes',     icon: '🏛️', to: ROUTES.SCHEMES,     desc: '2,000+ central & state schemes', color: 'from-slate-700 to-slate-800', bg: 'bg-slate-800', border: 'border-slate-700' },
  { label: 'Document Vault & OCR',  icon: '📄', to: ROUTES.DOCUMENTS,    desc: 'Upload & verify documents', color: 'from-slate-700 to-slate-800', bg: 'bg-slate-800', border: 'border-slate-700' },
  { label: 'My Applications',        icon: '📊', to: ROUTES.APPLICATIONS, desc: 'Track status & approvals', color: 'from-slate-700 to-slate-800', bg: 'bg-slate-800', border: 'border-slate-700' },
  { label: 'Notifications & Alerts', icon: '🔔', to: ROUTES.NOTIFICATIONS,desc: 'Deadlines & new schemes', color: 'from-slate-700 to-slate-800', bg: 'bg-slate-800', border: 'border-slate-700' },
  { label: 'My Profile',             icon: '👤', to: ROUTES.PROFILE,      desc: 'Update details for matching', color: 'from-slate-700 to-slate-800', bg: 'bg-slate-800', border: 'border-slate-700' },
];

const REAL_TIME_UPDATES = [
  { title: 'PM Vishwakarma 2025-26 Applications Open',  time: '2 hrs ago',  type: 'New Scheme',    dot: 'bg-emerald-400', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
  { title: 'NSP Scholarship Deadline: 31 Oct 2026',     time: '5 hrs ago',  type: 'Deadline Alert', dot: 'bg-amber-400',   badge: 'bg-amber-950 text-amber-300 border-amber-800' },
  { title: 'Budget 2026: New Agricultural Subsidy',     time: '1 day ago',  type: 'Policy Update',  dot: 'bg-blue-400',    badge: 'bg-blue-950 text-blue-300 border-blue-800' },
  { title: 'PM-KISAN 20th Installment Released',        time: '2 days ago', type: 'DBT Update',     dot: 'bg-indigo-400',  badge: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
];

export default function DashboardPage() {
  const user      = useAuthStore(s => s.user);
  const firstName = (user?.fullName || 'Citizen').split(' ')[0];
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const [showLocator, setShowLocator] = useState(false);
  const [stats, setStats] = useState({ schemes: '2,000+', pending: 0, saved: 0, eligibleCount: 6 });

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/users/' + (user?.uid || 'guest') + '/stats')
      .then(r => r.json())
      .then(j => j.success && setStats(prev => ({ ...prev, pending: j.data.applicationsCount, saved: j.data.savedSchemesCount })))
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="space-y-6 pb-6 text-white font-sans">
        {/* ── Welcome Banner Cover Card ─────────────────────────── */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-slate-400 text-sm font-bold">{greeting}, {firstName} 👋</p>
              <h1 className="text-2xl sm:text-4xl font-black mt-1 leading-tight text-white tracking-tight">Your Digital Government Officer</h1>
              <p className="text-slate-300 text-sm mt-2 max-w-lg leading-relaxed font-normal">
                Access 2,000+ verified government schemes, check eligibility, upload documents, and locate nearby government centers.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 flex-shrink-0">
              <Link to={ROUTES.CHATBOT} className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5">
                🤖 Ask AI Officer
              </Link>
              <button onClick={() => setShowLocator(true)} className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-650 text-white font-bold text-sm rounded-2xl border border-slate-600 transition-all">
                📍 Locate Nearby Gov Centers
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Eligible Schemes',    value: stats.eligibleCount, icon: '🎯', sub: 'AI-matched for you' },
            { label: 'Active Applications', value: stats.pending,       icon: '📊', sub: 'Pending approval' },
            { label: 'Saved Schemes',       value: stats.saved,         icon: '🔖', sub: 'Bookmarked' },
            { label: 'Total Schemes',       value: stats.schemes,       icon: '🏛️', sub: 'Verified & live' },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-all duration-200 shadow-xl">
              <div className="w-11 h-11 rounded-2xl bg-slate-700 flex items-center justify-center text-xl mb-3 shadow-md">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm font-bold text-slate-300 mt-0.5">{s.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ──────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-extrabold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.label} to={action.to}
                className="group p-4 sm:p-5 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center text-2xl mb-3 shadow-md group-hover:scale-110 transition-transform">{action.icon}</div>
                <div className="font-extrabold text-white text-sm group-hover:text-slate-200 transition-colors leading-snug">{action.label}</div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom two-column ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI-Matched Schemes */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-white text-base">🎯 AI-Matched Eligible Schemes</h2>
              <Link to={ROUTES.SCHEMES} className="text-xs text-slate-400 font-bold hover:text-white underline">View All →</Link>
            </div>
            <div className="space-y-2.5">
              {FLAGSHIP_SCHEMES.map(scheme => (
                <div key={scheme.name} className="flex items-center justify-between gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-700/70 hover:border-slate-600 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">{scheme.icon}</div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-white text-xs truncate group-hover:text-slate-200">{scheme.name}</p>
                      <p className="text-[11px] text-slate-400">{scheme.benefit} · {scheme.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-black text-white">{scheme.match}%</div>
                      <div className="text-[10px] text-slate-500">match</div>
                    </div>
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="px-2.5 py-1.5 bg-white text-slate-900 text-[11px] font-extrabold rounded-lg transition-all shadow-sm hover:bg-slate-100">
                      Apply ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Updates + Locate CTA */}
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-white text-base">📢 Real-Time Policy Updates</h2>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />Live
                </span>
              </div>
              <div className="space-y-2">
                {REAL_TIME_UPDATES.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-700/70">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${u.dot}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${u.badge}`}>{u.type}</span>
                        <span className="text-[11px] text-slate-500">{u.time}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-200 mt-1 leading-snug">{u.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setShowLocator(true)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-500 text-white rounded-2xl p-5 text-left group transition-all shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">📍</div>
                  <div className="font-extrabold text-base">Find Nearby Government Centers</div>
                  <div className="text-slate-400 text-xs mt-1">CSC · Aadhaar Kendra · MeeSeva · RTO · Passport · Banks</div>
                </div>
                <div className="text-3xl group-hover:translate-x-1 transition-transform opacity-70">→</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showLocator && <GovernmentCenterLocatorModal onClose={() => setShowLocator(false)} />}
    </>
  );
}
