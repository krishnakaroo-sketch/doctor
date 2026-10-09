import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language, Role } from '../types';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onNavigate: (view: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, onNavigate }) => {
  const { loginWithCredentials, registerPatient, loginAs } = useAuth();
  const { t } = useLanguage();

  const [isRegister, setIsRegister] = useState(mode === 'register');
  const [selectedRole, setSelectedRole] = useState<Role>('patient');

  // Registration form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [languagePref, setLanguagePref] = useState<Language>('en');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('Mumbai');
  const [consent, setConsent] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    loginWithCredentials(loginEmail, selectedRole);
    if (selectedRole === 'doctor') {
      onNavigate('doctor-dashboard');
    } else if (selectedRole === 'admin') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('patient-dashboard');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !consent) return;

    registerPatient({
      name,
      email,
      phone,
      preferredLanguage: languagePref,
      isMinor,
      guardianName: isMinor ? guardianName : undefined,
      state,
      city,
    });

    onNavigate('patient-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {isRegister ? t.auth.patientRegisterTitle : t.auth.patientLoginTitle}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Join Online Doctor Care for secure patient consultations.'
              : 'Sign in to access your consultations and medical records.'}
          </p>
        </div>

        {/* Role Segmented Selector */}
        {!isRegister && (
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`flex-1 py-1.5 rounded capitalize transition-colors ${
                  selectedRole === r ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Quick Demo Accounts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                loginAs('patient');
                onNavigate('patient-dashboard');
              }}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
            >
              Patient (Aarav)
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('doctor');
                onNavigate('doctor-dashboard');
              }}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
            >
              Doctor (Dr. Priya)
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                onNavigate('admin-dashboard');
              }}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-medium"
            >
              Admin (Compliance)
            </button>
          </div>
        </div>

        {/* Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t.auth.emailLabel}</label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="aarav.sharma@example.in or mobile number"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t.auth.passwordLabel}</label>
              <input
                type="password"
                required
                defaultValue="password123"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              {t.auth.submitLogin}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">{t.auth.nameLabel} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Mobile Number (India)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Language</label>
                <select
                  value={languagePref}
                  onChange={(e) => setLanguagePref(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Minor Guardian Consent */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Patient is a minor (under 18 years old)</span>
              </label>

              {isMinor && (
                <div className="space-y-1 pt-1">
                  <label className="font-semibold text-slate-700 block text-[11px]">
                    Parent or Guardian Name (Required for minors)
                  </label>
                  <input
                    type="text"
                    required={isMinor}
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Parent / Legal Guardian Name"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
                  />
                </div>
              )}
            </div>

            {/* DPDP Consent */}
            <label className="flex items-start gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded text-teal-600"
              />
              <span className="leading-relaxed">
                {t.auth.privacyConsent}
              </span>
            </label>

            <button
              type="submit"
              disabled={!consent}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              {t.auth.submitRegister}
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-teal-700 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New patient?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-teal-700 font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
