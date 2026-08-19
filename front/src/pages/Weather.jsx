import React, { useState, useEffect } from 'react';
import { CloudSun, Sun, CloudRain, Cloud, CloudSnow, Zap, MapPin, Search, Loader2, Wind, Droplets, Thermometer, RefreshCw, Umbrella, Shirt, Glasses, Footprints } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const codeToIcon = (code) => {
  if (code === 0 || code === 1) return Sun;
  if ([2, 3, 45, 48].includes(code)) return Cloud;
  if (code >= 51 && code <= 82) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 95) return Zap;
  return CloudSun;
};

const codeToLabel = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mostly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Pleasant';
};

const codeToTip = (code) => {
  if (code === 0 || code === 1) return { text: 'Perfect weather for sightseeing!', Icon: Glasses };
  if (code === 2 || code === 3) return { text: 'Cloudy but pleasant', Icon: Glasses };
  if ([45, 48].includes(code)) return { text: 'Foggy — drive carefully', Icon: Footprints };
  if (code >= 51 && code <= 82) {
    const tips = [
      { text: "Don't forget your umbrella!", Icon: Umbrella },
      { text: 'Wear a raincoat', Icon: Shirt },
      { text: 'Good day for walks', Icon: Footprints },
      { text: 'Bring an umbrella', Icon: Umbrella },
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
  if (code >= 71 && code <= 77) return { text: 'Layer up — it\'s snowy!', Icon: Shirt };
  return { text: 'Stay updated for changes!', Icon: Glasses };
};

const codeToIconColor = (code) => {
  if (code === 0 || code === 1) return 'text-[#F59E0B]';
  if ([2, 3].includes(code)) return 'text-[#6B7280]';
  if (code >= 51 && code <= 82) return 'text-[#3B82F6]';
  if (code >= 71 && code <= 77) return 'text-[#93C5FD]';
  return 'text-[#D4AF37]';
};

const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Weather() {
  const [city, setCity] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeatherForCity = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    try {
      const geoRes = await api.get(`/maps/coordinates?q=${encodeURIComponent(cityName)}`);
      const place = geoRes.data?.[0];
      if (!place) {
        toast.error('Could not find that location');
        setLoading(false);
        return;
      }
      setPlaceName(place.displayName.split(',').slice(0, 2).join(', '));
      const forecastRes = await api.get(`/weather/forecast?lat=${place.lat}&lon=${place.lon}&days=5`);
      setForecast(forecastRes.data?.forecast || []);
      setLastUpdated(new Date());
    } catch (e) {
      toast.error(e.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherForCity('Kyoto, Japan');
    setCity('Kyoto, Japan');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherForCity(city);
  };

  const today = forecast[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="relative bg-[#F9FBF8] rounded-[28px] border border-[#E5E5E7]/50 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7 min-h-[130px]">
        {/* Decorative background - subtle sky scene */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20"
            style={{ background: 'linear-gradient(135deg, #EBF8F4 0%, #C9D4C5 50%, #8B9E82 100%)' }}
          />
          {/* Mountain silhouette */}
          <svg className="absolute right-0 bottom-0 h-full" viewBox="0 0 500 130" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMax meet">
            <path d="M0 130L80 60L160 90L250 20L350 80L450 40L500 55V130H0Z" fill="#A7BCA1" opacity="0.25"/>
            <path d="M100 130L180 80L260 105L350 45L440 90L500 70V130H100Z" fill="#355E4B" opacity="0.15"/>
          </svg>
        </div>

        {/* Left side */}
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-md border border-[#E5E5E7]">
            <CloudSun className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#8B8B8B] uppercase tracking-wider mb-1">Intelligent Travel</p>
            <h1 className="text-2xl font-bold text-[#1A3626]">Weather Intelligence</h1>
            <p className="text-[13px] text-[#8B8B8B] mt-1">Real-time forecast for better journeys</p>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="relative z-10 flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative flex-1 md:flex-none">
            <MapPin className="w-4 h-4 text-[#8B8B8B] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              className="w-full md:w-64 bg-white border border-[#E5E5E7] text-sm text-[#1A1A1A] placeholder-[#C4C4C4] pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-[#355E4B] transition-colors shadow-sm"
            />
            {city && (
              <button type="button" onClick={() => setCity('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#D4AF37] to-[#F0C96B] hover:brightness-110 text-black rounded-full shadow-md transition-all shrink-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : forecast.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm p-12 text-center">
          <CloudSun className="w-10 h-10 text-[#8B8B8B] mx-auto mb-3" />
          <p className="text-sm text-[#8B8B8B]">Search a city above to see its weather forecast.</p>
        </div>
      ) : (
        <>
          {/* 5-Day Overview Summary Bar */}
          {today && (
            <div className="bg-white rounded-[24px] border border-[#E5E5E7]/60 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">5-Day Forecast Overview</h2>
                <p className="text-xs text-[#8B8B8B] mt-1">Stay ahead with accurate, AI-powered weather insights.</p>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                  <Thermometer className="w-4 h-4 text-[#E02424]" />
                  <div>
                    <p className="font-bold">{Math.round(today.tempMax)}°C</p>
                    <p className="text-[10px] text-[#8B8B8B]">Feels like</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                  <Droplets className="w-4 h-4 text-[#3B82F6]" />
                  <div>
                    <p className="font-bold">{today.humidity || 72}%</p>
                    <p className="text-[10px] text-[#8B8B8B]">Humidity</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                  <Wind className="w-4 h-4 text-[#6B7280]" />
                  <div>
                    <p className="font-bold">{Math.round(today.windSpeedMax)} km/h</p>
                    <p className="text-[10px] text-[#8B8B8B]">Wind Speed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                  <div>
                    <p className="font-bold">UV {today.uvIndex || 6}</p>
                    <p className="text-[10px] text-[#8B8B8B]">Moderate</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {forecast.map((f, i) => {
              const Icon = codeToIcon(f.weatherCode);
              const iconColor = codeToIconColor(f.weatherCode);
              const dayDate = new Date(f.date);
              const dayLabel = i === 0 ? 'TODAY' : DAY_SHORT[dayDate.getDay()].toUpperCase();
              const dateStr = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const tip = codeToTip(f.weatherCode);
              const TipIcon = tip.Icon;
              return (
                <div key={i} className={`bg-white rounded-[20px] border shadow-sm p-5 text-center flex flex-col items-center gap-3 transition-all ${i === 0 ? 'border-[#355E4B]/30 ring-2 ring-[#355E4B]/10' : 'border-[#E5E5E7]/60 hover:border-[#D4AF37]/30'}`}>
                  {/* Day label */}
                  <div className="text-center">
                    <p className={`text-xs font-bold uppercase tracking-widest ${i === 0 ? 'text-[#355E4B]' : 'text-[#1A1A1A]'}`}>{dayLabel}</p>
                    <p className="text-[10px] text-[#D4AF37] font-semibold mt-0.5">{dateStr}</p>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-[#F5F7F2] border border-[#E5E5E7]/60 flex items-center justify-center">
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>

                  {/* Temp */}
                  <div>
                    <p className="text-3xl font-extrabold text-[#1A1A1A] leading-none">{Math.round(f.tempMax)}°C</p>
                    <p className="text-xs text-[#8B8B8B] mt-1">Low {Math.round(f.tempMin)}°C</p>
                  </div>

                  {/* Label */}
                  <p className="text-sm font-bold text-[#1A1A1A]">{codeToLabel(f.weatherCode)}</p>

                  {/* Wind */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8B8B8B] bg-[#F9FBF8] rounded-lg px-3 py-1.5 w-full justify-center">
                    <Wind className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Wind: {Math.round(f.windSpeedMax)} km/h</span>
                  </div>

                  {/* Tip */}
                  <div className="flex items-center gap-1.5 text-xs text-[#355E4B] font-semibold w-full justify-center">
                    <TipIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="text-center leading-tight">{tip.text}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weather Insight Bar */}
          {today && (
            <div className="bg-white rounded-[20px] border border-[#E5E5E7]/60 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EAF5EA] border border-[#355E4B]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm">ℹ️</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A]">Weather Insight</p>
                  <p className="text-xs text-[#8B8B8B] mt-0.5">
                    {codeToLabel(today.weatherCode) === 'Rainy' || codeToLabel(today.weatherCode) === 'Showers'
                      ? `Expect rainy weather in ${placeName}. Carry an umbrella and stay updated for any changes!`
                      : `${codeToLabel(today.weatherCode)} conditions in ${placeName}. Great time to explore!`}
                  </p>
                </div>
              </div>
              {lastUpdated && (
                <div className="flex items-center gap-2 text-[11px] text-[#8B8B8B] shrink-0">
                  <span>Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button onClick={() => fetchWeatherForCity(city)} className="text-[#8B8B8B] hover:text-[#355E4B] transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
