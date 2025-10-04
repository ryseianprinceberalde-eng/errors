class WeatherCalculations {
  calculateProbabilities(historicalData, targetDate) {
    const { daily } = historicalData;
    
    if (!daily || daily.length === 0) {
      return this.getDefaultProbabilities();
    }

    const totalDays = daily.length;
    let hotDays = 0;
    let coldDays = 0;
    let wetDays = 0;
    let windyDays = 0;
    let uncomfortableDays = 0;

    daily.forEach(dayData => {
      const { temperature, precipitation, windSpeed, humidity } = dayData;
      
      // Hot weather: temperature > 35°C
      if (temperature > 35) {
        hotDays++;
      }
      
      // Cold weather: temperature < 5°C
      if (temperature < 5) {
        coldDays++;
      }
      
      // Wet weather: precipitation > 10mm/day
      if (precipitation > 10) {
        wetDays++;
      }
      
      // Windy weather: wind speed > 10m/s
      if (windSpeed > 10) {
        windyDays++;
      }
      
      // Uncomfortable conditions: heat index > 32°C
      const heatIndex = this.calculateHeatIndex(temperature, humidity);
      if (heatIndex > 32) {
        uncomfortableDays++;
      }
    });

    return {
      hot: Math.round((hotDays / totalDays) * 100),
      cold: Math.round((coldDays / totalDays) * 100),
      wet: Math.round((wetDays / totalDays) * 100),
      windy: Math.round((windyDays / totalDays) * 100),
      uncomfortable: Math.round((uncomfortableDays / totalDays) * 100)
    };
  }

  calculateHeatIndex(temperature, humidity) {
    // Heat index calculation (simplified version)
    // Based on the formula used by the US National Weather Service
    
    if (temperature < 27) {
      return temperature; // Heat index not applicable for cool temperatures
    }

    const T = temperature;
    const RH = humidity;

    // Simplified heat index formula
    const HI = -8.78469475556 +
               1.61139411 * T +
               2.33854883889 * RH +
               -0.14611605 * T * RH +
               -0.012308094 * T * T +
               -0.0164248277778 * RH * RH +
               0.002211732 * T * T * RH +
               0.00072546 * T * RH * RH +
               -0.000003582 * T * T * RH * RH;

    return Math.round(HI * 10) / 10;
  }

  getDefaultProbabilities() {
    // Default probabilities when no data is available
    return {
      hot: 15,
      cold: 10,
      wet: 25,
      windy: 20,
      uncomfortable: 18
    };
  }

  analyzeSeasonalPatterns(historicalData) {
    const { monthly } = historicalData;
    
    if (!monthly || monthly.length === 0) {
      return null;
    }

    const patterns = {
      hottestMonth: null,
      coldestMonth: null,
      wettestMonth: null,
      driestMonth: null,
      windiestMonth: null,
      calmestMonth: null
    };

    let maxTemp = -Infinity, minTemp = Infinity;
    let maxRain = -Infinity, minRain = Infinity;
    let maxWind = -Infinity, minWind = Infinity;

    monthly.forEach(monthData => {
      const { month, temperature, rainfall, windSpeed } = monthData;
      
      if (temperature > maxTemp) {
        maxTemp = temperature;
        patterns.hottestMonth = month;
      }
      
      if (temperature < minTemp) {
        minTemp = temperature;
        patterns.coldestMonth = month;
      }
      
      if (rainfall > maxRain) {
        maxRain = rainfall;
        patterns.wettestMonth = month;
      }
      
      if (rainfall < minRain) {
        minRain = rainfall;
        patterns.driestMonth = month;
      }
      
      if (windSpeed > maxWind) {
        maxWind = windSpeed;
        patterns.windiestMonth = month;
      }
      
      if (windSpeed < minWind) {
        minWind = windSpeed;
        patterns.calmestMonth = month;
      }
    });

    return patterns;
  }

  calculateExtremeEvents(historicalData) {
    const { daily } = historicalData;
    
    if (!daily || daily.length === 0) {
      return null;
    }

    const extremes = {
      recordHigh: -Infinity,
      recordLow: Infinity,
      maxRainfall: -Infinity,
      maxWindSpeed: -Infinity,
      heatWaves: 0,
      coldSnaps: 0,
      droughts: 0,
      wetSpells: 0
    };

    let consecutiveHotDays = 0;
    let consecutiveColdDays = 0;
    let consecutiveDryDays = 0;
    let consecutiveWetDays = 0;

    daily.forEach((dayData, index) => {
      const { temperature, precipitation, windSpeed } = dayData;
      
      // Record extremes
      if (temperature > extremes.recordHigh) {
        extremes.recordHigh = temperature;
      }
      
      if (temperature < extremes.recordLow) {
        extremes.recordLow = temperature;
      }
      
      if (precipitation > extremes.maxRainfall) {
        extremes.maxRainfall = precipitation;
      }
      
      if (windSpeed > extremes.maxWindSpeed) {
        extremes.maxWindSpeed = windSpeed;
      }

      // Count consecutive events
      if (temperature > 30) {
        consecutiveHotDays++;
        consecutiveColdDays = 0;
      } else if (temperature < 10) {
        consecutiveColdDays++;
        consecutiveHotDays = 0;
      } else {
        if (consecutiveHotDays >= 3) extremes.heatWaves++;
        if (consecutiveColdDays >= 3) extremes.coldSnaps++;
        consecutiveHotDays = 0;
        consecutiveColdDays = 0;
      }

      if (precipitation < 1) {
        consecutiveDryDays++;
        consecutiveWetDays = 0;
      } else if (precipitation > 5) {
        consecutiveWetDays++;
        consecutiveDryDays = 0;
      } else {
        if (consecutiveDryDays >= 7) extremes.droughts++;
        if (consecutiveWetDays >= 3) extremes.wetSpells++;
        consecutiveDryDays = 0;
        consecutiveWetDays = 0;
      }
    });

    // Handle end of data
    if (consecutiveHotDays >= 3) extremes.heatWaves++;
    if (consecutiveColdDays >= 3) extremes.coldSnaps++;
    if (consecutiveDryDays >= 7) extremes.droughts++;
    if (consecutiveWetDays >= 3) extremes.wetSpells++;

    return extremes;
  }

  generateWeatherInsights(probabilities, historicalData) {
    const insights = [];
    
    // Temperature insights
    if (probabilities.hot > 60) {
      insights.push({
        type: 'warning',
        title: 'High Heat Probability',
        message: `There's a ${probabilities.hot}% chance of hot weather (>35°C). Consider heat protection measures.`
      });
    } else if (probabilities.cold > 60) {
      insights.push({
        type: 'info',
        title: 'Cold Weather Expected',
        message: `There's a ${probabilities.cold}% chance of cold weather (<5°C). Dress warmly.`
      });
    }

    // Precipitation insights
    if (probabilities.wet > 70) {
      insights.push({
        type: 'info',
        title: 'High Rain Probability',
        message: `There's a ${probabilities.wet}% chance of significant rainfall (>10mm). Bring an umbrella.`
      });
    } else if (probabilities.wet < 20) {
      insights.push({
        type: 'success',
        title: 'Dry Conditions Expected',
        message: `Only a ${probabilities.wet}% chance of rain. Great weather for outdoor activities.`
      });
    }

    // Wind insights
    if (probabilities.windy > 50) {
      insights.push({
        type: 'warning',
        title: 'Windy Conditions',
        message: `${probabilities.windy}% chance of strong winds (>10m/s). Secure loose objects.`
      });
    }

    // Comfort insights
    if (probabilities.uncomfortable > 60) {
      insights.push({
        type: 'warning',
        title: 'Uncomfortable Heat Index',
        message: `${probabilities.uncomfortable}% chance of uncomfortable conditions. Stay hydrated and seek shade.`
      });
    }

    // General insights
    const totalHighProbabilities = [probabilities.hot, probabilities.cold, probabilities.wet, probabilities.windy]
      .filter(prob => prob > 50).length;

    if (totalHighProbabilities === 0) {
      insights.push({
        type: 'success',
        title: 'Moderate Weather Expected',
        message: 'Weather conditions are expected to be generally moderate with no extreme conditions likely.'
      });
    } else if (totalHighProbabilities >= 3) {
      insights.push({
        type: 'warning',
        title: 'Variable Conditions',
        message: 'Multiple weather conditions are possible. Check forecasts closer to your date.'
      });
    }

    return insights;
  }
}

export const weatherCalculations = new WeatherCalculations();
