/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ClinicProvider } from './context/ClinicContext';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { MedicalChatPage } from './pages/MedicalChatPage';
import { DoctorDirectoryPage } from './pages/DoctorDirectoryPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EmergencyGuidancePage } from './pages/EmergencyGuidancePage';
import { AuthPages } from './pages/AuthPages';
import {
  PrivacyPolicyPage,
  TermsOfUsePage,
  MedicalDisclaimerPage,
  DataDeletionPage,
  ContactPage,
} from './pages/LegalPages';
import { TestRunnerPage } from './pages/TestRunnerPage';
import { SymptomAssessment } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [prefilledSymptom, setPrefilledSymptom] = useState<string>('');
  const [activeAssessment, setActiveAssessment] = useState<SymptomAssessment | null>(null);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSymptomCheckWithText = (text: string) => {
    setPrefilledSymptom(text);
  };

  const handleShareAssessmentWithDoctor = (assessment: SymptomAssessment) => {
    setActiveAssessment(assessment);
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <ClinicProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
            {/* Top emergency warning bar */}
            <EmergencyBanner />

            {/* Navigation header conforming to Top Bar Contract */}
            <Navbar currentView={currentView} onNavigate={handleNavigate} />

            {/* Main content view */}
            <main className="flex-1">
              {currentView === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onStartSymptomCheckWithText={handleStartSymptomCheckWithText}
                />
              )}

              {currentView === 'symptom-checker' && (
                <SymptomCheckerPage
                  initialText={prefilledSymptom}
                  onNavigate={handleNavigate}
                  onShareWithDoctor={handleShareAssessmentWithDoctor}
                />
              )}

              {currentView === 'chat' && (
                <MedicalChatPage onNavigate={handleNavigate} />
              )}

              {currentView === 'doctors' && (
                <DoctorDirectoryPage onNavigate={handleNavigate} />
              )}

              {currentView === 'book' && (
                <BookAppointmentPage
                  doctorId={viewParam || 'doc-201'}
                  preselectedAssessment={activeAssessment}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'patient-dashboard' && (
                <PatientDashboardPage onNavigate={handleNavigate} />
              )}

              {currentView === 'doctor-dashboard' && (
                <DoctorDashboardPage onNavigate={handleNavigate} />
              )}

              {currentView === 'admin-dashboard' && (
                <AdminDashboardPage />
              )}

              {currentView === 'emergency' && (
                <EmergencyGuidancePage />
              )}

              {currentView === 'login' && (
                <AuthPages mode="login" onNavigate={handleNavigate} />
              )}

              {currentView === 'register' && (
                <AuthPages mode="register" onNavigate={handleNavigate} />
              )}

              {currentView === 'privacy' && <PrivacyPolicyPage />}
              {currentView === 'terms' && <TermsOfUsePage />}
              {currentView === 'disclaimer' && <MedicalDisclaimerPage />}
              {currentView === 'data-deletion' && <DataDeletionPage />}
              {currentView === 'contact' && <ContactPage />}
              {currentView === 'tests' && <TestRunnerPage />}
            </main>

            {/* Regulatory footer */}
            <Footer onNavigate={handleNavigate} />
          </div>
        </ClinicProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
