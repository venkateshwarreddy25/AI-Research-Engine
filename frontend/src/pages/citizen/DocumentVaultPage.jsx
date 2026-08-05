import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';

const DOCUMENT_TYPES = [
  { id: 'aadhaar',            label: 'Aadhaar Card',             icon: '🪪' },
  { id: 'income-certificate', label: 'Income Certificate',       icon: '📜' },
  { id: 'caste-certificate',  label: 'Caste Certificate',        icon: '📋' },
  { id: 'marksheet',          label: 'Marksheet / Board Result',  icon: '🎓' },
  { id: 'bank-passbook',      label: 'Bank Passbook',            icon: '🏦' },
];

const SCHEME_OPTIONS = ['PM-KISAN', 'PMAY', 'PM-JAY', 'NSP', 'PM Vishwakarma', 'Mudra Loan', 'Lakhpati Didi'];

export default function DocumentVaultPage() {
  const [selectedDocType, setSelectedDocType] = useState('aadhaar');
  const [targetScheme, setTargetScheme]        = useState('PM-KISAN');
  const [submittedDocs, setSubmittedDocs]      = useState([]);
  const [result, setResult]                    = useState(null);
  const [loading, setLoading]                  = useState(false);
  const [error, setError]                      = useState('');
  const [dragOver, setDragOver]                = useState(false);

  const toggleSubmitted = (label) => {
    setSubmittedDocs(prev => prev.includes(label) ? prev.filter(d => d !== label) : [...prev, label]);
  };

  const handleVerify = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await fetch('http://localhost:5000/api/v1/ocr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: selectedDocType, targetScheme, submittedDocTypes: submittedDocs }),
      });
      const json = await res.json();
      if (res.ok && json.success) { setResult(json.data); }
      else { setError(json.message || 'Verification failed'); }
    } catch (err) {
      setError('Backend server not reachable. Ensure server is running on port 5000.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white font-sans">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-full">📄 OCR Document Intelligence Vault</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-3 mb-2 text-white">Document Verification Assistant</h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">AI-powered OCR verification with instant validation, expiry checks, and a personalised missing document checklist for your target scheme.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          {/* Doc Type */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3 shadow-xl">
            <h2 className="font-extrabold text-white text-sm">1. Select Document Type</h2>
            <div className="grid gap-2">
              {DOCUMENT_TYPES.map(dt => (
                <button key={dt.id} onClick={() => setSelectedDocType(dt.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-sm font-bold ${selectedDocType === dt.id
                    ? 'border-white bg-slate-700 text-white'
                    : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">{dt.icon}</div>
                  {dt.label}
                  {selectedDocType === dt.id && <span className="ml-auto text-white font-black">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Selector */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3 shadow-xl">
            <h2 className="font-extrabold text-white text-sm">2. Select Target Scheme</h2>
            <select value={targetScheme} onChange={e => setTargetScheme(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-bold focus:ring-2 focus:ring-white outline-none">
              {SCHEME_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragOver ? 'border-white bg-slate-800' : 'border-slate-700 bg-slate-900/60'}`}
          >
            <div className="text-4xl mb-3">📤</div>
            <div className="font-bold text-slate-200 text-sm mb-1">Drop document here or click to upload</div>
            <div className="text-xs text-slate-400">Supports PDF, JPG, PNG · Max 5MB per file</div>
            <div className="mt-3 text-[11px] text-slate-300 font-extrabold bg-slate-800 border border-slate-700 px-3 py-1 rounded-full inline-block">🔒 Secure · Privacy-first OCR Processing</div>
          </div>

          <button onClick={handleVerify} disabled={loading}
            className="w-full py-4 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl transition-all hover:-translate-y-0.5">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Verifying Document…
              </span>
            ) : '🔍 Verify Document & Generate Checklist'}
          </button>
          {error && <p className="text-red-400 text-xs font-bold text-center bg-red-950/60 border border-red-800 rounded-xl p-3">{error}</p>}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* Submitted tracker */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3 shadow-xl">
            <h2 className="font-extrabold text-white text-sm">Documents Already Submitted</h2>
            <div className="flex flex-wrap gap-2">
              {['Aadhaar Card','Income Certificate','Caste Certificate','Marksheet','Bank Passbook','Photograph','Ration Card'].map(doc => (
                <button key={doc} onClick={() => toggleSubmitted(doc)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${submittedDocs.includes(doc)
                    ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                  {submittedDocs.includes(doc) ? '✓ ' : ''}{doc}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {result && (
            <>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="font-extrabold text-white text-sm">OCR Extracted Data</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${result.isValid ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                      {result.isValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-200 rounded-lg text-xs font-bold">{result.confidence}% accuracy</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(result.extracted).filter(([k]) => k !== 'valid').map(([key, val]) => (
                    <div key={key} className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-slate-400 capitalize min-w-[130px]">{key.replace(/([A-Z])/g,' $1').trim()}:</span>
                      <span className="font-extrabold text-white">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-extrabold text-white text-sm">Document Checklist — {result.checklist.completionPercentage}%</h2>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full bg-white transition-all duration-700" style={{ width: `${result.checklist.completionPercentage}%` }} />
                </div>
                <div className="space-y-2">
                  {result.checklist.requiredDocuments.map(doc => {
                    const submitted = result.checklist.submittedDocuments.some(s => s.toLowerCase().includes(doc.toLowerCase().split(' ')[0]));
                    return (
                      <div key={doc} className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${submitted ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-red-950/60 text-red-300 border border-red-800'}`}>
                        <span>{submitted ? '✅' : '❌'}</span>
                        {doc}
                        {!submitted && <span className="ml-auto text-[10px] bg-red-900 border border-red-700 px-2 py-0.5 rounded-full">MISSING</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="bg-slate-800 rounded-2xl border border-dashed border-slate-700 p-10 text-center shadow-xl">
              <div className="text-5xl mb-3">📂</div>
              <p className="font-extrabold text-white text-sm">Select a document type and click Verify</p>
              <p className="text-slate-400 text-xs mt-1">OCR data, validity check, and document checklist will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
