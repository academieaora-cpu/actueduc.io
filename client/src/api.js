// Appelle l'API de géocodage Open-Meteo et l'API météo Open-Meteo
export async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=fr`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur géocodage');
  const data = await res.json();
  return data.results || [];
}

export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur météo');
  const data = await res.json();
  return data;
}
