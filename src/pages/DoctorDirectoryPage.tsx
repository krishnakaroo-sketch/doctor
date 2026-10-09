import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  Calendar,
  Languages,
  Clock,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { DoctorProfile } from '../types';

interface DoctorDirectoryPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const DoctorDirectoryPage: React.FC<DoctorDirectoryPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { doctors } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = [
    { id: 'all', label: 'All Specialties' },
    { id: 'general', label: 'General Medicine' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'cardiology', label: 'Cardiology' },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.about.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'all' || doc.specialtySlug === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Directory Title */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
          <Stethoscope className="w-4 h-4" />
          <span>Registered Medical Practitioners · India</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.doctorDirectory.title}
        </h1>
        <p className="text-sm text-slate-600">
          {t.doctorDirectory.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.doctorDirectory.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
          />
        </div>

        {/* Specialty filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {specialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedSpecialty === spec.id
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc: DoctorProfile) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-teal-300 transition-colors flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Doctor Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-xs">
                    {doc.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                      {doc.verified && (
                        <span title="Verified by Medical Council">
                          <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-teal-700">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.qualifications}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Fee</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    ₹{doc.consultationFee}
                  </span>
                </div>
              </div>

              {/* Registration Council & Experience (DPDP & Telemedicine requirement) */}
              <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 text-slate-600 border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>
                    Council: <strong className="text-slate-800">{doc.registrationCouncil}</strong>
                  </span>
                  <span>
                    Reg No: <strong className="font-mono text-slate-800">{doc.registrationNumber}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 pt-1">
                  <span>Experience: <strong className="text-slate-700">{doc.experienceYears} Years</strong></span>
                  <span>·</span>
                  <span>Hospital: <strong className="text-slate-700">{doc.hospitalAffiliation}</strong></span>
                </div>
              </div>

              {/* Clinical summary */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {doc.about}
              </p>

              {/* Languages & Slots */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.availableDays.length} Days/wk</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-teal-800 font-medium">
                Next available: Today
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('book', doc.id)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.doctorDirectory.bookConsultation}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No doctors found matching your query.</p>
          <p className="text-xs text-slate-500">Try searching for other specialties or clear your search filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('all');
            }}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
