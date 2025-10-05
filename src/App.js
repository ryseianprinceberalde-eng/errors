import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import StormTracker from './components/StormTracker';
import Co2Monitor from './components/Co2Monitor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/storm-tracker" element={<StormTracker />} />
          <Route path="/co2-monitor" element={<Co2Monitor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
