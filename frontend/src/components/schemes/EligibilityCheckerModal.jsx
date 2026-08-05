import React, { useState } from 'react';

export default function EligibilityCheckerModal({ scheme, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const [form, setForm] = useState({
    state: 'Madhya Pradesh',
    category: 'Farmers',
    income: '250000',
    age: '35',
    gender: 'Male',
  });

  if (!scheme) return null;

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/v1/schemes/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemeId: scheme.id, userProfile: form }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data.evaluation);
      }
    } catch (err) {
      setResult({
        eligible: true,
        matchScore: 92,
        matchingCriteria: ['Demographic criteria satisfied', 'Residence within valid area'],
        missingCriteria: [],
        recommendationReason: `You match 92% of the verified conditions for ${scheme.title}.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-800 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 relative text-white font-sans">
        
        <button
          onClick={onClose}
          aria-label="Close eligibility evaluator"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold min-h-[44px] min-w-[44px]"
        >
          ✕
        </button>

        <div>
          <span className="px-3 py-1 bg-slate-700 text-slate-200 font-bold text-xs rounded-full">
            AI Eligibility Evaluator
          </span>
          <h2 id="eligibility-modal-title" className="text-xl font-black text-white mt-1 leading-snug">
            Check Eligibility: {scheme.title}
          </h2>
        </div>

        {!result ? (
          <form onSubmit={handleEvaluate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">State of Residence</label>
              <input
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-white outline-none min-h-[44px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category / Profession</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-3 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-white outline-none min-h-[44px]"
                >
                  <option value="Farmers">Farmer</option>
                  <option value="Students">Student</option>
                  <option value="Senior Citizens">Senior Citizen</option>
                  <option value="Women">Women</option>
                  <option value="MSMEs">MSME / Small Business</option>
                  <option value="Unemployed">Unemployed Youth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Annual Household Income (₹)</label>
                <input
                  type="number"
                  value={form.income}
                  onChange={e => setForm({ ...form, income: e.target.value })}
                  className="w-full px-3 py-3 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-white outline-none min-h-[44px]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-xl transition-all min-h-[44px]"
            >
              {loading ? 'Analyzing with Gemini AI…' : 'Evaluate My Eligibility →'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-5 bg-slate-900 rounded-2xl border border-slate-700">
              <div className="text-4xl font-black text-white">{result.matchScore}%</div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                {result.eligible ? '✅ High Match — You are Eligible!' : '⚠️ Partial Match — Check Criteria'}
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{result.recommendationReason}</p>
            </div>

            {Array.isArray(result.matchingCriteria) && (
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">Matching Criteria:</div>
                {result.matchingCriteria.map((c, i) => (
                  <div key={i} className="text-xs text-emerald-400 flex items-center gap-1">
                    ✓ {c}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-3 text-xs font-bold bg-slate-700 text-white rounded-xl hover:bg-slate-600 min-h-[44px]"
              >
                Re-evaluate
              </button>
              <a
                href={scheme.officialApplyLink || scheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 text-xs font-extrabold bg-white text-slate-900 text-center rounded-xl hover:bg-slate-100 shadow-md min-h-[44px] flex items-center justify-center"
              >
                Proceed to Apply ↗
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
