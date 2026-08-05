import React, { useState, useEffect } from 'react';
import SchemeCard from '../../components/schemes/SchemeCard';
import SchemeDetailModal from '../../components/schemes/SchemeDetailModal';
import SchemeCompareModal from '../../components/schemes/SchemeCompareModal';
import EligibilityCheckerModal from '../../components/schemes/EligibilityCheckerModal';

const CATEGORIES = [
  'All', 'Agriculture', 'Health', 'Education', 'Housing', 'Employment',
  'Business', 'Women', 'Financial Assistance', 'Senior Citizens', 'Students', 'MSMEs'
];

const BADGE_FILTERS = ['All', 'Newly Launched', 'Recently Updated', 'Popular'];

export default function SchemeExplorerPage() {
  const [schemes, setSchemes]         = useState([]);
  const [syncMetrics, setSyncMetrics] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [syncing, setSyncing]         = useState(false);
  const [error, setError]             = useState('');

  // Filters
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [scope, setScope]             = useState('All'); // 'All' | 'central' | 'state'
  const [badgeTag, setBadgeTag]       = useState('All');

  // Modals & Interactive States
  const [selectedScheme, setSelectedScheme]     = useState(null);
  const [eligibilityScheme, setEligibilityScheme] = useState(null);
  const [comparedIds, setComparedIds]           = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [savedIds, setSavedIds]                 = useState([]);

  // Fetch schemes from backend API
  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (scope !== 'All') params.append('scope', scope);
      if (badgeTag !== 'All') params.append('tag', badgeTag);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`http://localhost:5000/api/v1/schemes?${params.toString()}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setSchemes(json.data.data || []);
        if (json.data.syncMetrics) {
          setSyncMetrics(json.data.syncMetrics);
        }
      } else {
        throw new Error(json.message || 'Failed to fetch government schemes');
      }
    } catch (err) {
      setError(err.message);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category, scope, badgeTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  // Manual Synchronization Trigger
  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/schemes/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncMetrics(json.data);
        await fetchSchemes();
      }
    } catch (err) {
      alert('Sync failed: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Compare
  const handleToggleCompare = (id) => {
    setComparedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  // Toggle Bookmark
  const handleToggleSave = async (id) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    try {
      await fetch(`http://localhost:5000/api/v1/schemes/${id}/save`, { method: 'POST' });
    } catch (err) {}
  };

  const comparedSchemesList = schemes.filter(s => comparedIds.includes(s.id));

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Top Banner: Sync Status & Official Source Verification */}
      <div className="bg-slate-800 border border-slate-700 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Official Real-Time Portal · Government of India
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Verified Government Schemes</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Live updates directly from <strong className="text-white">myScheme.gov.in</strong> and <strong className="text-white">data.gov.in</strong> datasets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
            <div className="text-xs text-slate-300 text-right sm:text-left">
              <div>Last Synced: <strong className="text-white">{syncMetrics?.lastSyncedAt ? new Date(syncMetrics.lastSyncedAt).toLocaleString('en-IN') : 'Just Now'}</strong></div>
              <div className="text-[11px] text-slate-400">Deduplicated & Verified</div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={syncing}
              aria-label="Synchronize live government scheme feeds"
              className="px-4 py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-all flex items-center gap-2 min-h-[44px]"
            >
              <span className={syncing ? 'animate-spin' : ''}>🔄</span>
              {syncing ? 'Syncing Feeds…' : 'Sync Live Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by scheme name, ministry, or keywords (e.g. PM-KISAN, Farmers, Scholarship)…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-white outline-none transition-all min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            aria-label="Search schemes"
            className="px-6 py-3 bg-white text-slate-900 font-extrabold text-sm rounded-xl transition-all shadow-md hover:bg-slate-100 min-h-[44px]"
          >
            Search
          </button>
        </form>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700 text-xs">
          {/* Scope selection */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Scope:</span>
            {['All', 'central', 'state'].map(s => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-3 py-2 rounded-lg capitalize transition-all min-h-[44px] ${
                  scope === s
                    ? 'bg-white text-slate-900 font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {s === 'All' ? 'All Schemes' : `${s} Schemes`}
              </button>
            ))}
          </div>

          {/* Badge Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Tag:</span>
            {BADGE_FILTERS.map(b => (
              <button
                key={b}
                onClick={() => setBadgeTag(b)}
                className={`px-3 py-2 rounded-lg transition-all min-h-[44px] ${
                  badgeTag === b
                    ? 'bg-white text-slate-900 font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 min-h-[44px] ${
              category === cat
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Compare Floating Bar */}
      {comparedIds.length > 0 && (
        <div className="sticky top-4 z-30 p-4 bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200">
          <div className="text-xs">
            <strong className="text-white">{comparedIds.length}</strong> scheme{comparedIds.length > 1 ? 's' : ''} selected for comparison.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparedIds([])}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl min-h-[44px]"
            >
              Clear
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-xl hover:bg-slate-100 shadow-md min-h-[44px]"
            >
              Compare Side-by-Side →
            </button>
          </div>
        </div>
      )}

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-pulse space-y-4">
              <div className="h-4 bg-slate-700 rounded w-1/3" />
              <div className="h-6 bg-slate-700 rounded w-3/4" />
              <div className="h-16 bg-slate-900 rounded-xl" />
              <div className="h-8 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-800 rounded-3xl p-12 text-center border border-slate-700 space-y-4 shadow-xl">
          <div className="text-6xl mb-2">🏛️</div>
          <h3 className="text-xl font-bold text-white">
            No verified government schemes are currently available.
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {error || 'No active schemes match your filter criteria. Click below to trigger a live synchronization from official government feeds.'}
          </p>
          <button
            onClick={handleManualSync}
            className="px-6 py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all min-h-[44px]"
          >
            🔄 Sync Live Schemes Now
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map(scheme => (
            <SchemeCard
              key={scheme.id || scheme.schemeId}
              scheme={scheme}
              onViewDetails={setSelectedScheme}
              onCheckEligibility={setEligibilityScheme}
              onToggleCompare={handleToggleCompare}
              isCompared={comparedIds.includes(scheme.id)}
              onToggleSave={handleToggleSave}
              isSaved={savedIds.includes(scheme.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
          onCheckEligibility={setEligibilityScheme}
        />
      )}

      {eligibilityScheme && (
        <EligibilityCheckerModal
          scheme={eligibilityScheme}
          onClose={() => setEligibilityScheme(null)}
        />
      )}

      {showCompareModal && (
        <SchemeCompareModal
          schemes={comparedSchemesList}
          onClose={() => setShowCompareModal(false)}
        />
      )}

    </div>
  );
}
