import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  AlertCircle,
  Save,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';

interface DoctorDashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({ onNavigate }) => {
  const { doctors, appointments, updateAppointmentStatus, saveClinicalNote, updateDoctorFee } = useClinic();
  const { currentUser } = useAuth();

  // Find the active logged-in doctor profile, or default to Dr. Priya Kulkarni
  const doctor = doctors.find((d) => d.id === 'doc-201') || doctors[0];

  const [activeTab, setActiveTab] = useState<'appointments' | 'author_note' | 'settings'>('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    appointments.find((a) => a.doctorId === doctor.id) || null
  );

  // Clinical note authoring form state
  const [subjective, setSubjective] = useState('');
  const [observations, setObservations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [carePlan, setCarePlan] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [noteSavedMsg, setNoteSavedMsg] = useState(false);

  // Settings
  const [feeInput, setFeeInput] = useState(doctor.consultationFee.toString());
  const [feeUpdatedMsg, setFeeUpdatedMsg] = useState(false);

  const doctorAppointments = appointments.filter((a) => a.doctorId === doctor.id);

  const handleStartAuthoring = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setSubjective(apt.symptomSummary || 'Patient reported mild symptoms.');
    setObservations('Patient alert and oriented. Vital signs reported stable.');
    setDiagnosis('Acute uncomplicated syndrome under clinical evaluation');
    setCarePlan('Encourage adequate oral hydration, rest, and monitoring.');
    setLifestyle('Avoid strenuous exertion. Report immediately if red flag symptoms develop.');
    setFollowUp('Review in 3 days if symptoms persist.');
    setActiveTab('author_note');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    saveClinicalNote({
      appointmentId: selectedAppointment.id,
      patientId: selectedAppointment.patientId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorRegistration: doctor.registrationNumber,
      subjectiveSymptoms: subjective,
      clinicalObservations: observations,
      provisionalDiagnosis: diagnosis,
      carePlanInstructions: carePlan,
      prescribedLifestyleAdvice: lifestyle,
      followUpAdvice: followUp,
      referralRequired: false,
    });

    setNoteSavedMsg(true);
    setTimeout(() => {
      setNoteSavedMsg(false);
      setActiveTab('appointments');
    }, 2000);
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(feeInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateDoctorFee(doctor.id, parsed);
      setFeeUpdatedMsg(true);
      setTimeout(() => setFeeUpdatedMsg(false), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Doctor Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-xl shadow-xs">
            {doctor.name.split(' ')[1]?.[0] || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{doctor.name}</h1>
              <span title="Verified Clinician">
                <UserCheck className="w-4 h-4 text-teal-600" />
              </span>
            </div>
            <p className="text-xs text-teal-700 font-semibold">{doctor.title}</p>
            <p className="text-xs text-slate-500">
              Reg: <strong className="font-mono text-slate-700">{doctor.registrationNumber}</strong> · {doctor.registrationCouncil}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
          <span className="block text-slate-400 text-[10px] uppercase font-semibold">Active Consultation Fee</span>
          <span className="text-lg font-bold text-slate-900">₹{doctor.consultationFee}</span>
          <span className="text-teal-700 block text-[11px]">NMC Status: Verified Registered</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 transition-colors ${
            activeTab === 'appointments'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Consultation Queue ({doctorAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('author_note')}
          className={`pb-3 transition-colors ${
            activeTab === 'author_note'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Author Clinical Note (SOAP)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 transition-colors ${
            activeTab === 'settings'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Availability & Fee Settings
        </button>
      </div>

      {/* Tab: Appointments Queue */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Assigned Patient Appointments</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorAppointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">{apt.id}</span>
                    <h3 className="text-base font-bold text-slate-900">{apt.patientName}</h3>
                    <p className="text-xs text-slate-500">{apt.patientEmail}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    apt.status === 'completed'
                      ? 'bg-slate-100 text-slate-600'
                      : apt.status === 'confirmed'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-amber-50 text-amber-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 text-slate-700 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Scheduled: <strong>{apt.date}</strong> at <strong>{apt.timeSlot}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mode: <strong className="capitalize">{apt.consultationType} Consultation</strong></span>
                  </div>
                </div>

                {apt.symptomSummary && (
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Patient Symptom Description:</span>
                    <p className="bg-slate-50 p-2.5 rounded border border-slate-100 italic">
                      "{apt.symptomSummary}"
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigate('chat')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Open Consultation Chat →
                  </button>

                  <button
                    onClick={() => handleStartAuthoring(apt)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    Author Clinical Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Author Clinical Note */}
      {activeTab === 'author_note' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Author Clinician Consultation Note (Telemedicine Practice Guidelines)
            </h2>
            <p className="text-xs text-slate-500">
              Directly author the official medical assessment and instructions for the patient. This will be signed with your MMC/DMC registration details.
            </p>
          </div>

          {selectedAppointment && (
            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-200">
              <span className="font-semibold text-slate-800">
                Patient: {selectedAppointment.patientName} (ID: {selectedAppointment.patientId})
              </span>
              <p className="text-slate-500">
                Appointment ID: {selectedAppointment.id} · Date: {selectedAppointment.date}
              </p>
            </div>
          )}

          {noteSavedMsg && (
            <div className="bg-teal-50 border border-teal-300 rounded-lg p-3 text-xs text-teal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Clinical note authenticated and saved! Appointment status marked as completed.</span>
            </div>
          )}

          <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                1. Subjective Symptoms (Patient-Reported History)
              </label>
              <textarea
                rows={2}
                required
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                2. Clinical Observations & Tele-Examination
              </label>
              <textarea
                rows={2}
                required
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                3. Provisional Clinical Diagnosis / Impression
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                4. Care Plan & Medical Instructions
              </label>
              <textarea
                rows={3}
                required
                value={carePlan}
                onChange={(e) => setCarePlan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  5. Lifestyle & Non-Pharmacological Advice
                </label>
                <input
                  type="text"
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  6. Follow-up & Red Flag Warning Signs
                </label>
                <input
                  type="text"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Digital Signature: <strong>{doctor.name}</strong> ({doctor.registrationNumber})
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Authenticate & Finalize Record</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Physician Profile & Pricing Settings</h2>
            <p className="text-slate-500">Configure consultation fee and verified practice information.</p>
          </div>

          {feeUpdatedMsg && (
            <div className="bg-teal-50 border border-teal-300 rounded-lg p-3 text-teal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Consultation fee updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdateFee} className="space-y-4 max-w-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Consultation Fee (INR ₹):</label>
              <input
                type="number"
                min={100}
                max={5000}
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none font-bold text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Update Consultation Fee
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800">State Medical Registration Record</h4>
            <div className="grid grid-cols-2 gap-4 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Authority</span>
                <span>{doctor.registrationCouncil}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Registration Number</span>
                <span className="font-mono">{doctor.registrationNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
