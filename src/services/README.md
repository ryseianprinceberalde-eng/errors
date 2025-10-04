# Weather Services - Modular Architecture

This directory contains the modularized weather and disaster tracking services for the WeatherPredict application.

## Architecture Overview

The services have been refactored from a monolithic `nasaApiService.js` into a modular, maintainable architecture:

```
services/
├── index.js                     # Main exports and legacy compatibility
├── weatherService.js            # Main orchestrating service
├── api/                         # Individual API service modules
│   ├── baseApiService.js        # Base class with common functionality
│   ├── spaceWeatherService.js   # NASA DONKI space weather API
│   ├── disasterTrackingService.js # NASA EONET disaster tracking API
│   └── meteomaticsService.js    # Meteomatics weather API
└── utils/
    └── dataProcessor.js         # Data processing and transformation utilities
```

## Main Services

### WeatherService (Primary Interface)
**File**: `weatherService.js`
**Purpose**: Main orchestrating service that coordinates all weather-related data sources

```javascript
import { weatherService } from '../services/weatherService';

// Get comprehensive weather analysis
const data = await weatherService.getWeatherAnalysis(lat, lon, targetDate);

// Get disaster events for storm tracking
const events = await weatherService.getDisasterEvents(30);

// Get space weather data
const spaceWeather = await weatherService.getSpaceWeatherData(targetDate);
```

### Individual API Services

#### SpaceWeatherService
**File**: `api/spaceWeatherService.js`
**Purpose**: NASA DONKI space weather and CME data
- Fetches Coronal Mass Ejection events
- Calculates space weather impact levels
- Provides atmospheric condition analysis

#### DisasterTrackingService
**File**: `api/disasterTrackingService.js`
**Purpose**: NASA EONET natural disaster tracking
- Fetches real-time disaster events (storms, earthquakes, wildfires, etc.)
- Categorizes events by severity and type
- Provides filtering and statistics

#### MeteomaticsService
**File**: `api/meteomaticsService.js`
**Purpose**: Professional weather data integration
- Enhanced location-based weather simulation
- Philippines-specific climate patterns
- Historical weather data processing

#### BaseApiService
**File**: `api/baseApiService.js`
**Purpose**: Common API functionality
- HTTP request handling with error management
- Date formatting utilities
- Coordinate validation
- Consistent error handling

## Data Processing Utilities

### DataProcessor
**File**: `utils/dataProcessor.js`
**Purpose**: Data transformation and analysis utilities

```javascript
import { processHistoricalData, mergeDataSources, formatForExport } from '../services/utils/dataProcessor';

// Process historical weather data
const processed = processHistoricalData(dailyData, monthlyData);

// Merge multiple data sources
const merged = mergeDataSources(weatherData, spaceWeatherData, disasterData);

// Export data in different formats
const exported = formatForExport(data, 'json'); // or 'csv'
```

## Key Features

### 🔧 **Modular Design**
- **Single Responsibility**: Each service handles one specific data source
- **Loose Coupling**: Services can be used independently
- **Easy Testing**: Individual modules can be unit tested
- **Maintainable**: Clear separation of concerns

### 🚀 **Enhanced Functionality**
- **Error Handling**: Robust error management with fallbacks
- **Data Validation**: Comprehensive data integrity checks
- **Health Monitoring**: Service health checks and status reporting
- **Configuration**: Flexible service configuration options

### 🔄 **Backward Compatibility**
- **Legacy Support**: Existing imports continue to work
- **Gradual Migration**: Components can be updated incrementally
- **Clean Interface**: Simple import structure via `index.js`

## Usage Examples

### Basic Weather Analysis
```javascript
import { weatherService } from '../services';

const analysis = await weatherService.getWeatherAnalysis(14.5995, 120.9842, '2024-10-04');
console.log(analysis.summary);
```

### Storm Tracking
```javascript
import { weatherService } from '../services';

const events = await weatherService.getDisasterEvents(30);
const filtered = weatherService.filterDisasterEvents(events, { 
  category: 'storms', 
  severity: 'high' 
});
```

### Service Health Check
```javascript
import { weatherService } from '../services';

const health = await weatherService.healthCheck();
console.log('Service Status:', health.overall);
```

### Data Export
```javascript
import { weatherService } from '../services';

const data = await weatherService.getWeatherAnalysis(lat, lon, date);
const exportData = weatherService.exportData(data, 'json');
```

## Migration Guide

### From Legacy `nasaApiService`
**Old**:
```javascript
import { nasaApiService } from '../services/nasaApiService';
const data = await nasaApiService.getHistoricalWeatherData(lat, lon, date);
```

**New**:
```javascript
import { weatherService } from '../services/weatherService';
const data = await weatherService.getWeatherAnalysis(lat, lon, date);
```

### Component Updates
Components have been updated to use the new modular services:
- `Dashboard.js`: Uses `weatherService.getWeatherAnalysis()`
- `StormTracker.js`: Uses `weatherService.getDisasterEvents()`
- `ResultsDisplay.js`: Compatible with new data structure

## Benefits

### 🎯 **For Developers**
- **Easier Debugging**: Isolated service modules
- **Better Testing**: Unit test individual services
- **Clear Documentation**: Each service has specific purpose
- **Type Safety**: Better IDE support and autocomplete

### 🚀 **For Application**
- **Better Performance**: Optimized data fetching
- **Improved Reliability**: Robust error handling
- **Enhanced Features**: More comprehensive data analysis
- **Future-Proof**: Easy to add new data sources

### 🔧 **For Maintenance**
- **Modular Updates**: Update services independently
- **Clear Dependencies**: Explicit service relationships
- **Configuration Management**: Centralized service configuration
- **Health Monitoring**: Built-in service status tracking

## API Credentials

All API credentials are maintained in their respective service modules:
- **NASA DONKI**: API Key configured in `SpaceWeatherService`
- **NASA EONET**: Public API, no credentials required
- **Meteomatics**: Username/password configured in `MeteomaticsService`

## Future Enhancements

The modular architecture enables easy addition of:
- New weather data sources
- Additional disaster tracking APIs
- Enhanced data processing algorithms
- Real-time data streaming
- Caching mechanisms
- Rate limiting and quota management
