import React from 'react';
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Heart,
  Activity,
  Wind,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyGuidancePage: React.FC = () => {
  const { language } = useLanguage();

  const redFlags = [
    {
      category: 'Cardiac & Chest Distress',
      signs: [
        'Sudden, severe, or crushing chest pain or pressure',
        'Pain radiating to left arm, neck, jaw, or upper back',
        'Chest pain accompanied by cold sweating, dizziness, or shortness of breath',
      ],
      action: 'Call 112 / 108 immediately. Have the patient sit comfortably with back supported. Do not allow exertion.',
    },
    {
      category: 'Stroke Symptoms (FAST Protocol)',
      signs: [
        'Face drooping on one side (ask the person to smile)',
        'Arm weakness or sudden numbness (ask them to raise both arms)',
        'Slurred speech or sudden inability to speak or comprehend',
      ],
      action: 'Time is critical (Golden Hour). Call 112 immediately. Note down the exact time symptoms began.',
    },
    {
      category: 'Severe Respiratory Distress',
      signs: [
        'Struggling for breath, gasping, or choking',
        'Blue tint on lips, face, or fingertips (cyanosis)',
        'Inability to speak full sentences due to breathlessness',
      ],
      action: 'Loosen tight clothing. Ensure fresh ventilation. Seek emergency casualty care without delay.',
    },
    {
      category: 'Altered Consciousness & Seizures',
      signs: [
        'Loss of consciousness or fainting without prompt recovery',
        'Continuous convulsions or repeated seizures lasting > 3 minutes',
        'Sudden acute confusion, disorientation, or unresponsiveness',
      ],
      action: 'Place the person in recovery position (on their side) if breathing. Do not put anything in their mouth during a seizure.',
    },
    {
      category: 'Severe Bleeding & Hemorrhage',
      signs: [
        'Pulsing or uncontrolled bleeding that does not stop with direct pressure',
        'Coughing or vomiting substantial quantities of blood',
      ],
      action: 'Apply firm direct pressure with clean cloth. Elevate injured limb if possible and call 108.',
    },
    {
      category: 'Poisoning & Venomous Bites',
      signs: [
        'Snake bite, scorpion sting, or accidental ingestion of chemicals/pesticides',
        'Sudden swelling of throat, tongue, or severe allergic reaction (Anaphylaxis)',
      ],
      action: 'Immobilize limb for snake bites. Do not cut or suck venom. Transport immediately to an anti-venom equipped casualty.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="space-y-3 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
          <ShieldAlert className="w-4 h-4" />
          <span>India Emergency Care Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Emergency Guidance & Red Flag Symptom Protocol
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Online doctor consultations and virtual chatbots are strictly for non-life-threatening conditions. If you or someone with you exhibits any of the following symptoms, act immediately.
        </p>
      </div>

      {/* Emergency numbers grid */}
      <div className="bg-rose-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-rose-300" />
          <span>National Emergency Helpline Numbers (India)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-rose-950/60 p-4 rounded-xl border border-rose-800 text-center space-y-1">
            <span className="text-xs text-rose-300 block">All-in-One Emergency</span>
            <a href="tel:112" className="text-3xl font-bold text-white hover:text-rose-200 block tabular-nums">
              112
            </a>
            <span className="text-[11px] text-rose-300">National Emergency Support System</span>
          </div>

          <div className="bg-rose-950/60 p-4 rounded-xl border border-rose-800 text-center space-y-1">
            <span className="text-xs text-rose-300 block">Ambulance Emergency</span>
            <a href="tel:108" className="text-3xl font-bold text-white hover:text-rose-200 block tabular-nums">
              108
            </a>
            <span className="text-[11px] text-rose-300">Government Emergency Ambulance</span>
          </div>

          <div className="bg-rose-950/60 p-4 rounded-xl border border-rose-800 text-center space-y-1">
            <span className="text-xs text-rose-300 block">National Health Helpline</span>
            <a href="tel:1075" className="text-3xl font-bold text-white hover:text-rose-200 block tabular-nums">
              1075
            </a>
            <span className="text-[11px] text-rose-300">MoHFW Govt. of India Support</span>
          </div>
        </div>
      </div>

      {/* Red flag categories */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Recognize Critical Warning Signs:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {redFlags.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{item.category}</span>
              </h4>

              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {item.signs.map((sign, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">{sign}</li>
                ))}
              </ul>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-800">
                <strong className="block text-slate-900 mb-0.5">Immediate First Step:</strong>
                <p>{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-slate-600 leading-relaxed space-y-2">
        <strong className="text-slate-900 block text-sm">Regulatory Safe-Harbor Notice:</strong>
        <p>
          As mandated by the Board of Governors in supersession of the Medical Council of India (MCI) Telemedicine Practice Guidelines (March 2020), Registered Medical Practitioners (RMPs) and virtual health platforms shall not provide telemedicine consultation during in-person emergencies. Patients must seek physical casualty care without delay.
        </p>
      </div>
    </div>
  );
};
