import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Lock,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Appointment, SymptomAssessment } from '../types';

interface BookAppointmentPageProps {
  doctorId?: string;
  preselectedAssessment?: SymptomAssessment | null;
  onNavigate: (view: string, param?: string) => void;
}

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({
  doctorId = 'doc-201',
  preselectedAssessment,
  onNavigate,
}) => {
  const { doctors, bookAppointment, assessments } = useClinic();
  const { currentUser, patientProfile } = useAuth();
  const { t } = useLanguage();

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [consultationType, setConsultationType] = useState<'text' | 'video' | 'in_clinic'>('text');
  const [symptomSummary, setSymptomSummary] = useState(
    preselectedAssessment?.symptomSummary || ''
  );
  const [attachedAssessmentId, setAttachedAssessmentId] = useState(
    preselectedAssessment?.id || ''
  );
  const [telemedicineConsent, setTelemedicineConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedTimeSlot) {
      setErrorMsg('Please select an available consultation time slot.');
      return;
    }

    if (!telemedicineConsent) {
      setErrorMsg('Informed consent is required under Indian Telemedicine Practice Guidelines.');
      return;
    }

    const patientName = currentUser?.name || 'Aarav Sharma';
    const patientEmail = currentUser?.email || 'patient@example.in';

    const result = bookAppointment({
      patientId: currentUser?.id || 'pat-101',
      patientName,
      patientEmail,
      doctorId: doctor.id,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      symptomSummary: symptomSummary || 'General consultation request.',
      symptomAssessmentId: attachedAssessmentId || undefined,
    });

    if (result.success && result.appointment) {
      setConfirmedAppointment(result.appointment);
    } else {
      setErrorMsg(result.error || 'Failed to book slot.');
    }
  };

  if (confirmedAppointment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-teal-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-500 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Appointment Confirmed
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Consultation Successfully Scheduled
            </h1>
            <p className="text-xs text-slate-600">
              Booking ID: <strong className="font-mono text-slate-900">{confirmedAppointment.id}</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-xs space-y-3">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-400 block">Doctor:</span>
                <span className="font-bold text-slate-900">{confirmedAppointment.doctorName}</span>
                <span className="text-slate-500 block text-[11px]">{confirmedAppointment.doctorSpecialty}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date & Time:</span>
                <span className="font-bold text-slate-900">{confirmedAppointment.date}</span>
                <span className="text-slate-600 block">{confirmedAppointment.timeSlot}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block">Consultation Mode:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {confirmedAppointment.consultationType} Consultation
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Consultation Fee:</span>
                <span className="font-bold text-slate-900">₹{confirmedAppointment.consultationFee}</span>
                <span className="text-teal-700 block text-[11px]">Paid / Confirmed</span>
              </div>
            </div>

            {confirmedAppointment.symptomSummary && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block">Symptom Note for Doctor:</span>
                <p className="text-slate-700 mt-0.5">{confirmedAppointment.symptomSummary}</p>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>A confirmation email and SMS reminder have been recorded for your appointment.</p>
            <p className="text-[11px] text-slate-400">
              In accordance with Telemedicine Practice Guidelines, please keep any previous lab reports or medication lists ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('patient-dashboard')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Go to Patient Dashboard
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
          <Calendar className="w-4 h-4" />
          <span>Telemedicine Booking Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Request a Doctor Consultation
        </h1>
        <p className="text-sm text-slate-600">
          Choose your preferred clinician, time slot, and consultation mode.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 rounded-lg p-4 text-xs text-rose-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Booking Notice:</strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Doctor selection & slot picker */}
        <div className="lg:col-span-7 space-y-6">
          {/* Doctor picker */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Select Physician:
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty} (₹{d.consultationFee})
                </option>
              ))}
            </select>

            {/* Doctor mini summary */}
            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 text-slate-600 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{doctor.name}</span>
                <span className="font-mono text-teal-800 text-[11px] font-semibold">{doctor.registrationNumber}</span>
              </div>
              <p className="text-slate-500 text-[11px]">{doctor.registrationCouncil} · {doctor.hospitalAffiliation}</p>
              <p className="text-[11px] text-slate-600">Languages: {doctor.languages.join(', ')}</p>
            </div>
          </div>

          {/* Consultation mode */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Consultation Mode:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'text', label: 'Secure Text', desc: 'Asynchronous text consultation' },
                { id: 'video', label: 'Video Call', desc: 'Live virtual video session' },
                { id: 'in_clinic', label: 'In-Clinic', desc: 'Hospital / OPD visit' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setConsultationType(mode.id as any)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    consultationType === mode.id
                      ? 'border-teal-600 bg-teal-50/60 text-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="font-bold text-xs">{mode.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Slot selection */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Select Date:
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Select Available Time Slot: <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doctor.availableTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-between ${
                      selectedTimeSlot === slot
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{slot}</span>
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Symptom summary attachment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Symptoms / Health Reason for Visit:
              </label>
              {assessments.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const latest = assessments[0];
                    setAttachedAssessmentId(latest.id);
                    setSymptomSummary(latest.symptomSummary);
                  }}
                  className="text-[11px] text-teal-700 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Attach Recent AI Assessment</span>
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={symptomSummary}
              onChange={(e) => setSymptomSummary(e.target.value)}
              placeholder="Describe your current concern or reason for consultation..."
              className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Right column: Fee Breakdown, Telemedicine Consent, Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Consultation Fee Breakdown
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Physician Consultation Fee</span>
                <span className="font-semibold text-slate-900">₹{doctor.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Digital Platform & Records Fee</span>
                <span className="text-teal-700 font-semibold">₹0 (Included)</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable Taxes</span>
                <span className="text-slate-500">₹0</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Payable</span>
                <span>₹{doctor.consultationFee}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Payment & Cancellation Policy:</p>
              <p>Free rescheduling up to 2 hours before the scheduled time slot. Full refund for medical cancellations.</p>
            </div>
          </div>

          {/* Telemedicine Practice Guidelines & DPDP Informed Consent */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Informed Patient Consent</span>
            </h3>

            <div className="text-[11px] text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-36 overflow-y-auto">
              <p>
                1. I voluntarily seek telemedicine consultation in compliance with the Telemedicine Practice Guidelines issued by the Board of Governors in supersession of Medical Council of India (2020).
              </p>
              <p>
                2. I understand that telemedicine has inherent limitations compared to an in-person physical clinical examination.
              </p>
              <p>
                3. I give consent to share the symptom summary and voluntary health history with Dr. {doctor.name} for clinical consultation purposes under the Digital Personal Data Protection Act, 2023.
              </p>
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700 pt-1">
              <input
                type="checkbox"
                required
                checked={telemedicineConsent}
                onChange={(e) => setTelemedicineConsent(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="leading-snug">
                I agree to the Telemedicine Consent and Terms of Care.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedTimeSlot || !telemedicineConsent}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Confirm & Reserve Appointment (₹{doctor.consultationFee})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
