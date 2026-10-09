import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import { useLanguage } from '../context/LanguageContext';

interface PatientDashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const PatientDashboardPage: React.FC<PatientDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser, patientProfile, withdrawConsent, requestAccountDeletion } = useAuth();
  const { appointments, clinicalNotes, assessments } = useClinic();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'appointments' | 'notes' | 'assessments' | 'profile'>('appointments');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [consentWithdrawnMessage, setConsentWithdrawnMessage] = useState(false);

  // Filter appointments for current patient
  const userAppointments = appointments.filter(
    (apt) => apt.patientId === (currentUser?.id || 'pat-101')
  );

  const upcomingAppointments = userAppointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'requested' || apt.status === 'in_progress'
  );

  const pastAppointments = userAppointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'cancelled'
  );

  const userNotes = clinicalNotes.filter(
    (n) => n.patientId === (currentUser?.id || 'pat-101')
  );

  const handleWithdrawConsent = () => {
    withdrawConsent();
    setConsentWithdrawnMessage(true);
    setTimeout(() => setConsentWithdrawnMessage(false), 4000);
  };

  const handleDeleteAccount = () => {
    requestAccountDeletion();
    onNavigate('home');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-lg shadow-xs">
            {currentUser?.name?.[0] || 'P'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Welcome, {currentUser?.name || 'Aarav Sharma'}
            </h1>
            <p className="text-xs text-slate-500">
              Patient Portal · ID: <span className="font-mono">{currentUser?.id || 'pat-101'}</span> · {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('symptom-checker')}
            className="px-3.5 py-2 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Check Symptoms
          </button>
          <button
            onClick={() => onNavigate('doctors')}
            className="px-3.5 py-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Book Consultation
          </button>
        </div>
      </div>

      {consentWithdrawnMessage && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Consent has been withdrawn in accordance with DPDP Act, 2023. Non-emergency consultations paused until renewed.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 transition-colors ${
            activeTab === 'appointments'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          My Appointments ({userAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 transition-colors ${
            activeTab === 'notes'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Doctor Clinical Notes ({userNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`pb-3 transition-colors ${
            activeTab === 'assessments'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          AI Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors ${
            activeTab === 'profile'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Privacy & Settings
        </button>
      </div>

      {/* Tab: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Upcoming Consultations</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl border border-teal-200 p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          {apt.consultationType} Consultation
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                        <p className="text-xs text-slate-500">{apt.doctorSpecialty}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date: <strong>{apt.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Time: <strong>{apt.timeSlot}</strong></span>
                      </div>
                    </div>

                    {apt.symptomSummary && (
                      <p className="text-xs text-slate-600 italic">
                        "{apt.symptomSummary}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="font-semibold text-slate-900">Fee: ₹{apt.consultationFee} (Paid)</span>
                      <button
                        onClick={() => onNavigate('chat')}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                      >
                        Open Message Room →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No upcoming consultations scheduled.
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">Past Consultations</h2>
            {pastAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastAppointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{apt.doctorName}</h4>
                        <p className="text-slate-500">{apt.date} · {apt.timeSlot}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-700">
                        {apt.status}
                      </span>
                    </div>
                    {apt.symptomSummary && <p className="text-slate-600">{apt.symptomSummary}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No past consultations yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Doctor Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3.5 text-xs text-teal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              All records below are authenticated and authored directly by registered medical doctors in compliance with Indian Telemedicine Guidelines. AI is never used to write doctor clinical notes.
            </span>
          </div>

          {userNotes.length > 0 ? (
            userNotes.map((note) => (
              <div key={note.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Clinical Consultation Record</h3>
                    <p className="text-xs text-slate-500">
                      Authoring Physician: <strong className="text-slate-800">{note.doctorName}</strong> ({note.doctorRegistration})
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    Recorded: {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                      Patient Reported Symptoms (Subjective)
                    </span>
                    <p className="text-slate-800">{note.subjectiveSymptoms}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                      Clinical Observations & Examination
                    </span>
                    <p className="text-slate-800">{note.clinicalObservations}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] block">
                      Provisional Assessment / Diagnosis
                    </span>
                    <p className="text-slate-900 font-bold">{note.provisionalDiagnosis}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                      Physician Care Plan & Instructions
                    </span>
                    <p className="text-slate-800">{note.carePlanInstructions}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                      Lifestyle Advice & Follow-Up
                    </span>
                    <p className="text-slate-800">{note.prescribedLifestyleAdvice} · {note.followUpAdvice}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No clinical notes authored yet. Once a doctor completes a consultation with you, their clinical assessment and care plan will appear here.
            </div>
          )}
        </div>
      )}

      {/* Tab: AI Assessments */}
      {activeTab === 'assessments' && (
        <div className="space-y-4">
          {assessments.length > 0 ? (
            assessments.map((asm) => (
              <div key={asm.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">{asm.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{asm.mainSymptom}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    asm.urgency === 'emergency' ? 'bg-rose-100 text-rose-800' : 'bg-teal-50 text-teal-800'
                  }`}>
                    {asm.urgency}
                  </span>
                </div>
                <p className="text-slate-700">{asm.symptomSummary}</p>
                <div className="text-[11px] text-slate-500">
                  <span>Reported: {new Date(asm.timestamp).toLocaleString()}</span>
                  <span> · Severity: {asm.severity}</span>
                  <span> · Duration: {asm.duration}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500 space-y-3">
              <p>You haven't run any AI symptom assessments yet.</p>
              <button
                onClick={() => onNavigate('symptom-checker')}
                className="px-4 py-2 bg-teal-600 text-white font-semibold text-xs rounded-lg"
              >
                Start Symptom Assessment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Privacy & Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Digital Personal Data Protection (DPDP) Settings</h3>
            <p className="text-slate-500">
              India Digital Personal Data Protection Act, 2023 compliance controls.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Telemedicine & Health Data Consent</p>
                <p className="text-[11px] text-slate-500">
                  Status: {patientProfile?.consentGiven ? 'Active & Consented' : 'Withdrawn'}
                </p>
              </div>
              <button
                onClick={handleWithdrawConsent}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded text-xs"
              >
                Withdraw Consent
              </button>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">State & Location Reference</p>
                <p className="text-[11px] text-slate-500">
                  {patientProfile?.city || 'Pune'}, {patientProfile?.state || 'Maharashtra'}
                </p>
              </div>
              <span className="text-slate-400">Indian Telemedicine Jurisdiction</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-semibold text-rose-700">Delete Account & Health Records</p>
                <p className="text-[11px] text-slate-500">
                  Permanently erase your consultation history, assessments, and profile from this device.
                </p>
              </div>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold rounded text-xs"
              >
                Request Erasure
              </button>
            </div>
          </div>

          {deleteConfirm && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-lg space-y-3">
              <p className="text-rose-900 font-bold">Confirm Account & Data Erasure?</p>
              <p className="text-rose-800 text-[11px]">
                This will purge all your consultation records, appointments, and stored session data in compliance with Section 12 of the DPDP Act, 2023.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 bg-rose-700 text-white font-bold rounded"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
