import React, { useState } from 'react';
import { Menu, X, Globe, User, LogOut, ShieldCheck, Stethoscope } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Language, Role } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout, loginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { id: 'symptom-checker', label: t.nav.symptomChecker },
    { id: 'chat', label: 'AI Health Chat' },
    { id: 'doctors', label: t.nav.directory },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'emergency', label: t.nav.emergency },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Strict Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                Online Doctor Care
              </span>
              <span className="text-[10px] text-teal-700 font-medium tracking-wide block uppercase">
                India Telemedicine
              </span>
            </div>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`whitespace-nowrap transition-colors py-1 ${
                  currentView === link.id
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + Language & Role switch */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                title="Change Language"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 text-xs">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3 py-2 hover:bg-teal-50 ${language === 'en' ? 'text-teal-700 font-semibold bg-teal-50/50' : 'text-slate-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={`w-full text-left px-3 py-2 hover:bg-teal-50 ${language === 'hi' ? 'text-teal-700 font-semibold bg-teal-50/50' : 'text-slate-700'}`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    onClick={() => handleLanguageChange('mr')}
                    className={`w-full text-left px-3 py-2 hover:bg-teal-50 ${language === 'mr' ? 'text-teal-700 font-semibold bg-teal-50/50' : 'text-slate-700'}`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              )}
            </div>

            {/* User or Role switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-teal-700 font-semibold uppercase bg-teal-50 border border-teal-200 px-1 rounded">
                    {currentUser.role}
                  </span>
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate(currentUser.role === 'doctor' ? 'doctor-dashboard' : currentUser.role === 'admin' ? 'admin-dashboard' : 'patient-dashboard');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      Open {currentUser.role === 'doctor' ? 'Doctor' : currentUser.role === 'admin' ? 'Admin' : 'Patient'} Dashboard
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1 px-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Switch Demo Role:
                      </p>
                      <div className="flex gap-1">
                        {(['patient', 'doctor', 'admin'] as Role[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              loginAs(r);
                              setRoleMenuOpen(false);
                              if (r === 'doctor') onNavigate('doctor-dashboard');
                              else if (r === 'admin') onNavigate('admin-dashboard');
                              else onNavigate('patient-dashboard');
                            }}
                            className={`px-2 py-1 text-[11px] rounded capitalize ${
                              currentUser.role === r
                                ? 'bg-teal-600 text-white font-semibold'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setRoleMenuOpen(false);
                          onNavigate('home');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md"
              >
                {t.nav.login}
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('doctors')}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              {t.hero.consultDoctorCta}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
            >
              {t.nav.home}
            </button>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('tests')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 rounded flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Safety & System Test Suite</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Language:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-teal-600 text-white font-medium' : 'bg-slate-100 text-slate-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2 py-1 text-xs rounded ${language === 'hi' ? 'bg-teal-600 text-white font-medium' : 'bg-slate-100 text-slate-700'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLanguageChange('mr')}
                className={`px-2 py-1 text-xs rounded ${language === 'mr' ? 'bg-teal-600 text-white font-medium' : 'bg-slate-100 text-slate-700'}`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
