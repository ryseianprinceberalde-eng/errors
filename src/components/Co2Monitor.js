import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { weatherService } from '../services/weatherService';

const Co2Monitor = () => {
  const [co2Data, setCo2Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState({
    latMin: 10,
    latMax: 20,
    lonMin: 120,
    lonMax: 130
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCo2Data = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await weatherService.getCo2Data({
        ...selectedRegion,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      });
      
      setCo2Data(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch CO2 data. Please try again.');
      console.error('CO2 data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCo2Data();
  }, []);

  const getCo2Status = (concentration) => {
    if (concentration < 350) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (concentration < 400) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (concentration < 450) return { status: 'moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'high', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'moderate': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'high': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                Atmospheric CO₂ Monitor
              </h1>
              <p className="mt-2 text-gray-600">
                NASA OCO-2 Satellite Data - Real-time Atmospheric Carbon Dioxide Monitoring
              </p>
            </div>
            <button
              onClick={fetchCo2Data}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Region Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Region Selection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Latitude
              </label>
              <input
                type="number"
                value={selectedRegion.latMin}
                onChange={(e) => setSelectedRegion({...selectedRegion, latMin: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                step="0.1"
                min="-90"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Latitude
              </label>
              <input
                type="number"
                value={selectedRegion.latMax}
                onChange={(e) => setSelectedRegion({...selectedRegion, latMax: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                step="0.1"
                min="-90"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Longitude
              </label>
              <input
                type="number"
                value={selectedRegion.lonMin}
                onChange={(e) => setSelectedRegion({...selectedRegion, lonMin: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                step="0.1"
                min="-180"
                max="180"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Longitude
              </label>
              <input
                type="number"
                value={selectedRegion.lonMax}
                onChange={(e) => setSelectedRegion({...selectedRegion, lonMax: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                step="0.1"
                min="-180"
                max="180"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* CO2 Data Display */}
        {co2Data && (
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                CO₂ Summary Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {co2Data.statistics?.mean || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Mean CO₂ (ppm)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {co2Data.statistics?.min || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Minimum (ppm)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {co2Data.statistics?.max || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Maximum (ppm)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {co2Data.statistics?.dataPoints || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Data Points</div>
                </div>
              </div>
            </div>

            {/* Data Quality Distribution */}
            {co2Data.statistics?.qualityDistribution && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Data Quality Distribution
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(co2Data.statistics.qualityDistribution).map(([quality, count]) => (
                    <div key={quality} className="text-center p-4 rounded-lg bg-gray-50">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">{quality}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CO2 Data Points */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                CO₂ Concentration Data Points
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CO₂ (ppm)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uncertainty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {co2Data.data?.slice(0, 20).map((point, index) => {
                      const status = getCo2Status(point.co2Concentration);
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {point.latitude.toFixed(2)}°, {point.longitude.toFixed(2)}°
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {point.co2Concentration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ±{point.uncertainty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg}`}>
                              {getStatusIcon(point.quality)}
                              <span className={`ml-1 ${status.color}`}>
                                {point.quality}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Data Source Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Source</h3>
                  <p className="text-gray-600">{co2Data.metadata?.source}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Dataset</h3>
                  <p className="text-gray-600">{co2Data.metadata?.dataset}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Methodology</h3>
                  <p className="text-gray-600">{co2Data.metadata?.methodology}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Data Quality</h3>
                  <p className="text-gray-600">{co2Data.metadata?.dataQuality}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-2" />
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Co2Monitor;
