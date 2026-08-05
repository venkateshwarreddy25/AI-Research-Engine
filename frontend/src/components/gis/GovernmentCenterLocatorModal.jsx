import React, { useState, useEffect } from 'react';

const CENTER_TYPES = ['All', 'CSC', 'Aadhaar Center', 'MeeSeva', 'RTO Office', 'Passport Office', 'Government Hospital', 'Bank Branch'];

const TYPE_ICONS = {
  'CSC':                '🏛️',
  'Aadhaar Center':     '🪪',
  'MeeSeva':            '📋',
  'RTO Office':         '🚗',
  'Passport Office':    '🛂',
  'Government Hospital':'🏥',
  'Bank Branch':        '🏦',
};

const TYPE_COLORS = {
  'CSC':                'bg-slate-900 text-slate-200 border-slate-700',
  'Aadhaar Center':     'bg-slate-900 text-slate-200 border-slate-700',
  'MeeSeva':            'bg-slate-900 text-slate-200 border-slate-700',
  'RTO Office':         'bg-slate-900 text-slate-200 border-slate-700',
  'Passport Office':    'bg-slate-900 text-slate-200 border-slate-700',
  'Government Hospital':'bg-slate-900 text-slate-200 border-slate-700',
  'Bank Branch':        'bg-slate-900 text-slate-200 border-slate-700',
};

export default function GovernmentCenterLocatorModal({ onClose }) {
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch]             = useState('');
  const [centers, setCenters]           = useState([]);
  const [loading, setLoading]           = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 17.3850, lng: 78.4867 });

  const fetchCenters = async (lat, lng, type, q) => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/v1/gis/nearby?lat=${lat}&lng=${lng}&type=${encodeURIComponent(type)}&search=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success) setCenters(json.data);
    } catch (err) {
      console.error('GIS fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters(userLocation.lat, userLocation.lng, selectedType, search);
  }, [selectedType, search, userLocation]);

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserLocation({ lat, lng });
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gis-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-slate-700 shadow-2xl relative flex flex-col text-white font-sans">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 px-6 py-5 rounded-t-3xl flex-shrink-0 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-full">
                📍 GIS Government Center Finder
              </span>
              <h2 id="gis-modal-title" className="text-xl sm:text-2xl font-black text-white mt-2">Locate Nearby Government Offices</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                CSC Centers · Aadhaar Seva Kendra · MeeSeva · RTO · Passport Office · Banks · Hospitals
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close GIS locator"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ml-3 min-h-[44px] min-w-[44px]"
            >
              ✕
            </button>
          </div>

          {/* Search & Location Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by service type or city…"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-white outline-none min-h-[44px]"
            />
            <button
              onClick={handleGetMyLocation}
              className="px-4 py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 min-h-[44px]"
            >
              📍 Use My Location
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1 space-y-5">
          {/* Type Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CENTER_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-2 rounded-full text-xs font-extrabold border transition-all min-h-[44px] ${
                  selectedType === t
                    ? 'bg-white text-slate-900 border-white shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                {TYPE_ICONS[t] || '🏛️'} {t}
              </button>
            ))}
          </div>

          {/* Centers Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-slate-400 text-sm font-medium">Locating nearby centers…</span>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {centers.map(c => (
                <div
                  key={c.id}
                  className="bg-slate-900 rounded-2xl border border-slate-700 p-4 hover:border-slate-500 transition-all space-y-3 shadow-xl"
                >
                  {/* Center Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${TYPE_COLORS[c.type] || 'bg-slate-800 text-slate-200'}`}>
                        {TYPE_ICONS[c.type] || '🏛️'} {c.type}
                      </span>
                      <h3 className="font-extrabold text-white text-sm mt-2 leading-snug">{c.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{c.address}, {c.city}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-black text-white">{c.distanceKm} km</div>
                      <div className="text-[11px] text-slate-500">~{c.estimatedTravelTimeMinutes} min</div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5">
                    {c.servicesProvided.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400">
                      🕐 {c.workingHours}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${c.contactNumber}`} className="px-3 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-700 min-h-[44px] flex items-center justify-center">
                        📞 Call
                      </a>
                      <a
                        href={c.googleMapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white text-slate-900 font-extrabold rounded-lg text-xs hover:bg-slate-100 min-h-[44px] flex items-center justify-center"
                      >
                        🗺️ Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && centers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-bold text-white text-sm">No centers found for the selected filter</p>
              <p className="text-slate-400 text-xs mt-1">Try selecting a different type or clearing the search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
