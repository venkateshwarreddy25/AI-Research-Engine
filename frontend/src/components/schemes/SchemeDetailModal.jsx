import React from 'react';

export default function SchemeDetailModal({ scheme, onClose, onCheckEligibility }) {
  if (!scheme) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheme-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in duration-200 text-white font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-lg transition-all min-h-[44px] min-w-[44px]"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-3 py-1 bg-slate-700 text-slate-200 font-bold text-xs rounded-full">
              {scheme.category}
            </span>
            <span className="px-3 py-1 bg-slate-700 text-slate-200 text-xs rounded-full">
              {scheme.scope === 'central' ? '🏛️ Central Government Scheme' : '📍 State Scheme'}
            </span>
            {scheme.isVerified && (
              <span className="px-3 py-1 bg-blue-950 text-blue-300 font-bold text-xs rounded-full border border-blue-800 flex items-center gap-1">
                ✓ Official Verified
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 font-medium">{scheme.ministry}</p>
          <h2 id="scheme-detail-title" className="text-2xl font-black text-white mt-1 leading-snug">
            {scheme.title}
          </h2>
        </div>

        {/* Benefits Banner */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            🎁 Primary Benefits & Financial Support
          </h4>
          <p className="text-sm font-bold text-white leading-relaxed">
            {scheme.benefits}
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            🎯 Eligibility Criteria
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {Array.isArray(scheme.eligibilityCriteria) ? (
              scheme.eligibilityCriteria.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{scheme.eligibilityCriteria}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Required Documents */}
        <div className="space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            📄 Required Documents
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(scheme.requiredDocuments) && scheme.requiredDocuments.length > 0 ? (
              scheme.requiredDocuments.map((doc, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-900 text-slate-200 text-xs font-medium rounded-xl border border-slate-700">
                  📑 {doc}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400">Aadhaar Card, Active Mobile Number, Bank Passbook.</p>
            )}
          </div>
        </div>

        {/* Application Process */}
        <div className="space-y-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            📝 Application Process
          </h3>
          <ol className="space-y-2 text-sm text-slate-300">
            {Array.isArray(scheme.applicationProcess) && scheme.applicationProcess.length > 0 ? (
              scheme.applicationProcess.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-400">Apply online through the official portal.</p>
            )}
          </ol>
        </div>

        {/* FAQs */}
        {Array.isArray(scheme.faqs) && scheme.faqs.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base">
              ❓ Frequently Asked Questions (FAQs)
            </h3>
            <div className="space-y-2">
              {scheme.faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900 rounded-xl border border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-white">Q: {faq.question}</div>
                  <div className="text-slate-400">A: {faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info & action bar */}
        <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 space-y-0.5">
            <div>Helpline: <strong className="text-white">{scheme.helplineNumber || '1800-11-0001'}</strong></div>
            <div>Official Portal: <a href={scheme.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-slate-300 underline">{scheme.officialWebsite}</a></div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => { onClose(); onCheckEligibility?.(scheme); }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs rounded-xl min-h-[44px] transition-all"
            >
              ✨ Check My Eligibility
            </button>
            <a
              href={scheme.officialApplyLink || scheme.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-lg min-h-[44px] transition-all flex items-center justify-center"
            >
              Official Apply Portal ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
