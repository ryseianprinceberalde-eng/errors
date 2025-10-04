import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WeatherMap = ({ coordinates, onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([coordinates.lat, coordinates.lon], 10);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker
    const marker = L.marker([coordinates.lat, coordinates.lon])
      .addTo(map)
      .bindPopup(`
        <div class="text-center">
          <strong>Selected Location</strong><br/>
          Lat: ${coordinates.lat.toFixed(4)}<br/>
          Lon: ${coordinates.lon.toFixed(4)}
        </div>
      `);
    
    markerRef.current = marker;

    // Add click handler
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.setPopupContent(`
          <div class="text-center">
            <strong>Selected Location</strong><br/>
            Lat: ${lat.toFixed(4)}<br/>
            Lon: ${lng.toFixed(4)}
          </div>
        `);
      }
      
      // Call callback
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && coordinates.lat && coordinates.lon) {
      const newLatLng = [coordinates.lat, coordinates.lon];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, 10);
      
      markerRef.current.setPopupContent(`
        <div class="text-center">
          <strong>Selected Location</strong><br/>
          Lat: ${coordinates.lat.toFixed(4)}<br/>
          Lon: ${coordinates.lon.toFixed(4)}
        </div>
      `);
    }
  }, [coordinates]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      />
      
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-[1000]">
        <p className="text-sm text-gray-600 mb-1">
          <strong>Click on the map</strong> to select a new location
        </p>
        <p className="text-xs text-gray-500">
          Current: {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
        </p>
      </div>
    </div>
  );
};

export default WeatherMap;
