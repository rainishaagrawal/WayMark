import React, { createContext, useContext, useState } from 'react';
import api from '../utils/axios';

export const ALL_CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',            flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',  name: 'Euro',                 flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',  name: 'British Pound',        flag: '🇬🇧' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee',         flag: '🇮🇳' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',         flag: '🇯🇵' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham',          flag: '🇦🇪' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',    flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',      flag: '🇨🇦' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc',          flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',         flag: '🇨🇳' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar',     flag: '🇸🇬' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar',   flag: '🇭🇰' },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won',     flag: '🇰🇷' },
  { code: 'THB', symbol: '฿',  name: 'Thai Baht',            flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit',    flag: '🇲🇾' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah',    flag: '🇮🇩' },
  { code: 'PHP', symbol: '₱',  name: 'Philippine Peso',      flag: '🇵🇭' },
  { code: 'BDT', symbol: '৳',  name: 'Bangladeshi Taka',     flag: '🇧🇩' },
  { code: 'PKR', symbol: '₨',  name: 'Pakistani Rupee',      flag: '🇵🇰' },
  { code: 'LKR', symbol: '₨',  name: 'Sri Lankan Rupee',     flag: '🇱🇰' },
  { code: 'NPR', symbol: '₨',  name: 'Nepalese Rupee',       flag: '🇳🇵' },
  { code: 'SAR', symbol: '﷼',  name: 'Saudi Riyal',          flag: '🇸🇦' },
  { code: 'QAR', symbol: '﷼',  name: 'Qatari Riyal',         flag: '🇶🇦' },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar',        flag: '🇰🇼' },
  { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar',       flag: '🇧🇭' },
  { code: 'OMR', symbol: '﷼',  name: 'Omani Rial',           flag: '🇴🇲' },
  { code: 'EGP', symbol: '£',  name: 'Egyptian Pound',       flag: '🇪🇬' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand',   flag: '🇿🇦' },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira',       flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling',     flag: '🇰🇪' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi',      flag: '🇬🇭' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real',       flag: '🇧🇷' },
  { code: 'MXN', symbol: '$',  name: 'Mexican Peso',         flag: '🇲🇽' },
  { code: 'ARS', symbol: '$',  name: 'Argentine Peso',       flag: '🇦🇷' },
  { code: 'COP', symbol: '$',  name: 'Colombian Peso',       flag: '🇨🇴' },
  { code: 'CLP', symbol: '$',  name: 'Chilean Peso',         flag: '🇨🇱' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol',         flag: '🇵🇪' },
  { code: 'TRY', symbol: '₺',  name: 'Turkish Lira',         flag: '🇹🇷' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty',         flag: '🇵🇱' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona',        flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone',      flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone',         flag: '🇩🇰' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna',         flag: '🇨🇿' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint',     flag: '🇭🇺' },
  { code: 'RUB', symbol: '₽',  name: 'Russian Ruble',        flag: '🇷🇺' },
  { code: 'UAH', symbol: '₴',  name: 'Ukrainian Hryvnia',    flag: '🇺🇦' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu',        flag: '🇷🇴' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar',  flag: '🇳🇿' },
  { code: 'VND', symbol: '₫',  name: 'Vietnamese Dong',      flag: '🇻🇳' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar',       flag: '🇹🇼' },
  { code: 'ILS', symbol: '₪',  name: 'Israeli Shekel',       flag: '🇮🇱' },
];

const CurrencyContext = createContext(null);

const DEFAULT_CODE = 'USD';

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(() => {
    return localStorage.getItem('WayMark_currency') || DEFAULT_CODE;
  });

  const currencyInfo = ALL_CURRENCIES.find((c) => c.code === currencyCode) ||
    ALL_CURRENCIES[0];

  const setDefaultCurrency = (code) => {
    setCurrencyCode(code);
    localStorage.setItem('WayMark_currency', code);

    // Synchronize to user profile if logged in
    api.patch('/users/profile', { preferredCurrency: code }).catch(() => {});
  };

  // Format a number using the user's default currency
  const formatAmount = (amount, opts = {}) => {
    const num = parseFloat(amount) || 0;
    const { showSymbol = true, decimals = 2 } = opts;
    const formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return showSymbol ? `${currencyInfo.symbol}${formatted}` : formatted;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currencyInfo,
        setDefaultCurrency,
        formatAmount,
        allCurrencies: ALL_CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}

