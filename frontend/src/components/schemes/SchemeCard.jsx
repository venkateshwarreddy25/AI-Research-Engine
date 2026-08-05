import React from 'react';

const CATEGORY_COLORS = {
  Agriculture:            'bg-emerald-950 text-emerald-300 border-emerald-800',
  Health:                 'bg-rose-950 text-rose-300 border-rose-800',
  Education:              'bg-violet-950 text-violet-300 border-violet-800',
  Housing:                'bg-blue-950 text-blue-300 border-blue-800',
  Employment:             'bg-amber-950 text-amber-300 border-amber-800',
  Business:               'bg-indigo-950 text-indigo-300 border-indigo-800',
  Women:                  'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800',
  'Financial Assistance': 'bg-cyan-950 text-cyan-300 border-cyan-800',
};

export default function SchemeCard({ scheme, onViewDetails, onCheckEligibility, onToggleCompare, isCompared, onToggleSave, isSaved }) {
  const categoryCls = CATEGORY_COLORS[scheme.category] || 'bg-slate-700 text-slate-200 border-slate-600';

  return (
    <div className="group relative bg-slate-800 rounded-2xl border border-slate-700 p-5 sm:p-6 hover:border-slate-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl text-white font-sans">

      {/* Top Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${categoryCls}`}>{scheme.category}</span>
            {scheme.scope === 'central' ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-700 text-slate-200 border border-slate-600">🏛️ Central</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">📍 State</span>
            )}
            {scheme.isNewlyLaunched && <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white animate-pulse">NEW</span>}
            {scheme.isRecentlyUpdated && <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-950 text-sky-300 border border-sky-800">Updated</span>}
          </div>
          <div className="flex items-center gap-2">
            {scheme.isVerified && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-950 text-blue-300 text-[11px] font-extrabold rounded-full border border-blue-800">
                <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            )}
            <button onClick={(e) => { e.stopPropagation(); onToggleSave?.(scheme.id); }}
              className={`p-1.5 rounded-lg transition-all text-lg ${isSaved ? 'text-amber-400' : 'text-slate-500 hover:text-amber-300 hover:bg-slate-700'}`}
              title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}>★</button>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-bold mb-1 line-clamp-1">{scheme.ministry}</p>
        <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-slate-200 transition-colors mb-3">
          {scheme.title}
        </h3>

        {/* Benefit Box */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 mb-4">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400 block mb-0.5">🎁 Key Benefit</span>
          <p className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">{scheme.benefits}</p>
        </div>

        {/* Eligibility */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
          <div className="flex items-start gap-1.5">
            <span className="text-slate-500 flex-shrink-0">🎯 Beneficiaries:</span>
            <span className="font-bold text-slate-300 line-clamp-1">
              {Array.isArray(scheme.targetBeneficiaries) ? scheme.targetBeneficiaries.join(', ') : scheme.targetBeneficiaries}
            </span>
          </div>
          {scheme.helplineNumber && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">📞 Helpline:</span>
              <span className="font-bold text-slate-300">{scheme.helplineNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Updated: {new Date(scheme.lastUpdatedDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <label className="flex items-center gap-1 cursor-pointer text-slate-400 hover:text-white font-bold">
            <input type="checkbox" checked={!!isCompared} onChange={() => onToggleCompare?.(scheme.id)} className="rounded text-slate-900 focus:ring-white w-3.5 h-3.5" />
            Compare
          </label>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button onClick={() => onViewDetails?.(scheme)}
            className="w-full py-2 px-2 text-[11px] font-extrabold bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 transition-all text-center">
            Details
          </button>
          <button onClick={() => onCheckEligibility?.(scheme)}
            className="w-full py-2 px-2 text-[11px] font-extrabold bg-slate-700 text-slate-200 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-0.5">
            ✨ AI Check
          </button>
          <a href={scheme.officialApplyLink || scheme.officialWebsite} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2 px-2 text-[11px] font-extrabold bg-white hover:bg-slate-100 text-slate-900 rounded-xl shadow-sm transition-all flex items-center justify-center">
            Apply ↗
          </a>
        </div>
      </div>
    </div>
  );
}
