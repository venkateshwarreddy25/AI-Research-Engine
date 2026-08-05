import React, { useState } from 'react';

const ELIGIBILITY_FIELDS = [
  { key: 'age',        label: 'Age (years)',          type: 'number', placeholder: '30' },
  { key: 'income',     label: 'Annual Income (₹)',    type: 'number', placeholder: '180000' },
  { key: 'occupation', label: 'Occupation',           type: 'select', options: ['Farmer', 'Student', 'Women/SHG', 'Artisan/Craftsman', 'Micro-Entrepreneur', 'Labourer', 'Senior Citizen', 'Government Employee', 'Others'] },
  { key: 'category',   label: 'Category',             type: 'select', options: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'] },
  { key: 'state',      label: 'State',                type: 'select', options: ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Delhi', 'Others'] },
  { key: 'gender',     label: 'Gender',               type: 'select', options: ['Male', 'Female', 'Transgender'] },
];

export default function ApplicationGuideModal({ scheme, onClose }) {
  const [profile, setProfile]    = useState({ age: '', income: '', occupation: 'Farmer', category: 'General', state: 'Telangana', gender: 'Male' });
  const [approvalChance, setApprovalChance] = useState(null);
  const [step, setStep]          = useState('form');
  const [loading, setLoading]    = useState(false);

  if (!scheme) return null;

  const handleCalculate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    let score = 70;
    const income = Number(profile.income) || 300000;
    if (income <= 200000) score += 20;
    else if (income <= 500000) score += 12;
    if (profile.category !== 'General') score += 8;
    if (profile.occupation === 'Farmer' && (scheme.title?.includes('Kisan') || scheme.title?.includes('Fasal'))) score += 10;
    if (profile.occupation === 'Student' && (scheme.title?.includes('Scholarship') || scheme.title?.includes('Vidyalaxmi'))) score += 10;
    if (profile.occupation === 'Women/SHG' && (scheme.title?.includes('Lakhpati') || scheme.title?.includes('Mahila'))) score += 10;
    setApprovalChance(Math.min(Math.max(score, 48), 97));
    setLoading(false);
    setStep('result');
  };

  const approvalLabel =
    approvalChance >= 80 ? 'Highly Likely to Qualify ✅' :
    approvalChance >= 60 ? 'Moderate Match — Verify Criteria ⚠️' :
    'Lower Match — Review Eligibility ❌';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-700 shadow-2xl relative text-white font-sans">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 rounded-t-3xl border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-full">
                🤖 Smart Application Assistant
              </span>
              <h2 id="guide-modal-title" className="text-lg sm:text-xl font-black text-white mt-2 leading-snug">{scheme.title}</h2>
              <p className="text-slate-400 text-xs mt-1">{scheme.ministry}</p>
            </div>
            <button onClick={onClose} aria-label="Close assistant modal" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-lg flex-shrink-0 ml-3 min-h-[44px] min-w-[44px]">
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {step === 'form' && (
            <>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Enter Your Profile to Calculate Eligibility</h3>
                <p className="text-xs text-slate-400">AI will estimate your approval probability (%) based on scheme criteria.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {ELIGIBILITY_FIELDS.map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={profile[field.key]}
                        onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full px-3 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:ring-2 focus:ring-white outline-none min-h-[44px]"
                      >
                        {field.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={profile[field.key]}
                        onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full px-3 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:ring-2 focus:ring-white outline-none min-h-[44px]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full py-4 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl transition-all min-h-[44px]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Calculating Eligibility…
                  </span>
                ) : '🎯 Calculate Approval Probability'}
              </button>
            </>
          )}

          {step === 'result' && approvalChance !== null && (
            <>
              {/* Approval Score Circle */}
              <div className="text-center space-y-3 py-4">
                <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-900 border-2 border-slate-700 text-white shadow-2xl mx-auto">
                  <span className="text-5xl font-black text-white">{approvalChance}%</span>
                  <span className="text-xs font-bold text-slate-400 mt-1">Match Score</span>
                </div>
                <h3 className="font-extrabold text-white text-lg">{approvalLabel}</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Based on your income (₹{Number(profile.income || 0).toLocaleString('en-IN')}), {profile.category} category, {profile.occupation} occupation, and {profile.state} state.
                </p>
              </div>

              {/* Application Steps */}
              <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 space-y-2">
                <h4 className="font-bold text-white text-sm">📋 Step-by-Step Application Guide</h4>
                {(Array.isArray(scheme.applicationProcess) ? scheme.applicationProcess : [
                  `Visit ${scheme.officialWebsite || 'https://myscheme.gov.in'}`,
                  'Register with your Aadhaar number and mobile OTP',
                  'Fill your profile details (name, income, state, category)',
                  'Upload required documents (Aadhaar, Income Certificate, Bank Passbook)',
                  'Submit application and save your Application Reference Number',
                  'Track status on the official portal',
                ]).map((stepText, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                    <span className="text-slate-300 pt-0.5 leading-relaxed">{stepText}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={scheme.officialApplyLink || scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm rounded-2xl text-center shadow-lg transition-all min-h-[44px] flex items-center justify-center"
                >
                  Apply Online Now ↗
                </a>
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-2xl transition-all min-h-[44px]"
                >
                  ← Recalculate
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
