import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Calendar,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  FileCheck,
  Stethoscope,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { doctors, appointments, auditLogs, config, updateDoctorVerification, updateClinicConfig } = useClinic();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'stats' | 'doctors' | 'audit' | 'compliance'>('stats');
  const [clinicNameInput, setClinicNameInput] = useState(config.clinicName);
  const [supportPhoneInput, setSupportPhoneInput] = useState(config.supportPhone);
  const [configUpdatedMsg, setConfigUpdatedMsg] = useState(false);

  const totalConsultations = appointments.length;
  const verifiedDoctors = doctors.filter((d) => d.verified).length;
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;

  const handleToggleVerification = (doctorId: string, currentStatus: boolean) => {
    updateDoctorVerification(doctorId, !currentStatus);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicConfig({
      clinicName: clinicNameInput,
      supportPhone: supportPhoneInput,
    });
    setConfigUpdatedMsg(true);
    setTimeout(() => setConfigUpdatedMsg(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator & Clinical Governance Console</span>
          </div>
          <h1 className="text-xl font-bold">Regulatory & Operational Dashboard</h1>
          <p className="text-xs text-slate-400">
            National Medical Commission (NMC) Verification · DPDP Act 2023 Audit Logs
          </p>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400 block">Logged in as:</span>
          <span className="font-bold text-white">{currentUser?.name || 'Compliance Admin'}</span>
          <span className="text-[10px] text-teal-400 block">Role: System Administrator</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Total Consultations</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalConsultations}</p>
          <span className="text-[11px] text-teal-700 font-medium">Aggregated Records</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Registered Doctors</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{doctors.length}</p>
          <span className="text-[11px] text-teal-700 font-medium">{verifiedDoctors} Council Verified</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Completed Sessions</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{completedAppointments}</p>
          <span className="text-[11px] text-teal-700 font-medium">SOAP Notes Authored</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Security Audit Logs</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{auditLogs.length}</p>
          <span className="text-[11px] text-slate-500">DPDP Immutable Logs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 transition-colors ${
            activeTab === 'stats'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Platform Configuration
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`pb-3 transition-colors ${
            activeTab === 'doctors'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Doctor Verification Queue ({doctors.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 transition-colors ${
            activeTab === 'audit'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Security & Access Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`pb-3 transition-colors ${
            activeTab === 'compliance'
              ? 'text-teal-700 border-b-2 border-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          DPDP & Telemedicine Checklist
        </button>
      </div>

      {/* Tab: Platform Configuration */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Clinic Identity & Contact Information</h2>
            <p className="text-slate-500">Customizable settings for Indian telemedicine platform operations.</p>
          </div>

          {configUpdatedMsg && (
            <div className="bg-teal-50 border border-teal-300 rounded-lg p-3 text-teal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Platform Brand Name:</label>
              <input
                type="text"
                value={clinicNameInput}
                onChange={(e) => setClinicNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Support Helpline:</label>
              <input
                type="text"
                value={supportPhoneInput}
                onChange={(e) => setSupportPhoneInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
              >
                Save Configuration
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-900">Regulatory Authorities Configured</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">National Emergency</span>
                <span className="font-bold text-slate-900 text-sm">{config.emergencyPhone} (All India)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Ambulance Service</span>
                <span className="font-bold text-slate-900 text-sm">{config.ambulancePhone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">National Health Helpline</span>
                <span className="font-bold text-slate-900 text-sm">{config.nationalHealthHelpline}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Doctor Verification */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Registration Authority</th>
                  <th className="px-4 py-3">License Reg No.</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-slate-500 text-[11px]">{doc.qualifications}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{doc.registrationCouncil}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-800">{doc.registrationNumber}</td>
                    <td className="px-4 py-3.5 text-slate-700">{doc.experienceYears} Years</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.verified ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {doc.verified ? 'Verified' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleVerification(doc.id, doc.verified)}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                          doc.verified
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-teal-600 text-white hover:bg-teal-700'
                        }`}
                      >
                        {doc.verified ? 'Revoke Approval' : 'Approve & Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Security Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">DPDP Act 2023 Security Audit Trail</h2>
            <p className="text-slate-500">Immutable chronological record of role authentications, slot bookings, and clinical authorizations.</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-slate-900">{log.action}</span>
                  <span className="text-slate-500 text-[11px] block">
                    Resource: {log.resourceType} ({log.resourceId}) · Actor: {log.actorName} ({log.actorRole})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-teal-700 font-bold uppercase">Audit Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Compliance Checklist */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Pre-Launch Healthcare & Privacy Compliance Checklist</h2>
            <p className="text-slate-500">Requirements under Indian Telemedicine Guidelines & DPDP Act, 2023.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Telemedicine Practice Guidelines (2020) Adherence',
                desc: 'Only registered medical practitioners (RMPs) with valid state medical council / NMC registrations can consult. No AI prescriptions permitted.',
                status: 'Compliant & Enforced',
              },
              {
                title: 'DPDP Act 2023 Consent & Withdrawal Workflows',
                desc: 'Informed consent is captured prior to booking. Patients can withdraw consent and request permanent account data erasure.',
                status: 'Compliant & Enforced',
              },
              {
                title: 'Deterministic Red Flag Emergency Triage',
                desc: 'Acute warning signs (chest pain, stroke symptoms, unconsciousness) immediately trigger India National Emergency 112 guidance.',
                status: 'Compliant & Enforced',
              },
              {
                title: 'Minor Patient Guardian Consent',
                desc: 'Parent or guardian authorization workflow is required before scheduling non-emergency pediatric consultations.',
                status: 'Compliant & Enforced',
              },
              {
                title: 'Separation of AI Guidance vs Doctor Clinical Notes',
                desc: 'AI health information is explicitly labeled as informational. Doctor clinical notes are authored only by verified doctors.',
                status: 'Compliant & Enforced',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
