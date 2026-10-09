import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EmergencyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-rose-900 text-white px-4 py-2 text-xs md:text-sm font-medium border-b border-rose-950">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-rose-100">{t.safetyBanner.alert}:</strong>{' '}
            {t.safetyBanner.message}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 bg-white text-rose-950 hover:bg-rose-50 px-2.5 py-1 rounded text-xs font-bold transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-700" />
            <span>Call 112 (National Emergency)</span>
          </a>
          <span className="hidden sm:inline text-rose-300 text-xs">Ambulance: 108</span>
        </div>
      </div>
    </div>
  );
};
