import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import { evaluateEmergencyTriage } from '../services/safetyTriage';
import { checkSymptomsOnline } from '../services/api';
import { SymptomAssessment, UrgencyLevel } from '../types';

interface SymptomCheckerPageProps {
  initialText?: string;
  onNavigate: (view: string, param?: string) => void;
  onShareWithDoctor?: (assessment: SymptomAssessment) => void;
}

export const SymptomCheckerPage: React.FC<SymptomCheckerPageProps> = ({
  initialText = '',
  onNavigate,
  onShareWithDoctor,
}) => {
  const { language, t } = useLanguage();
  const { currentUser, patientProfile } = useAuth();
  const { saveAssessment } = useClinic();

  // Form states
  const [mainSymptom, setMainSymptom] = useState(initialText);
  const [duration, setDuration] = useState('yesterday');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | 'unbearable'>('mild');
  const [progression, setProgression] = useState<'improving' | 'worsening' | 'unchanged'>('unchanged');
  const [associatedInput, setAssociatedInput] = useState('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState('adult');
  const [pregnancyStatus, setPregnancyStatus] = useState('not_applicable');
  const [existingConditions, setExistingConditions] = useState('');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  // Execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SymptomAssessment | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<{
    triggered: boolean;
    title: string;
    instructions: string[];
  } | null>(null);

  // Common symptom suggestions for quick click
  const commonSymptoms = [
    'Mild headache',
    'Fever / Chills',
    'Dry cough',
    'Sore throat',
    'Body ache',
    'Nausea',
    'Stomach cramps',
    'Skin rash',
  ];

  const handleAddAssociated = (sym: string) => {
    if (!associatedSymptoms.includes(sym)) {
      setAssociatedSymptoms([...associatedSymptoms, sym]);
    }
  };

  const handleRemoveAssociated = (sym: string) => {
    setAssociatedSymptoms(associatedSymptoms.filter((s) => s !== sym));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainSymptom.trim()) return;

    setIsSubmitting(true);
    setEmergencyAlert(null);

    // 1. Run deterministic medical safety check FIRST
    const fullNarrative = `${mainSymptom} ${associatedSymptoms.join(' ')}`;
    const emergencyEval = evaluateEmergencyTriage(fullNarrative, language);

    if (emergencyEval.isEmergency || severity === 'unbearable') {
      setIsSubmitting(false);
      setEmergencyAlert({
        triggered: true,
        title: emergencyEval.emergencyTitle || 'Immediate Emergency Warning - Call 112',
        instructions: emergencyEval.emergencyInstructions,
      });

      // Still persist emergency record for patient safety record
      const emergencyAssessment = saveAssessment({
        patientId: currentUser?.id,
        mainSymptom,
        duration,
        severity,
        progression,
        associatedSymptoms,
        ageGroup,
        isEmergency: true,
        urgency: 'emergency',
        symptomSummary: `Emergency flagged: ${mainSymptom} (${severity}). Immediate clinical evaluation requested.`,
        possibleCauses: ['Acute medical emergency sign requiring hospital casualty evaluation.'],
        generalInformation: [
          'Symptoms described warrant immediate physical hospital attention.',
          'Do not wait or rely on virtual text guidance in an emergency.',
        ],
        recommendedNextStep: 'Dial India National Emergency (112) or Ambulance (108) immediately.',
        disclaimer: t.symptomChecker.results.doctorCta,
        language,
      });

      setResult(emergencyAssessment);
      return;
    }

    // 2. Call server-side API with Gemini AI engine
    try {
      const response = await checkSymptomsOnline({
        mainSymptom,
        duration,
        severity,
        progression,
        associatedSymptoms,
        ageGroup,
        pregnancyStatus: pregnancyStatus === 'pregnant' ? 'Pregnant' : undefined,
        existingConditions: existingConditions || (patientProfile?.existingConditions?.join(', ') || ''),
        language,
      });

      const newAssessment = saveAssessment({
        patientId: currentUser?.id,
        mainSymptom,
        duration,
        severity,
        progression,
        associatedSymptoms,
        ageGroup,
        isEmergency: response.emergencyWarning || false,
        urgency: response.urgency as UrgencyLevel,
        symptomSummary: response.symptomSummary,
        possibleCauses: response.possibleCauses,
        generalInformation: response.generalInformation,
        recommendedNextStep: response.recommendedNextStep,
        followUpQuestion: response.followUpQuestion,
        disclaimer: response.disclaimer,
        language,
      });

      setResult(newAssessment);
      if (response.emergencyWarning) {
        setEmergencyAlert({
          triggered: true,
          title: 'Immediate Emergency Warning - Call 112',
          instructions: [
            'Our clinical analysis flagged potentially acute symptoms.',
            'Please seek immediate emergency hospital evaluation.',
          ],
        });
      }
    } catch (err) {
      console.error('Symptom assessment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setEmergencyAlert(null);
    setMainSymptom('');
    setAssociatedSymptoms([]);
    setAssociatedInput('');
    setConsentAcknowledged(false);
  };

  const handleShareWithDoctorClick = () => {
    if (result) {
      if (onShareWithDoctor) {
        onShareWithDoctor(result);
      }
      onNavigate('doctors');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700">
          <FileText className="w-4 h-4" />
          <span>Interactive Clinical Triage</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.symptomChecker.title}
        </h1>
        <p className="text-sm text-slate-600">
          {t.symptomChecker.subtitle}
        </p>
      </div>

      {/* Emergency Alert Card (if triggered) */}
      {emergencyAlert && emergencyAlert.triggered && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-6 text-rose-950 space-y-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-rose-900">
                {emergencyAlert.title}
              </h2>
              <p className="text-xs text-rose-800">
                Critical warning flags detected in patient description.
              </p>
            </div>
          </div>

          <ul className="text-xs sm:text-sm space-y-2 text-rose-900 list-disc list-inside">
            {emergencyAlert.instructions.map((inst, idx) => (
              <li key={idx} className="leading-relaxed">{inst}</li>
            ))}
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm inline-flex items-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Dial 112 (National Emergency) Now</span>
            </a>
            <a
              href="tel:108"
              className="px-4 py-2 bg-white text-rose-900 border border-rose-300 hover:bg-rose-100 text-xs sm:text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Call Ambulance (108)</span>
            </a>
          </div>
        </div>
      )}

      {/* Form View (when no result yet) */}
      {!result ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Section 1: Main Symptom */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>{t.symptomChecker.step1}</span>
            </h3>

            <div className="space-y-2">
              <label htmlFor="main-symptom" className="block text-xs font-semibold text-slate-700">
                {t.symptomChecker.mainSymptomLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="main-symptom"
                rows={3}
                required
                value={mainSymptom}
                onChange={(e) => setMainSymptom(e.target.value)}
                placeholder={t.symptomChecker.mainSymptomPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white resize-none"
              />
              <p className="text-[11px] text-slate-500">
                Feel free to express your symptoms in English, Hindi (उदा. मुझे बुखार है), or Marathi (उदा. डोके दुखते आहे).
              </p>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-500">Common symptoms:</span>
              <div className="flex flex-wrap gap-1.5">
                {commonSymptoms.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      if (!mainSymptom) {
                        setMainSymptom(sym);
                      } else {
                        handleAddAssociated(sym);
                      }
                    }}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded transition-colors"
                  >
                    + {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Details */}
          <div className="space-y-5 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>{t.symptomChecker.step2}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Duration */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.durationLabel}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="today">{t.symptomChecker.durationOptions.today}</option>
                  <option value="yesterday">{t.symptomChecker.durationOptions.yesterday}</option>
                  <option value="week">{t.symptomChecker.durationOptions.week}</option>
                  <option value="longer">{t.symptomChecker.durationOptions.longer}</option>
                </select>
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.severityLabel}
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="mild">{t.symptomChecker.severities.mild}</option>
                  <option value="moderate">{t.symptomChecker.severities.moderate}</option>
                  <option value="severe">{t.symptomChecker.severities.severe}</option>
                  <option value="unbearable">{t.symptomChecker.severities.unbearable}</option>
                </select>
              </div>

              {/* Progression */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.progressionLabel}
                </label>
                <select
                  value={progression}
                  onChange={(e) => setProgression(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="improving">{t.symptomChecker.progressions.improving}</option>
                  <option value="unchanged">{t.symptomChecker.progressions.unchanged}</option>
                  <option value="worsening">{t.symptomChecker.progressions.worsening}</option>
                </select>
              </div>

              {/* Age Group */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.ageGroupLabel}
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="child">{t.symptomChecker.ageOptions.child}</option>
                  <option value="adult">{t.symptomChecker.ageOptions.adult}</option>
                  <option value="senior">{t.symptomChecker.ageOptions.senior}</option>
                </select>
              </div>
            </div>

            {/* Associated Symptoms Tags */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                {t.symptomChecker.associatedLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={associatedInput}
                  onChange={(e) => setAssociatedInput(e.target.value)}
                  placeholder="e.g. Dizziness, Chills..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (associatedInput.trim()) {
                        handleAddAssociated(associatedInput.trim());
                        setAssociatedInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (associatedInput.trim()) {
                      handleAddAssociated(associatedInput.trim());
                      setAssociatedInput('');
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                >
                  Add
                </button>
              </div>

              {associatedSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {associatedSymptoms.map((sym) => (
                    <span
                      key={sym}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-teal-50 text-teal-800 border border-teal-200 rounded"
                    >
                      <span>{sym}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssociated(sym)}
                        className="text-teal-700 hover:text-teal-900 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Patient Context */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>{t.symptomChecker.step3}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.existingConditionsLabel}
                </label>
                <input
                  type="text"
                  value={existingConditions}
                  onChange={(e) => setExistingConditions(e.target.value)}
                  placeholder={t.symptomChecker.existingConditionsPlaceholder}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t.symptomChecker.pregnancyLabel}
                </label>
                <select
                  value={pregnancyStatus}
                  onChange={(e) => setPregnancyStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="not_applicable">{t.symptomChecker.notApplicable}</option>
                  <option value="pregnant">{t.symptomChecker.pregnant}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="leading-relaxed">
                {t.symptomChecker.consentText}
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !consentAcknowledged || !mainSymptom.trim()}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>{t.symptomChecker.analyzingButton}</span>
              ) : (
                <>
                  <span>{t.symptomChecker.analyzeButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results View (Structured Result Cards A-E) */
        <div className="space-y-6">
          {/* Card A: Patient Symptom Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">
                  {t.symptomChecker.results.summaryCardTitle}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Assessment ID: <strong className="font-mono">{result.id}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">Primary Symptom:</span>
                <span className="font-semibold text-slate-900">{result.mainSymptom}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration:</span>
                <span className="font-semibold text-slate-900 capitalize">{result.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reported Severity:</span>
                <span className="font-semibold text-slate-900 capitalize">{result.severity}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Clinical Urgency:</span>
                <span className={`font-bold uppercase ${
                  result.urgency === 'emergency'
                    ? 'text-rose-600'
                    : result.urgency === 'urgent'
                    ? 'text-amber-600'
                    : 'text-teal-700'
                }`}>
                  {result.urgency}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed border border-slate-100">
              <p className="font-semibold text-slate-900 mb-1">Clinical Narrative Summary:</p>
              <p>{result.symptomSummary}</p>
            </div>
          </div>

          {/* Card B: General Health Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <h3 className="text-base font-bold text-slate-900">
                {t.symptomChecker.results.generalInfoTitle}
              </h3>
            </div>

            {/* Possible Considerations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.symptomChecker.results.possibleCauses}:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.possibleCauses?.map((cause, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* General Guidance */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evidence-Informed Pointers:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result.generalInformation?.map((info, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.followUpQuestion && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-900">
                <strong>Clinician Follow-Up Question:</strong> {result.followUpQuestion}
              </div>
            )}
          </div>

          {/* Card C: Recommended Next Step */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertCircle className="w-4 h-4 text-teal-700" />
              <h3 className="text-base font-bold text-slate-900">
                {t.symptomChecker.results.nextStepTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {result.recommendedNextStep}
            </p>
          </div>

          {/* Card D: Doctor Consultation Action */}
          <div className="bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl border border-teal-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Ready for professional clinical evaluation?
              </h4>
              <p className="text-xs text-slate-600">
                Attach this assessment summary so the doctor has your details ready before the call.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleShareWithDoctorClick}
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.symptomChecker.results.doctorCta}</span>
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.symptomChecker.results.newAssessment}</span>
              </button>
            </div>
          </div>

          {/* Card E: Mandatory Medical Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700 block mb-1">Clinical Assessment Disclaimer:</strong>
            {result.disclaimer || t.disclaimer.text}
          </div>
        </div>
      )}
    </div>
  );
};
