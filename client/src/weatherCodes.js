// Cartographie minimale des weathercode Open-Meteo vers description (compléter si besoin)
export const WEATHER_CODES = {
  0: 'Ciel clair',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brume',
  48: 'Dépôts de brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine modérée',
  55: 'Bruine dense',
  56: 'Bruine verglaçante légère',
  57: 'Bruine verglaçante dense',
  61: 'Pluie faible',
  63: 'Pluie modérée',
  65: 'Pluie forte',
  66: 'Pluie verglaçante légère',
  67: 'Pluie verglaçante forte',
  71: 'Neige faible',
  73: 'Neige modérée',
  75: 'Neige forte',
  77: 'Grains de neige',
  80: 'Averses faibles',
  81: 'Averses modérées',
  82: 'Averses violentes',
  85: 'Fortes chutes de neige',
  86: 'Très fortes chutes de neige',
  95: 'Orage',
  96: 'Orage avec grêle légère',
  99: 'Orage avec grêle forte'
};

export function getWeatherDescription(code) {
  return WEATHER_CODES[code] || 'Inconnu';
}
