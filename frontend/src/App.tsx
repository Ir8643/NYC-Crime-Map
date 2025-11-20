import React, { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { Map } from './components/Map';
import { Feed } from './components/Feed';
import { Charts } from './components/Charts';
import { usePlayback } from './hooks/usePlayback';
import { fetchIncidents } from './services/api';
import type { NormalizedIncident } from './types';

function App() {
  const [allIncidents, setAllIncidents] = useState<NormalizedIncident[]>([]);
  const [status, setStatus] = useState('Loading data...');
  const [error, setError] = useState<string | null>(null);

  const {
    displayedIncidents,
    currentIndex,
    isPlaying,
    start,
    pause,
    reset
  } = usePlayback(allIncidents, 200);

  useEffect(() => {
    async function loadData() {
      setStatus('Fetching data from APIs...');
      setError(null);
      
      try {
        const response = await fetchIncidents();
        
        if (response.success && response.data.length > 0) {
          setAllIncidents(response.data);
          setStatus(`Ready. ${response.data.length} incidents loaded. Click Play to start.`);
        } else {
          const errorMsg = response.message || response.error || 'Failed to load data';
          setError(errorMsg);
          setStatus(`Error: ${errorMsg}`);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        setStatus(`Error: ${errorMsg}`);
      }
    }

    loadData();
  }, []);

  const handleReset = () => {
    reset();
    setStatus('Reset. Click Play to start.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <Controls
          isPlaying={isPlaying}
          currentIndex={currentIndex}
          totalCount={allIncidents.length}
          onPlay={start}
          onPause={pause}
          onReset={handleReset}
          status={error ? `Error: ${error}` : status}
        />

        {error && allIncidents.length === 0 && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
            <strong>⚠️ Connection Error:</strong>
            <p className="mt-2">{error}</p>
            <div className="mt-3 text-sm">
              <p className="font-semibold mb-1">Troubleshooting steps:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your internet connection</li>
                <li>Verify the backend server is running on port 3001</li>
                <li>Check if DNS resolution is working (try: ping data.cityofnewyork.us)</li>
                <li>Check browser console and backend logs for more details</li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Map incidents={displayedIncidents} />
          </div>
          <div>
            <Feed incidents={displayedIncidents} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Charts incidents={displayedIncidents} />
        </div>
      </div>
    </div>
  );
}

export default App;

