import React, { useState, useEffect } from 'react';
import { geocodeCity, fetchWeather } from './api';
import WeatherCard from './WeatherCard';

export default function App() {
  const [query, setQuery] = useState(localStorage.getItem('lastCity') || 'Paris');
  const [results, setResults] = useState([]);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    // auto load last city on first render
    if (localStorage.getItem('lastCity')) {
      searchCity(localStorage.getItem('lastCity'));
    }
    // eslint-disable-next-line
  }, []);

  async function searchCity(name) {
    if (!name) return;
    setErr('');
    setLoading(true);
    setResults([]);
    setPlace(null);
    setWeather(null);
    try {
      const res = await geocodeCity(name);
      if (res.length === 0) {
        setErr('Aucun résultat pour cette ville.');
      } else {
        setResults(res);
        // si un seul résultat, sélectionner automatiquement
        if (res.length === 1) {
          selectPlace(res[0]);
        }
      }
    } catch (e) {
      setErr('Erreur lors du géocodage.');
    } finally {
      setLoading(false);
    }
  }

  async function selectPlace(p) {
    setPlace(p);
    localStorage.setItem('lastCity', p.name);
    setLoading(true);
    setErr('');
    try {
      const data = await fetchWeather(p.latitude, p.longitude);
      setWeather(data.current_weather || null);
      setDaily(data.daily || null);
    } catch (e) {
      setErr('Erreur lors de la récupération météo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Weather Dashboard</h1>
        <p>Recherche la météo par ville (Open‑Meteo, API publique)</p>
      </header>

      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchCity(query);
          }}
          className="search-form"
          role="search"
          aria-label="Recherche ville"
        >
          <input
            aria-label="Ville"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Paris, New York, Dakar..."
          />
          <button type="submit" disabled={loading}>Chercher</button>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setPlace(null);
              setWeather(null);
              setDaily(null);
            }}
            className="clear"
          >
            Réinitialiser
          </button>
        </form>

        {loading && <p role="status">Chargement…</p>}
        {err && <p className="error" role="alert">{err}</p>}

        {results && results.length > 1 && (
          <div className="results" role="list" aria-label="Résultats de géocodage">
            <h3>Choisis une localisation</h3>
            <ul>
              {results.map((r) => (
                <li key={`${r.latitude}-${r.longitude}`} role="listitem">
                  <button onClick={() => selectPlace(r)} className="result-btn">
                    {r.name}{r.admin1 ? `, ${r.admin1}` : ''}{r.country ? ` — ${r.country}` : ''}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {place && <WeatherCard place={place} weather={weather} daily={daily} />}
      </main>

      <footer>
        <small>API: Open‑Meteo — gratuit, sans clé. Code fourni à titre éducatif.</small>
      </footer>
    </div>
  );
}
