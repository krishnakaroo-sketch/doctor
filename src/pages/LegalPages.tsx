import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, Trash2, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PrivacyPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
    <div className="border-b border-slate-200 pb-4 space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">Privacy Notice & Policy</h1>
      <p className="text-slate-500">Compliance with the Digital Personal Data Protection (DPDP) Act, 2023 · India</p>
    </div>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">1. Data Fiduciary Identity</h2>
      <p>
        Online Doctor Care operates as a Data Fiduciary under the provisions of the Digital Personal Data Protection Act, 2023 (DPDP Act). We process health data solely for delivering preliminary health information, patient triage, and scheduling verified doctor consultations.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">2. Principle of Data Minimization</h2>
      <p>
        We collect only minimal necessary information required to facilitate consultations: patient name, verified contact information, age group, and voluntary symptom descriptions. We never require a full lifelong medical dossier simply to create an account.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">3. Non-Commercialization of Health Data</h2>
      <p>
        Patient health narratives, symptom checker inputs, and clinical consultation records are strictly confidential. We do not sell, license, or monetize identifiable health data, nor do we train public AI models on private doctor-patient consultations without explicit separate authorization.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">4. Right to Withdrawal and Erasure</h2>
      <p>
        Under Section 12 of the DPDP Act, patients hold the unconditional right to review their stored records, withdraw processing consent, and request permanent erasure of their account records at any time.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">5. Grievance Officer</h2>
      <p>
        In accordance with Indian law, our designated Grievance Officer can be contacted at: <strong>grievance@onlinedoctorcare.in</strong>. All concerns will be redressed within 30 days.
      </p>
    </section>
  </div>
);

export const TermsOfUsePage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
    <div className="border-b border-slate-200 pb-4 space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">Terms of Use & Telemedicine Regulations</h1>
      <p className="text-slate-500">Governed by the Telemedicine Practice Guidelines, 2020 · National Medical Commission</p>
    </div>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">1. Nature of the Service</h2>
      <p>
        Online Doctor Care is a technology platform connecting users with registered human medical practitioners and offering educational health summaries. The platform facilitates virtual consultations in accordance with the Telemedicine Practice Guidelines (2020).
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">2. Emergency Disclaimer</h2>
      <p>
        This service is NOT for medical emergencies. Telemedicine has inherent limitations compared to physical palpation and auscultation. In the event of severe acute conditions (chest pain, respiratory arrest, stroke signs), the patient must immediately contact 112 / 108 or report to the nearest hospital casualty.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">3. Prescription Protocol</h2>
      <p>
        AI systems on this platform cannot, and will never, generate medical prescriptions. Only verified registered medical practitioners (RMPs) may issue medical advice or prescriptions after exercising their independent clinical judgment.
      </p>
    </section>
  </div>
);

export const MedicalDisclaimerPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
    <div className="border-b border-slate-200 pb-4 space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">Medical Disclaimer & AI Limitations</h1>
      <p className="text-slate-500">Important legal notice regarding automated health guidance</p>
    </div>

    <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 text-amber-900 space-y-2">
      <strong className="text-sm font-bold block">No Doctor-Patient Relationship Established by AI:</strong>
      <p>
        Interacting with the AI Health Assistant or AI Symptom Assessment does NOT create a doctor-patient relationship, nor does it constitute medical diagnosis, treatment, or clinical consultation.
      </p>
    </div>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">Informational Limitations</h2>
      <p>
        All summaries, possible conditions, and self-care tips generated by the AI assistant are for preliminary educational reference only. They are not guaranteed to be exhaustive. The absence of red flag warnings does not mean the user is completely safe from underlying pathology.
      </p>
    </section>

    <section className="space-y-2">
      <h2 className="text-sm font-bold text-slate-900">Consultation with Qualified Professionals</h2>
      <p>
        Always seek the advice of a qualified and registered medical doctor with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you read on this website.
      </p>
    </section>
  </div>
);

export const DataDeletionPage: React.FC = () => {
  const { requestAccountDeletion, currentUser } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleErase = () => {
    requestAccountDeletion();
    setSuccess(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-700">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Data & Account Erasure Request</h1>
          <p className="text-slate-500">
            Exercising the Right to Erasure under Section 12 of the DPDP Act, 2023.
          </p>
        </div>

        {success ? (
          <div className="bg-teal-50 border border-teal-300 rounded-xl p-5 text-center text-teal-900 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
            <h3 className="font-bold text-sm">Account & Health Data Purged</h3>
            <p>
              Your local records, symptom assessments, and consultation history have been successfully erased.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <p className="font-semibold text-slate-800">What happens when you request erasure:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>All stored symptom assessments and triage logs are purged.</li>
                <li>Your patient profile, contact numbers, and preferences are deleted.</li>
                <li>Your active sessions are securely terminated.</li>
              </ul>
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-rose-600"
              />
              <span className="leading-snug">
                I confirm that I wish to permanently delete my account and associated health records.
              </span>
            </label>

            <button
              onClick={handleErase}
              disabled={!confirmed}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Confirm Permanent Erasure
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-xs text-slate-700">
    <div className="border-b border-slate-200 pb-4 space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">Contact & Support</h1>
      <p className="text-slate-500">Reach our patient support desk and regulatory grievance cell.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm text-slate-900">Patient Helpline</h3>
        <p className="text-slate-600">For booking support, rescheduling, or platform assistance:</p>
        <p className="font-bold text-slate-900 text-sm">1800 200 4455 (Toll Free)</p>
        <span className="text-[11px] text-slate-500 block">Available 8:00 AM – 9:00 PM IST</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm text-slate-900">Email & Grievances</h3>
        <p className="text-slate-600">For legal inquiries or DPDP data requests:</p>
        <p className="font-bold text-slate-900 text-sm">compliance@onlinedoctorcare.in</p>
        <span className="text-[11px] text-slate-500 block">Response within 24-48 business hours</span>
      </div>
    </div>
  </div>
);
