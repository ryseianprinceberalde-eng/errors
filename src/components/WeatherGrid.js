import React from 'react';
import PropTypes from 'prop-types';

// Small helper: format temperature and time
const fmtTemp = (t, unit = 'C') => (t == null ? '—' : `${Math.round(t)}°${unit}`);
const fmtTime = (iso) => {
  if (!iso) return 'Unknown';
  const d = new Date(iso);
  return d.toLocaleString();
};

// Minimal icon set (keeps bundle small). Replace with your icon system if available.
function WeatherIcon({ code, size = 36 }) {
  // code: string like 'clear', 'clouds', 'rain', 'snow', 'thunder'
  switch ((code || '').toLowerCase()) {
    case 'clear':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="4" fill="#f59e0b" />
        </svg>
      );
    case 'clouds':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15a4 4 0 010-8 5 5 0 019.9 1.4A3.5 3.5 0 0119 15H5z" fill="#9ca3af" />
        </svg>
      );
    case 'rain':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14a4 4 0 010-8 5 5 0 019.9 1.4A3.5 3.5 0 0119 14H7z" fill="#6b7280" />
          <path d="M9 17l1.5 3M13 17l1.5 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'snow':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6v12M6 12h12M7.2 7.2l9.6 9.6M7.2 16.8l9.6-9.6" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'thunder':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#f97316" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );
  }
}

WeatherIcon.propTypes = { code: PropTypes.string, size: PropTypes.number };

/**
 * WeatherGrid
 * Props:
 * - data: array of weather objects: { id, location, temp, feels_like, condition, wind_kmh, precip_mm, time }
 * - loading, error
 * - unit: 'C' or 'F'
 *
 * Tailwind grid classes used: grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4
 */
export default function WeatherGrid({ data = [], loading = false, error = null, unit = 'C' }) {
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500">Loading weather…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-red-600">
        <div>Failed to load weather: {String(error)}</div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">No weather data available.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {data.map((w) => (
        <article key={w.id || w.location || Math.random()} className="card p-4 bg-white/80 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{w.location || 'Unknown location'}</h3>
              <p className="text-xs text-gray-500">{fmtTime(w.time)}</p>
            </div>
            <div className="flex items-center space-x-3">
              <WeatherIcon code={w.condition} size={44} />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{fmtTemp(w.temp, unit)}</div>
                {w.feels_like != null && <div className="text-xs text-gray-500">Feels like {fmtTemp(w.feels_like, unit)}</div>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 9 4-18 3 9h4"/></svg>
              <span>{w.wind_kmh != null ? `${Math.round(w.wind_kmh)} km/h` : '—'}</span>
            </div>

            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a4 4 0 018 0 5 5 0 11-9 0z"/></svg>
              <span>{w.precip_mm != null ? `${w.precip_mm} mm` : '—'}</span>
            </div>
          </div>

          {/* Optional probability / alert badge */}
          {w.probability != null && (
            <div className="mt-3">
              <div className="text-xs text-gray-500">Precip probability</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                <div className={`h-2 rounded-full ${w.probability >= 70 ? 'bg-red-500' : w.probability >= 40 ? 'bg-yellow-400' : 'bg-green-400'}`} style={{width: `${Math.min(100, Math.max(0, w.probability))}%`}} />
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

WeatherGrid.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.any,
  unit: PropTypes.oneOf(['C', 'F'])
};
