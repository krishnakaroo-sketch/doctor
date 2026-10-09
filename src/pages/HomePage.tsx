import React, { useState } from 'react';
import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Lock,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onStartSymptomCheckWithText?: (text: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onStartSymptomCheckWithText }) => {
  const { t } = useLanguage();
  const { doctors } = useClinic();
  const [symptomInput, setSymptomInput] = useState('');

  const handleQuickSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) {
      onNavigate('symptom-checker');
      return;
    }
    if (onStartSymptomCheckWithText) {
      onStartSymptomCheckWithText(symptomInput.trim());
    }
    onNavigate('symptom-checker');
  };

  const steps = [
    {
      num: '01',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
    },
    {
      num: '02',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
    },
    {
      num: '03',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
    },
    {
      num: '04',
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
    },
    {
      num: '05',
      title: t.howItWorks.step5Title,
      desc: t.howItWorks.step5Desc,
    },
    {
      num: '06',
      title: t.howItWorks.step6Title,
      desc: t.howItWorks.step6Desc,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headlines & Quick Symptom Box */}
            <div className="lg:col-span-7 space-y-6">
              {/* Clean text kicker without pill encapsulation */}
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {t.hero.supporting}
              </p>

              {/* Symptom Entry Box */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <label htmlFor="symptom-input" className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.mainSymptomLabel}
                </label>
                <form onSubmit={handleQuickSymptomSubmit} className="space-y-3">
                  <div className="relative">
                    <textarea
                      id="symptom-input"
                      rows={2}
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      placeholder={t.hero.quickInputPlaceholder}
                      className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Private & Confidential · Not a Prescription</span>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>{t.hero.startTriage}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <p className="text-lg font-bold text-slate-900 tabular-nums">100%</p>
                  <p className="text-slate-500">State Council Verified</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 tabular-nums">24/7</p>
                  <p className="text-slate-500">Safety Triage Layer</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 tabular-nums">3</p>
                  <p className="text-slate-500">Languages (EN/HI/MR)</p>
                </div>
              </div>
            </div>

            {/* Right Column: Clinical Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                      Immediate Clinical Care
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Consult an On-Duty Doctor
                    </h3>
                    <p className="text-xs text-slate-500">
                      Connect via secure messaging or scheduled consultation.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>

                {/* Featured Doctor mini card */}
                {doctors.slice(0, 1).map((doc) => (
                  <div key={doc.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {doc.name.split(' ')[1]?.[0] || 'D'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                          <span title="Verified NMC Clinician">
                            <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate">{doc.qualifications}</p>
                        <p className="text-[11px] text-slate-500">{doc.registrationCouncil}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 text-slate-600">
                      <span>Fee: <strong className="text-slate-900 font-semibold">₹{doc.consultationFee}</strong></span>
                      <span className="text-teal-700 font-medium">Slots Available Today</span>
                    </div>

                    <button
                      onClick={() => onNavigate('book', doc.id)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Book Consultation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Emergency direct callout */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs space-y-1.5 text-rose-950">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Have Red Flag Symptoms?</span>
                  </div>
                  <p className="text-rose-800 leading-relaxed text-[11px]">
                    Chest tightness, sudden facial drooping, severe breathlessness, or heavy bleeding require immediate ambulance response.
                  </p>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1 text-rose-900 font-bold hover:underline pt-0.5 text-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call National Emergency 112 Directly</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Clinical Care Pathway
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm text-slate-600">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-teal-300 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 tracking-wider">
                  STEP {step.num}
                </span>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {step.num}
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-slate-100/70 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Healthcare Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Comprehensive Virtual Care Services
            </h2>
            <p className="text-sm text-slate-600">
              Designed according to the Telemedicine Practice Guidelines of India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Symptom Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe symptoms in your own natural language (English, Hindi, or Marathi). Receive structured preliminary possibilities and triage urgency levels.
              </p>
              <button
                onClick={() => onNavigate('symptom-checker')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                <span>Launch Assessment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Online Doctor Consultation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with NMC registered physicians. Receive clinician-authored notes, safe home-care instructions, or referrals for formal laboratory tests.
              </p>
              <button
                onClick={() => onNavigate('doctors')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                <span>View Doctors</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Secure Consultation Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review your consultation history, symptom records, and doctor care advice securely anytime under the Digital Personal Data Protection Act, 2023.
              </p>
              <button
                onClick={() => onNavigate('patient-dashboard')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                <span>Open Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Medical Safety Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Safety & Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Built on Clinical Safety & Indian Healthcare Laws
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We never fabricate doctor credentials, never sell patient data, and never allow automated systems to write unverified medical prescriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h4 className="text-sm font-bold text-white">Verified State Registrations</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every doctor is verified against state registers (Maharashtra Medical Council, Delhi Medical Council, Karnataka Medical Council).
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h4 className="text-sm font-bold text-white">Deterministic Red-Flag Triage</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Potentially life-threatening symptoms trigger an immediate emergency alert routing to National Emergency 112 without AI delay.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h4 className="text-sm font-bold text-white">DPDP Act 2023 Consent</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full patient control: review stored records, withdraw consent, or request complete account deletion at any time.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span>Reference: Telemedicine Practice Guidelines, Board of Governors in Supersession of MCI, 2020</span>
            <button
              onClick={() => onNavigate('emergency')}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>Review Emergency Warning Signs Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Verified Doctors Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Qualified Clinicians
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Meet Our Registered Doctors
            </h2>
            <p className="text-xs text-slate-500">
              Direct access to authenticated MBBS, MD, and DNB specialists.
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            <span>View All Doctors ({doctors.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-base shrink-0">
                    {doc.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.name}</h3>
                    <p className="text-[11px] text-teal-700 font-medium">{doc.specialty}</p>
                    <p className="text-[10px] text-slate-500">{doc.qualifications}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <p>Reg: <span className="font-mono text-slate-700">{doc.registrationNumber}</span></p>
                  <p className="text-slate-500 truncate">{doc.registrationCouncil}</p>
                  <p>Exp: <strong className="text-slate-800 font-semibold">{doc.experienceYears} Years</strong></p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold text-slate-900">₹{doc.consultationFee}</span>
                </div>
                <button
                  onClick={() => onNavigate('book', doc.id)}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
