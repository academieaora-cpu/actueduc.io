import React from 'react';
import { getWeatherDescription } from './weatherCodes';

export default function WeatherCard({ place, weather, daily }) {
  if (!weather) return null;

  const date = new Date(weather.time);
  return (
    <section className="weather-card" aria-labelledby="weather-title">
      <h2 id="weather-title">Météo — {place.name}{place.country ? `, ${place.country}` : ''}</h2>
      <div className="current">
        <div className="temp">
          <span className="deg">{Math.round(weather.temperature)}°C</span>
          <span className="desc">{getWeatherDescription(weather.weathercode)}</span>
        </div>
        <div className="meta">
          <div>Vent: {weather.windspeed} km/h</div>
          <div>Direction: {weather.winddirection}°</div>
          <div>Mis à jour: {date.toLocaleString()}</div>
        </div>
      </div>

      {daily && daily.time && (
        <div className="forecast" aria-label="Prévision quotidienne">
          <h3>Prévisions</h3>
          <div className="forecast-grid">
            {daily.time.map((t, i) => (
              <div key={t} className="day">
                <div className="day-date">{new Date(t).toLocaleDateString()}</div>
                <div className="day-max">{Math.round(daily.temperature_2m_max[i])}°</div>
                <div className="day-min">{Math.round(daily.temperature_2m_min[i])}°</div>
                <div className="day-code">{getWeatherDescription(daily.weathercode ? daily.weathercode[i] : 0)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
