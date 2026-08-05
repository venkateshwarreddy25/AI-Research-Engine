import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

const SAMPLE_APPS = [
  { id: 'APP-2024-001', scheme: 'PM-KISAN',              icon: '🌾', status: 'Under Review',       date: '15 Mar 2025', statusColor: 'bg-amber-950 text-amber-300 border-amber-800',   step: 2 },
  { id: 'APP-2024-002', scheme: 'Ayushman Bharat PM-JAY',icon: '🏥', status: 'Approved ✅',         date: '01 Jan 2025', statusColor: 'bg-emerald-950 text-emerald-300 border-emerald-800', step: 3 },
  { id: 'APP-2024-003', scheme: 'NSP Scholarship',       icon: '🎓', status: 'Documents Pending',   date: '10 Feb 2025', statusColor: 'bg-rose-950 text-rose-300 border-rose-800',        step: 1 },
];

const STEPS = ['Submitted', 'Verified', 'Under Review', 'Approved'];

function StatusStepper({ step }) {
  return (
    <div className="flex items-center gap-0 mt-4 overflow-x-auto pb-1">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex flex-col items-center gap-1 flex-shrink-0 ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black ${i <= step ? 'bg-white border-white text-slate-900' : 'border-slate-700 text-slate-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-[10px] font-bold text-slate-400 text-center leading-tight max-w-[55px]">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-4 mx-1 min-w-[20px] ${i < step ? 'bg-white' : 'bg-slate-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white font-sans">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-full">📊 Application Tracker</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-3 mb-2 text-white">My Applications</h1>
          <p className="text-slate-300 text-sm max-w-xl">Track the real-time status of all your government scheme applications in one place.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Applied', value: 3, icon: '📋' },
          { label: 'Approved',      value: 1, icon: '✅' },
          { label: 'Pending',       value: 2, icon: '⏳' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 rounded-2xl border border-slate-700 p-4 sm:p-5 text-center shadow-xl">
            <div className="w-11 h-11 rounded-2xl bg-slate-700 flex items-center justify-center text-xl mx-auto mb-2 shadow-md">{s.icon}</div>
            <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
            <div className="text-xs font-bold text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {SAMPLE_APPS.map(app => (
          <div key={app.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-5 sm:p-6 hover:border-slate-500 transition-all shadow-xl">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{app.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">{app.id}</span>
                    <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${app.statusColor}`}>{app.status}</span>
                  </div>
                  <h3 className="font-extrabold text-white text-base">{app.scheme}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Applied: {app.date}</p>
                </div>
              </div>
              <Link to={ROUTES.CHATBOT}
                className="px-3 py-1.5 bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-600 transition-all">
                🤖 Ask AI about status
              </Link>
            </div>
            <StatusStepper step={app.step} />
          </div>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-3 shadow-xl">
        <div className="text-3xl">🏛️</div>
        <p className="font-extrabold text-white text-base">Looking for new schemes to apply to?</p>
        <p className="text-slate-400 text-sm">Browse 2,000+ verified government schemes tailored to your profile.</p>
        <Link to={ROUTES.SCHEMES} className="inline-block px-6 py-3 bg-white text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5">
          🏛️ Explore All Schemes →
        </Link>
      </div>
    </div>
  );
}
