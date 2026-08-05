import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

const NOTIFICATIONS = [
  { id: 1, type: 'Deadline Alert',  icon: '⏰', title: 'NSP Scholarship — Last Date 31 Oct 2026',       body: 'Submit your National Scholarship Portal application before the deadline. Ensure all documents are uploaded.',                        time: '2 hrs ago',  badge: 'bg-amber-950 text-amber-300 border-amber-800',   bar: 'bg-amber-400',   unread: true },
  { id: 2, type: 'New Scheme',      icon: '🆕', title: 'PM Vishwakarma 2025-26 Applications Open',       body: 'Artisans and craftsmen can now apply. Benefits include ₹3L loan, free toolkit, and skill training.',                              time: '5 hrs ago',  badge: 'bg-indigo-950 text-indigo-300 border-indigo-800', bar: 'bg-indigo-400',  unread: true },
  { id: 3, type: 'Policy Update',   icon: '📜', title: 'Budget 2026: Agriculture Subsidy Doubled',        body: 'Government has doubled PM-KISAN installment to ₹12,000/yr for small & marginal farmers from FY 2026-27.',                          time: '1 day ago',  badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',bar: 'bg-emerald-400', unread: true },
  { id: 4, type: 'DBT Update',      icon: '💳', title: 'PM-KISAN 20th Installment Released',             body: 'The 20th installment of ₹2,000 under PM-KISAN has been credited to eligible farmers\' accounts via DBT.',                        time: '2 days ago', badge: 'bg-blue-950 text-blue-300 border-blue-800',       bar: 'bg-blue-400',    unread: false },
  { id: 5, type: 'Application',     icon: '📊', title: 'Ayushman Bharat Application Approved',           body: 'Congratulations! Your Ayushman Bharat PM-JAY application (APP-2024-002) has been approved. Your health card will be issued within 7 days.', time: '3 days ago', badge: 'bg-violet-950 text-violet-300 border-violet-800',  bar: 'bg-violet-400',  unread: false },
  { id: 6, type: 'Reminder',        icon: '🔔', title: 'Complete Your Profile for Better Matching',      body: 'You have not filled your caste & income details. Update your profile to get 40% more accurate scheme recommendations.',             time: '5 days ago', badge: 'bg-rose-950 text-rose-300 border-rose-800',       bar: 'bg-rose-400',    unread: false },
];

const FILTER_TYPES = ['All', 'Deadline Alert', 'New Scheme', 'Policy Update', 'DBT Update', 'Application', 'Reminder'];

export default function NotificationsPage() {
  const [filter, setFilter]   = useState('All');
  const [readIds, setReadIds] = useState(new Set());

  const markRead    = id => setReadIds(prev => new Set([...prev, id]));
  const markAllRead = ()  => setReadIds(new Set(NOTIFICATIONS.map(n => n.id)));

  const visible     = filter === 'All' ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.type === filter);
  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-white font-sans">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-full">🔔 Notification Center</span>
            <h1 className="text-2xl sm:text-3xl font-black mt-3 mb-2 text-white">Policy Alerts & Updates</h1>
            <p className="text-slate-300 text-sm">Real-time deadlines, new schemes, DBT credits, and application status alerts.</p>
            {unreadCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-full text-white text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />{unreadCount} unread notifications
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex-shrink-0 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-extrabold rounded-xl border border-slate-600 transition-all whitespace-nowrap">
              ✓ Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TYPES.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all ${filter === f
              ? 'bg-white text-slate-900 border-white shadow-md'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {visible.map(n => {
          const isUnread = n.unread && !readIds.has(n.id);
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`bg-slate-800 rounded-2xl border border-slate-700 p-4 sm:p-5 cursor-pointer hover:border-slate-500 transition-all shadow-xl relative ${isUnread ? 'border-l-4 border-l-white' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-0.5">{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full border ${n.badge}`}>{n.type}</span>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />}
                    <span className="text-[11px] text-slate-500 font-medium ml-auto">{n.time}</span>
                  </div>
                  <h3 className={`font-extrabold text-sm leading-snug ${isUnread ? 'text-white' : 'text-slate-300'}`}>{n.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{n.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <p className="font-extrabold text-white text-sm">Want personalised scheme alerts?</p>
          <p className="text-xs text-slate-400 mt-0.5">Update your profile to receive alerts for schemes you qualify for.</p>
        </div>
        <Link to={ROUTES.PROFILE} className="flex-shrink-0 px-5 py-2.5 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow-md transition-all hover:bg-slate-100">
          Update Profile →
        </Link>
      </div>
    </div>
  );
}
