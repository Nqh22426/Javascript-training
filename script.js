// API: Open-Meteo

const btnGet = document.getElementById('btnGet');
const btnNotify = document.getElementById('btnNotify');
const resultEl = document.getElementById('result');
const locEl = document.getElementById('location');
const timeEl = document.getElementById('time');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const weatherCodeEl = document.getElementById('weathercode');
const btnRefresh = document.getElementById('btnRefresh');
const citySelect = document.getElementById('citySelect');

// Auto refresh (Timer)
const AUTO_REFRESH_MIN = 5;

// Danh sách các thành phố
const CITIES = {
  'hanoi': { name: 'Hà Nội, Việt Nam', lat: 21.0285, lon: 105.8542, timezone: 'Asia/Ho_Chi_Minh' },
  'hcm': { name: 'Hồ Chí Minh, Việt Nam', lat: 10.7769, lon: 106.7009, timezone: 'Asia/Ho_Chi_Minh' },
  'danang': { name: 'Đà Nẵng, Việt Nam', lat: 16.0471, lon: 108.2068, timezone: 'Asia/Ho_Chi_Minh' },
  'london': { name: 'London, UK', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  'paris': { name: 'Paris, France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  'tokyo': { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  'seoul': { name: 'Seoul, South Korea', lat: 37.5665, lon: 126.9780, timezone: 'Asia/Seoul' },
  'singapore': { name: 'Singapore', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  'bangkok': { name: 'Bangkok, Thailand', lat: 13.7563, lon: 100.5018, timezone: 'Asia/Bangkok' },
  'sydney': { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  'newyork': { name: 'New York, USA', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York' }
};

// Biến
let currentCoords = null;      // latitude, longitude
let autoRefreshTimer = null;   // timer id
let currentCityKey = null;     // key của thành phố hiện tại

function initCitySelect() {
  while (citySelect.children.length > 1) {
    citySelect.removeChild(citySelect.lastChild);
  }
  Object.entries(CITIES).forEach(([key, city]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = city.name;
    citySelect.appendChild(option);
  });
}


// Fetch API (API: Open-Meteo)
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto&_t=${Date.now()}`;
  return fetch(url)
    .then(resp => resp.ok ? resp.json() : Promise.reject(new Error('Network error')))
    .then(data => {
      if (!data.current_weather) throw new Error('No weather data');
      return {
        coords: { latitude: lat, longitude: lon },
        fetchedAt: new Date().toISOString(),
        weather: data.current_weather
      };
    });
}

function addCityInfo(payload, cityKey) {
  if (cityKey && CITIES[cityKey]) {
    payload.cityName = CITIES[cityKey].name;
    payload.cityKey = cityKey;
    payload.timezone = CITIES[cityKey].timezone;
  }
  return payload;
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear',
    1: 'Clear',
    2: 'Partly cloudy', 
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Drizzle',
    53: 'Drizzle',
    55: 'Drizzle',
    56: 'Drizzle',
    57: 'Drizzle',
    61: 'Rain',
    63: 'Rain',
    65: 'Rain',
    66: 'Rain',
    67: 'Rain',
    71: 'Snow',
    73: 'Snow',
    75: 'Snow',
    77: 'Snow',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm'
  };
  return descriptions[code] || `Unknown (${code})`;
}

// Hiển thị dữ liệu
function showWeather(payload) {
  const w = payload.weather;
  locEl.textContent = payload.cityName || 'Your Location Now';
  
  const timeOptions = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
  if (payload.timezone) timeOptions.timeZone = payload.timezone;
  timeEl.textContent = new Date(payload.fetchedAt).toLocaleString('vi-VN', timeOptions);
  
  tempEl.textContent = w.temperature;
  windEl.textContent = w.windspeed;
  weatherCodeEl.textContent = getWeatherDescription(w.weathercode);
  resultEl.classList.remove('hidden');
}

// Lưu vào localStorage
function saveToLocal(payload) {
  try { localStorage.setItem('lastWeather', JSON.stringify(payload)); } catch {}
}

// Lấy từ localStorage
function loadFromLocal() {
  try { return JSON.parse(localStorage.getItem('lastWeather')); } catch { return null; }
}


// Geolocation success callback
function geoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  currentCoords = { latitude: lat, longitude: lon };
  currentCityKey = null;
  citySelect.value = '';
  
  fetchWeatherByCoords(lat, lon)
    .then(payload => {
      showWeather(payload);
      saveToLocal(payload);
      showNotificationIfAllowed(payload);
      startAutoRefresh();
    })
    .catch(err => console.warn('Fetch error:', err.message || err));
}

// Geolocation error callback
function geoError(err) {
  console.warn('Geolocation error:', err.message || err.code);
  const stored = loadFromLocal();
  if (stored) showWeather(stored);
}

function getLocationAndWeather() {
  if (!navigator.geolocation) return console.warn('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { enableHighAccuracy: true, maximumAge: 60000 });
}

function getWeatherForSelectedCity() {
  const cityKey = citySelect.value;
  const city = CITIES[cityKey];
  if (!cityKey || !city) return;
  
  currentCityKey = cityKey;
  currentCoords = { latitude: city.lat, longitude: city.lon };
  
  fetchWeatherByCoords(city.lat, city.lon)
    .then(payload => {
      addCityInfo(payload, cityKey);
      showWeather(payload);
      saveToLocal(payload);
      showNotificationIfAllowed(payload);
      startAutoRefresh();
    })
    .catch(err => console.warn('Fetch error:', err.message || err));
}

function showNotificationIfAllowed(payload) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Weather: ${payload.weather.temperature}°C`, {
      body: `${getWeatherDescription(payload.weather.weathercode)} — Wind: ${payload.weather.windspeed} m/s`
    });
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) return console.warn('Notifications not supported');
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      const stored = loadFromLocal();
      if (stored) showNotificationIfAllowed(stored);
    }
  });
}

// Auto refresh
function startAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  if (!currentCoords) return;
  autoRefreshTimer = setInterval(() => {
    fetchWeatherByCoords(currentCoords.latitude, currentCoords.longitude)
      .then(payload => {
        addCityInfo(payload, currentCityKey);
        showWeather(payload);
        saveToLocal(payload);
        showNotificationIfAllowed(payload);
      })
      .catch(err => console.warn('Auto-refresh failed:', err.message || err));
  }, AUTO_REFRESH_MIN * 60 * 1000);
}

// Event handlers
btnGet.addEventListener('click', getLocationAndWeather);
btnNotify.addEventListener('click', requestNotificationPermission);
citySelect.addEventListener('change', getWeatherForSelectedCity);

btnRefresh.addEventListener('click', () => {
  if (!currentCoords) return;
  
  const originalText = btnRefresh.textContent;
  btnRefresh.textContent = 'Fetching weather...';
  btnRefresh.disabled = true;
  
  fetchWeatherByCoords(currentCoords.latitude, currentCoords.longitude)
    .then(payload => {
      addCityInfo(payload, currentCityKey);
      showWeather(payload);
      saveToLocal(payload);
    })
    .catch(err => console.warn('Refresh failed:', err.message || err))
    .finally(() => {
      btnRefresh.textContent = originalText;
      btnRefresh.disabled = false;
    });
});


// Initialization
(function init() {
  initCitySelect();
  
  const stored = loadFromLocal();
  if (stored) {
    // Lấy dữ liệu từ localStorage
    showWeather(stored);
    currentCoords = stored.coords;
    
    if (stored.cityKey && CITIES[stored.cityKey]) {
      citySelect.value = stored.cityKey;
      currentCityKey = stored.cityKey;
    }
    
    if (currentCoords) {
      startAutoRefresh();
    }
  }
})();