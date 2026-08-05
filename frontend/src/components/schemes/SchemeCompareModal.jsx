import React from 'react';

export default function SchemeCompareModal({ schemes = [], onClose }) {
  if (!schemes || schemes.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 relative text-white font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close comparison modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-lg min-h-[44px] min-w-[44px]"
        >
          ✕
        </button>

        <div>
          <span className="px-3 py-1 bg-slate-700 text-slate-200 font-bold text-xs rounded-full">
            Scheme Comparison Tool
          </span>
          <h2 id="compare-modal-title" className="text-2xl font-black text-white mt-1">
            Compare Government Schemes ({schemes.length})
          </h2>
        </div>

        {/* Comparison Grid Table */}
        <div className="overflow-x-auto border border-slate-700 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900">
                <th className="p-3.5 font-bold text-slate-400 w-36">Feature</th>
                {schemes.map(s => (
                  <th key={s.id} className="p-3.5 font-extrabold text-white text-sm min-w-[220px]">
                    {s.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/80 text-slate-300">
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Ministry</td>
                {schemes.map(s => <td key={s.id} className="p-3.5">{s.ministry}</td>)}
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Category</td>
                {schemes.map(s => <td key={s.id} className="p-3.5 font-bold text-white">{s.category}</td>)}
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Key Benefits</td>
                {schemes.map(s => <td key={s.id} className="p-3.5 font-bold text-emerald-400">{s.benefits}</td>)}
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Target Group</td>
                {schemes.map(s => (
                  <td key={s.id} className="p-3.5">
                    {Array.isArray(s.targetBeneficiaries) ? s.targetBeneficiaries.join(', ') : s.targetBeneficiaries}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Scope</td>
                {schemes.map(s => <td key={s.id} className="p-3.5 capitalize">{s.scope} Scheme</td>)}
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Helpline</td>
                {schemes.map(s => <td key={s.id} className="p-3.5 font-bold text-white">{s.helplineNumber || '1800-11-0001'}</td>)}
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-400 bg-slate-900/50">Official Apply</td>
                {schemes.map(s => (
                  <td key={s.id} className="p-3.5">
                    <a
                      href={s.officialApplyLink || s.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-slate-900 font-extrabold rounded-xl inline-block hover:bg-slate-100 min-h-[44px] flex items-center justify-center text-center"
                    >
                      Apply Now ↗
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
