# Weather Probability Predictor

A React-based web application that predicts weather probabilities using NASA satellite data. Get accurate predictions for hot, cold, wet, windy, and uncomfortable weather conditions based on 30+ years of historical data.

## Features

### 🏠 Landing Page
- Modern hero section with app introduction
- Feature highlights showcasing NASA data sources
- Responsive design for mobile and desktop
- Smooth animations and professional UI

### 📊 Dashboard
- **Location Input**: Search by city name or enter coordinates manually
- **Interactive Map**: Click to select locations using Leaflet.js
- **Date Selection**: Choose specific dates for analysis
- **Weather Probabilities**: Calculate chances for:
  - Hot weather (>35°C)
  - Cold weather (<5°C) 
  - Wet conditions (>10mm rainfall)
  - Windy conditions (>10m/s)
  - Uncomfortable heat index (>32°C)

### 📈 Data Visualization
- **Probability Cards**: Clear visual display of each condition
- **Charts**: Bar charts, pie charts, and line graphs using Recharts
- **Historical Trends**: Monthly patterns and seasonal analysis
- **Export Functionality**: Download results as JSON with metadata

### 🛰️ NASA Data Integration
- **NASA POWER API**: Temperature and wind speed data
- **GPM IMERG**: Global precipitation measurements
- **MERRA-2**: Climate reanalysis data
- **30+ Years**: Historical data analysis for accurate probabilities

## Tech Stack

- **Frontend**: React 18 with React Router
- **Styling**: TailwindCSS with custom components
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet.js for interactive mapping
- **APIs**: NASA POWER, GPM IMERG, MERRA-2
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-probability-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── LandingPage.js      # Home page with hero section
│   ├── Dashboard.js        # Main dashboard interface
│   ├── ResultsDisplay.js   # Weather probability results
│   └── WeatherMap.js       # Interactive map component
├── services/
│   └── nasaApiService.js   # NASA API integration
├── utils/
│   └── weatherCalculations.js # Probability calculations
├── App.js                  # Main app component
├── index.js               # App entry point
└── index.css              # Global styles
```

## API Configuration

### NASA POWER API
The app uses NASA's POWER API for meteorological data. No API key required for basic usage.

### Geocoding (Optional)
For enhanced location search, you can add an OpenCage API key:
1. Sign up at [OpenCage Data](https://opencagedata.com/)
2. Replace `YOUR_API_KEY` in `Dashboard.js` with your actual key

### Fallback Data
The app includes intelligent fallback mechanisms that generate realistic weather data when APIs are unavailable, ensuring the app always works.

## Usage

1. **Start on Landing Page**: Learn about the app and its features
2. **Navigate to Dashboard**: Click "Get Started" or "Dashboard"
3. **Select Location**: 
   - Search by city name, or
   - Enter coordinates manually, or
   - Click on the interactive map
4. **Choose Date**: Select your target date
5. **View Results**: See probability cards, charts, and insights
6. **Export Data**: Download results as JSON for further analysis

## Weather Conditions Explained

- **Hot Weather**: Temperature exceeds 35°C (95°F)
- **Cold Weather**: Temperature below 5°C (41°F)
- **Wet Conditions**: Daily rainfall over 10mm (0.4 inches)
- **Windy Weather**: Wind speed above 10 m/s (22 mph)
- **Uncomfortable**: Heat index above 32°C (90°F)

## Data Sources

- **NASA POWER**: Meteorological data from satellite observations
- **GPM IMERG**: Global Precipitation Measurement mission data
- **MERRA-2**: Modern-Era Retrospective analysis for Research and Applications

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- NASA for providing free access to meteorological data
- OpenStreetMap for map tiles
- The React and open-source community

---

**Note**: This application uses historical data to predict probabilities. Actual weather conditions may vary due to climate change and local factors. Always check current weather forecasts for immediate planning.
