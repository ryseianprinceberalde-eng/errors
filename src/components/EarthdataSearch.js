import React, { useState } from 'react';
import { Search, Database, Download, Loader } from 'lucide-react';
import earthdataService from '../services/api/earthdataService';

const EarthdataSearch = ({ coordinates, date }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [granules, setGranules] = useState([]);

  // Search for datasets
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bbox = {
        north: coordinates.lat + 2,
        south: coordinates.lat - 2,
        east: coordinates.lon + 2,
        west: coordinates.lon - 2
      };

      const params = earthdataService.buildSearchParams({
        keyword: searchTerm,
        startDate: date,
        bbox
      });

      const results = await earthdataService.searchDatasets(params);
      setDatasets(results);
      setSelectedDataset(null);
      setGranules([]);
    } catch (error) {
      console.error('Error searching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch granules for selected dataset
  const handleDatasetSelect = async (dataset) => {
    setSelectedDataset(dataset);
    setLoading(true);
    try {
      const bbox = {
        north: coordinates.lat + 2,
        south: coordinates.lat - 2,
        east: coordinates.lon + 2,
        west: coordinates.lon - 2
      };

      const params = earthdataService.buildSearchParams({
        startDate: date,
        bbox
      });

      const granuleResults = await earthdataService.getGranules(dataset.id, params);
      setGranules(granuleResults);
    } catch (error) {
      console.error('Error fetching granules:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Database className="h-5 w-5" />
          NASA Earth Science Data
        </h3>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for datasets (e.g., precipitation, temperature)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
      </form>

      {/* Results List */}
      <div className="space-y-4">
        {datasets.map((dataset) => (
          <div
            key={dataset.id}
            className={`p-4 rounded-lg border ${
              selectedDataset?.id === dataset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            } cursor-pointer transition-colors`}
            onClick={() => handleDatasetSelect(dataset)}
          >
            <h4 className="font-medium text-gray-900">{dataset.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{dataset.summary}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Provider: {dataset.data_center}</span>
              {dataset.time_start && (
                <span>
                  Period: {new Date(dataset.time_start).toLocaleDateString()} -{' '}
                  {dataset.time_end
                    ? new Date(dataset.time_end).toLocaleDateString()
                    : 'Present'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Granules List */}
      {selectedDataset && granules.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Available Data Files</h4>
          <div className="space-y-2">
            {granules.map((granule) => (
              <div
                key={granule.id}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(granule.time_start).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">{granule.title}</p>
                </div>
                {granule.links?.map((link) => (
                  link.rel === 'download' && (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-1 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthdataSearch;