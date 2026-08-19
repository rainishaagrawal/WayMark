import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, TrendingUp, RefreshCw, DollarSign, Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext';

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar',          flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',               flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',      flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee',       flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen',       flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar',  flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar',    flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc',        flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan',       flag: '🇨🇳' },
  { code: 'AED', name: 'UAE Dirham',         flag: '🇦🇪' },
  { code: 'SGD', name: 'Singapore Dollar',   flag: '🇸🇬' },
  { code: 'THB', name: 'Thai Baht',          flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit',  flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah',  flag: '🇮🇩' },
  { code: 'BRL', name: 'Brazilian Real',     flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso',       flag: '🇲🇽' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'TRY', name: 'Turkish Lira',       flag: '🇹🇷' },
  { code: 'KRW', name: 'South Korean Won',   flag: '🇰🇷' },
  { code: 'HKD', name: 'Hong Kong Dollar',   flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona',      flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone',    flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone',       flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty',       flag: '🇵🇱' },
  { code: 'SAR', name: 'Saudi Riyal',        flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Riyal',       flag: '🇶🇦' },
  { code: 'EGP', name: 'Egyptian Pound',     flag: '🇪🇬' },
  { code: 'PKR', name: 'Pakistani Rupee',    flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka',   flag: '🇧🇩' },
];

const getCurrencyInfo = (code) =>
  POPULAR_CURRENCIES.find((c) => c.code === code) || { code, name: code, flag: '🌐' };

function CurrencyDropdown({ value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const info = getCurrencyInfo(value);

  const filtered = POPULAR_CURRENCIES.filter(
    (c) =>
      c.code !== exclude &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-[14px] hover:border-[#437A60]/30 transition text-left shadow-sm"
      >
        <span className="text-2xl leading-none">{info.flag}</span>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-[#1A3626] text-sm">{info.code}</span>
          <span className="text-[#8B8B8B] text-xs ml-2">{info.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-[#8B8B8B] flex-shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(''); }} />
          <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-100 rounded-[16px] overflow-hidden shadow-xl">
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-[#f8faf9] rounded-xl px-3">
                <Search className="w-3.5 h-3.5 text-[#8B8B8B]" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search currency..."
                  className="bg-transparent text-[#1A3626] text-xs py-2 focus:outline-none flex-1"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { onChange(c.code); setOpen(false); setSearch(''); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8faf9] text-left transition"
                >
                  <span className="text-lg">{c.flag}</span>
                  <div>
                    <p className="text-[#1A3626] text-xs font-semibold">{c.code}</p>
                    <p className="text-[#8B8B8B] text-[10px]">{c.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CurrencyConverter() {
  const { currencyCode } = useCurrency();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState(currencyCode || 'USD');
  const [toCurrency, setToCurrency] = useState(currencyCode === 'INR' ? 'USD' : 'INR');
  const [rates, setRates] = useState({});
  const [allRates, setAllRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      let ratesData = {};
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.result === 'success') {
          const r = { ...data.rates };
          delete r[fromCurrency];
          ratesData = r;
        } else throw new Error();
      } catch (_) {
        const res = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        const inner = data[fromCurrency.toLowerCase()] || {};
        ratesData = Object.fromEntries(
          Object.entries(inner)
            .filter(([k]) => k.toUpperCase() !== fromCurrency)
            .map(([k, v]) => [k.toUpperCase(), v])
        );
      }
      setRates(ratesData);
      setLastUpdated(new Date());
    } catch {
      toast.error('Could not fetch live rates. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [fromCurrency]);

  useEffect(() => {
    const fetchAllRates = async () => {
      try {
        let ratesData = {};
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/USD');
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.result === 'success') ratesData = data.rates || {};
          else throw new Error();
        } catch (_) {
          const res = await fetch(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
          );
          const data = await res.json();
          const inner = data['usd'] || {};
          ratesData = Object.fromEntries(Object.entries(inner).map(([k, v]) => [k.toUpperCase(), v]));
        }
        setAllRates(ratesData);
      } catch (_) {}
    };
    fetchAllRates();
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const convertedAmount = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return '—';
    if (fromCurrency === toCurrency) return num.toLocaleString('en-IN', { maximumFractionDigits: 4 });
    const rate = rates[toCurrency];
    if (!rate) return '—';
    return (num * rate).toLocaleString('en-IN', { maximumFractionDigits: 3 });
  };

  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);
  const popularPairs = ['EUR', 'GBP', 'AED', 'JPY'].filter((c) => c !== fromCurrency).slice(0, 4);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header Banner ── */}
      <div className="relative bg-[#faf9f5] rounded-[24px] overflow-hidden min-h-[150px] flex items-center justify-between px-8 border border-gray-100 shadow-sm">
        {/* Dotted globe SVG — right side */}
        <svg
          className="absolute right-8 top-1/2 -translate-y-1/2 w-64 h-48 pointer-events-none opacity-[0.12]"
          viewBox="0 0 300 220"
          fill="none"
        >
          {/* Globe circles */}
          <ellipse cx="180" cy="110" rx="100" ry="100" stroke="#1A3626" strokeWidth="1.2" strokeDasharray="3 3"/>
          <ellipse cx="180" cy="110" rx="70" ry="100" stroke="#1A3626" strokeWidth="1" strokeDasharray="3 3"/>
          <ellipse cx="180" cy="110" rx="35" ry="100" stroke="#1A3626" strokeWidth="1" strokeDasharray="3 3"/>
          <line x1="80" y1="110" x2="280" y2="110" stroke="#1A3626" strokeWidth="1" strokeDasharray="3 3"/>
          <line x1="80" y1="75" x2="280" y2="75" stroke="#1A3626" strokeWidth="0.8" strokeDasharray="3 3"/>
          <line x1="80" y1="145" x2="280" y2="145" stroke="#1A3626" strokeWidth="0.8" strokeDasharray="3 3"/>
          {/* Small dots */}
          {[...Array(12)].map((_, i) => (
            <circle key={i} cx={90 + (i % 4) * 60} cy={60 + Math.floor(i / 4) * 50} r="1.5" fill="#1A3626" />
          ))}
        </svg>

        {/* Currency symbols floating */}
        <span className="absolute right-44 top-8 text-2xl text-[#1A3626]/15 font-bold select-none">$</span>
        <span className="absolute right-24 top-12 text-xl text-[#1A3626]/12 font-bold select-none">€</span>
        <span className="absolute right-56 bottom-8 text-xl text-[#1A3626]/12 font-bold select-none">₹</span>
        <span className="absolute right-16 bottom-10 text-2xl text-[#1A3626]/15 font-bold select-none">¥</span>

        {/* Left content */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] flex items-center justify-center shadow-sm flex-shrink-0">
            <DollarSign className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3626]">Currency Converter</h1>
            <p className="text-sm text-[#8B8B8B] mt-0.5">Live exchange rates powered by European Central Bank</p>
            {lastUpdated && (
              <p className="text-xs text-[#437A60] flex items-center gap-1.5 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-[#437A60] inline-block" />
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchRates}
          disabled={loading}
          className="relative z-10 flex items-center gap-2 bg-white text-[#1A3626] border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Main Converter Card ── */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_56px_1fr] gap-4 items-start">

          {/* Left — Amount + From */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#8B8B8B]">Amount</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              className="w-full text-[#1A3626] text-3xl font-bold px-4 py-4 border border-gray-100 rounded-[16px] bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#437A60]/20 transition"
              placeholder="1"
            />
            <CurrencyDropdown value={fromCurrency} onChange={setFromCurrency} exclude={toCurrency} />
          </div>

          {/* Center — Swap */}
          <div className="flex items-center justify-center pt-10">
            <button
              onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}
              className="w-12 h-12 rounded-full bg-[#f4f4f4] border border-gray-200 flex items-center justify-center hover:bg-[#EBF8F4] hover:border-[#437A60]/30 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeftRight className="w-5 h-5 text-[#1A3626]" />
            </button>
          </div>

          {/* Right — Converted + To */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#8B8B8B]">Converted Amount</p>
            <div className="w-full text-[#D4AF37] text-3xl font-bold px-4 py-4 border border-gray-100 rounded-[16px] bg-[#fafafa] min-h-[72px] flex items-center">
              {loading ? <span className="text-[#8B8B8B] text-sm animate-pulse">Loading...</span> : convertedAmount()}
            </div>
            <CurrencyDropdown value={toCurrency} onChange={setToCurrency} exclude={fromCurrency} />
          </div>
        </div>

        {/* Rate info row */}
        {rates[toCurrency] && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#8B8B8B]">
            <span>
              1 {fromInfo.flag} <b className="text-[#1A3626]">{fromCurrency}</b>
              {' = '}
              <b className="text-[#D4AF37]">{rates[toCurrency]?.toLocaleString('en-IN', { maximumFractionDigits: 6 })}</b>
              {' '}{toInfo.flag} <b className="text-[#1A3626]">{toCurrency}</b>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              1 {toInfo.flag} <b className="text-[#1A3626]">{toCurrency}</b>
              {' = '}
              <b className="text-[#D4AF37]">{(1 / rates[toCurrency])?.toLocaleString('en-IN', { maximumFractionDigits: 6 })}</b>
              {' '}{fromInfo.flag} <b className="text-[#1A3626]">{fromCurrency}</b>
            </span>
          </div>
        )}
      </div>

      {/* ── Popular Currencies ── */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-sm font-bold text-[#1A3626]">
            {amount || '1'} {fromCurrency} in Popular Currencies
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularPairs.map((code) => {
            const info = getCurrencyInfo(code);
            const rate = rates[code];
            const converted = rate ? (parseFloat(amount || 1) * rate) : null;
            return (
              <button
                key={code}
                onClick={() => setToCurrency(code)}
                className={`flex items-center gap-4 p-4 rounded-[16px] border transition-all ${
                  toCurrency === code
                    ? 'border-[#437A60]/30 bg-[#EBF8F4]'
                    : 'border-gray-100 hover:border-[#437A60]/20 hover:bg-[#f8faf9]'
                }`}
              >
                <span className="text-3xl leading-none">{info.flag}</span>
                <div className="text-left">
                  <p className="text-[#1A3626] text-xs font-bold">{code}</p>
                  <p className="text-[#D4AF37] text-base font-bold mt-0.5">
                    {loading ? '...' : converted ? converted.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}
                  </p>
                  <p className="text-[#8B8B8B] text-[11px]">{info.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Live Rates Table ── */}
      {Object.keys(allRates).length > 0 && (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-[#1A3626] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            Live Rates (Base: USD)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {POPULAR_CURRENCIES.filter((c) => c.code !== 'USD' && allRates[c.code]).map((c) => (
              <div key={c.code} className="flex items-center justify-between p-3 rounded-[12px] bg-[#f8faf9] border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <span className="text-xs text-[#8B8B8B] font-semibold">{c.code}</span>
                </div>
                <span className="text-xs text-[#1A3626] font-bold">
                  {allRates[c.code]?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer Disclaimer ── */}
      <div className="flex items-center justify-between text-[10px] text-[#8B8B8B] px-1 pb-2">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Exchange rates are indicative and for informational purposes only. Please verify with your bank or exchange provider.
        </span>
        <a href="https://www.ecb.europa.eu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#1A3626] transition-colors">
          Source: European Central Bank
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
