import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

const PROFILE_FIELDS = [
  { key: 'fullName',     label: 'Full Name',         icon: '👤', type: 'text',   placeholder: 'Rahul Sharma' },
  { key: 'email',        label: 'Email Address',     icon: '📧', type: 'email',  placeholder: 'citizen@example.com', readOnly: true },
  { key: 'state',        label: 'State',             icon: '📍', type: 'text',   placeholder: 'Andhra Pradesh' },
  { key: 'mobileNumber', label: 'Mobile Number',     icon: '📱', type: 'tel',    placeholder: '+91 98765 43210' },
];

const PROFILE_SECTIONS = [
  { label: 'Eligibility & Income',  icon: '💰', desc: 'Annual income, BPL status, land holding' },
  { label: 'Caste & Category',      icon: '📋', desc: 'General / OBC / SC / ST / Minority / EWS' },
  { label: 'Education Details',     icon: '🎓', desc: 'Qualification, college, course details' },
  { label: 'Family Details',        icon: '👨‍👩‍👧', desc: 'Dependents, household size, marital status' },
];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName:     user?.fullName     || '',
    email:        user?.email        || '',
    state:        user?.state        || '',
    mobileNumber: user?.mobileNumber || '',
  });

  const initials = (user?.fullName || user?.email || 'C').charAt(0).toUpperCase();

  const profileScore = 65; // Static score for demo

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white font-sans">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white text-slate-900 flex items-center justify-center text-3xl font-black shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black truncate text-white">{user?.fullName || 'Citizen User'}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email || 'citizen@gov.in'}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="px-2.5 py-1 bg-slate-700 border border-slate-600 text-slate-200 text-xs font-extrabold rounded-full capitalize">
                {user?.role || 'citizen'}
              </span>
              {user?.state && (
                <span className="px-2.5 py-1 bg-slate-700 border border-slate-600 text-slate-200 text-xs font-extrabold rounded-full">
                  📍 {user.state}
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setEditing(e => !e)}
            className="flex-shrink-0 px-4 py-2 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow-lg hover:bg-slate-100 transition-all">
            {editing ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-white text-sm">Profile Completion</h2>
            <p className="text-xs text-slate-400 mt-0.5">Complete your profile for 40% more accurate scheme matching</p>
          </div>
          <span className="text-2xl font-black text-white">{profileScore}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-white transition-all duration-700"
            style={{ width: `${profileScore}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Income Details', 'Caste Certificate', 'Aadhaar Link', 'Bank Account'].map(item => (
            <span key={item} className="px-2.5 py-1 bg-amber-950 border border-amber-800 text-amber-300 text-[11px] font-extrabold rounded-full">
              ⚠️ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="font-extrabold text-white">Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-xs text-slate-300 font-extrabold hover:underline">Edit →</button>
          )}
        </div>
        {editing ? (
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {PROFILE_FIELDS.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-300">{f.icon} {f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    readOnly={f.readOnly}
                    onChange={e => !f.readOnly && setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${f.readOnly ? 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-white'}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-3 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow-lg transition-all hover:bg-slate-100">
                💾 Save Changes
              </button>
              <button onClick={() => setEditing(false)}
                className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-xl transition-all">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/80">
            {PROFILE_FIELDS.map(f => (
              <div key={f.key} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 font-bold">
                  <span>{f.icon}</span> {f.label}
                </div>
                <span className="text-sm font-extrabold text-white">{form[f.key] || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expand Profile Sections */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="font-extrabold text-white">Expand Your Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">Add more details to unlock better scheme recommendations</p>
        </div>
        <div className="divide-y divide-slate-700/80">
          {PROFILE_SECTIONS.map(s => (
            <div key={s.label} className="flex items-center justify-between px-6 py-4 hover:bg-slate-700/60 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-extrabold text-white text-sm group-hover:text-slate-200 transition-colors">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white text-lg font-bold transition-colors">→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
