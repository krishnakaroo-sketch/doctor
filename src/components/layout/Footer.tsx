import React from 'react';
import { ShieldCheck, Phone, Mail, Stethoscope } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                Online Doctor Care
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Safe preliminary symptom guidance and certified online doctor consultations across India. Designed for patient safety and clinical transparency.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>Helpline: 1800 200 4455</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@onlinedoctorcare.in</span>
              </div>
            </div>
          </div>

          {/* Quick Health Pathways */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Patient Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('symptom-checker')}
                  className="hover:text-white transition-colors"
                >
                  AI Symptom Assessment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chat')}
                  className="hover:text-white transition-colors"
                >
                  AI Health Assistant Chat
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-white transition-colors"
                >
                  Find Verified Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('emergency')}
                  className="hover:text-white transition-colors text-rose-300 font-medium"
                >
                  Emergency Triage & 112 Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Patient Dashboard & Records
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Portals & QA */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Professional & Audits
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('doctor-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Doctor Consultation Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Administrator & NMC Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tests')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-teal-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Clinical Safety & Test Runner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('data-deletion')}
                  className="hover:text-white transition-colors"
                >
                  DPDP Data Deletion Request
                </button>
              </li>
            </ul>
          </div>

          {/* Regulatory & Disclaimers */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white">
                  Privacy Policy (DPDP Act 2023)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white">
                  Terms of Use & Telemedicine Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-white">
                  Medical Disclaimer & AI Limitations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white">
                  Grievance Officer & Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical disclaimer banner */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/60 text-slate-300">
            <strong className="text-white font-semibold">Important Medical Notice:</strong>{' '}
            {t.disclaimer.text}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-slate-500">
            <span>© 2026 Online Doctor Care. All rights reserved. India.</span>
            <div className="flex items-center gap-2">
              <span>National Emergency: 112</span>
              <span>·</span>
              <span>Ambulance: 108</span>
              <span>·</span>
              <span>Health Helpline: 1075</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
