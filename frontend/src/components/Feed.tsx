import React from 'react';
import type { NormalizedIncident } from '../types';

interface FeedProps {
  incidents: NormalizedIncident[];
}

export const Feed: React.FC<FeedProps> = ({ incidents }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Live Feed</h2>
      <div className="h-[500px] overflow-y-auto space-y-2">
        {incidents.length === 0 ? (
          <p className="text-gray-400 text-sm">Waiting for data...</p>
        ) : (
          incidents.slice().reverse().map(incident => {
            const bgColor = incident.type === 'NYPD' ? 'bg-red-900' : 'bg-blue-900';
            return (
              <div
                key={incident.id}
                className={`${bgColor} p-3 rounded text-sm animate-slide-in`}
              >
                <div className="font-semibold">{incident.type}</div>
                <div className="text-gray-300">{incident.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(incident.date).toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

