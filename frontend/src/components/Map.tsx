import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { NormalizedIncident } from '../types';

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface MapProps {
  incidents: NormalizedIncident[];
}

function MapUpdater({ incidents }: { incidents: NormalizedIncident[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (incidents.length > 0) {
      try {
        const bounds = incidents.map(inc => inc.coords).filter(Boolean) as [number, number][];
        if (bounds.length > 0) {
          if (bounds.length === 1) {
            // If only one point, just set the view to that point
            map.setView(bounds[0], 13);
          } else {
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        }
      } catch (error) {
        console.error('Error updating map bounds:', error);
      }
    }
  }, [incidents, map]);
  
  return null;
}

export const Map: React.FC<MapProps> = ({ incidents }) => {
  const createCustomIcon = useMemo(() => {
    return (type: '311' | 'NYPD') => {
      const color = type === 'NYPD' ? 'red' : 'blue';
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 12px;
          height: 12px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(0,0,0,0.5);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
    };
  }, []);

  // Filter out incidents with invalid coordinates
  const validIncidents = useMemo(() => {
    return incidents.filter(inc => 
      inc.coords && 
      Array.isArray(inc.coords) && 
      inc.coords.length === 2 &&
      typeof inc.coords[0] === 'number' &&
      typeof inc.coords[1] === 'number' &&
      !isNaN(inc.coords[0]) &&
      !isNaN(inc.coords[1])
    );
  }, [incidents]);

  if (typeof window === 'undefined') {
    return null; // SSR guard
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Incident Map</h2>
      <div className="h-[500px] rounded-lg overflow-hidden">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater incidents={validIncidents} />
          {validIncidents.map(incident => (
            <Marker
              key={incident.id}
              position={incident.coords}
              icon={createCustomIcon(incident.type)}
            >
              <Popup>
                <div>
                  <strong>{incident.type}</strong><br />
                  {incident.description}<br />
                  <small>{new Date(incident.date).toLocaleString()}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

