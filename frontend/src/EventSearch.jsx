import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/search/';

export default function EventSearch() {
  const [searchString, setSearchString] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(null);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setLoading(true);
    setError('');
    setResults([]);
    setSearchTime(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search_string: searchString,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      if (!res.ok) {
        let msg = 'Search failed';
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {
          //Error 
        }
        throw new Error(msg);
      }
      const data = await res.json();
      setResults(data.results || []);
      setSearchTime(data.search_time);
    } catch (err) {
      setError(err.message || 'Error searching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Event <span className="text-indigo-300 font-normal">Analytics</span>
          </h1>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Advanced network event analysis with precision timing and intelligent filtering
          </p>
        </div>

        {/* Refined Search Form */}
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-xl border border-white/10 p-8 mb-10 hover:bg-white/[0.07] transition-all duration-300">
          <div className="space-y-6">
            {/* Search Query */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-200 backdrop-blur-sm"
                  placeholder="e.g. 58.205.48.62 or dstaddr=221.181.27.227"
                  value={searchString}
                  onChange={e => setSearchString(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Start Time
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-200"
                  placeholder="1725850449"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  End Time
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400/50 transition-all duration-200"
                  placeholder="1725855086"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Events...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span>Search Events</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {searchTime !== null && !error && (
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-300">
                Search completed in <span className="font-mono bg-emerald-500/20 px-2 py-1 rounded text-emerald-200">{searchTime}s</span>
              </span>
            </div>
          </div>
        )}

        {/* No Results */}
        {touched && !loading && !error && results.length === 0 && searchTime !== null && (
          <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-8 text-center backdrop-blur-sm">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-slate-300 mb-2">No Events Found</h3>
            <p className="text-slate-400">Try adjusting your search parameters or time range</p>
          </div>
        )}

        {/* Refined Results Table */}
        {results.length > 0 && (
          <div className="bg-slate-800/40 border border-slate-600/30 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="bg-slate-800/60 px-6 py-4 border-b border-slate-600/30">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Search Results</h2>
                <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg text-sm font-medium">
                  {results.length} events
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600/30">
                    <th className="text-left py-3 px-4 font-medium text-slate-400 text-sm">File</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400 text-sm">Connection</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400 text-sm">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400 text-sm">Start</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400 text-sm">End</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-slate-300">
                        <div className="bg-slate-700/50 px-3 py-1 rounded text-xs">
                          {r.file}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                            {r.event.srcaddr}
                          </span>
                          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5" />
                          </svg>
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                            {r.event.dstaddr}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs border border-indigo-500/30">
                          {r.event.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs border border-emerald-500/30">
                          {r.event['log-status']}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-slate-300">
                        {r.event.starttime}
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-slate-300">
                        {r.event.endtime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}