import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DoctorProfile,
  Appointment,
  SymptomAssessment,
  ClinicalNote,
  AuditLog,
  ClinicConfig,
} from '../types';

interface ClinicContextType {
  doctors: DoctorProfile[];
  appointments: Appointment[];
  assessments: SymptomAssessment[];
  clinicalNotes: ClinicalNote[];
  auditLogs: AuditLog[];
  config: ClinicConfig;
  bookAppointment: (params: {
    patientId: string;
    patientName: string;
    patientEmail: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    consultationType: 'text' | 'video' | 'in_clinic';
    symptomSummary?: string;
    symptomAssessmentId?: string;
  }) => { success: boolean; appointment?: Appointment; error?: string };
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  saveClinicalNote: (note: Omit<ClinicalNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  saveAssessment: (assessment: Omit<SymptomAssessment, 'id' | 'timestamp'>) => SymptomAssessment;
  updateDoctorVerification: (doctorId: string, verified: boolean) => void;
  updateDoctorFee: (doctorId: string, fee: number) => void;
  updateClinicConfig: (newConfig: Partial<ClinicConfig>) => void;
  getDoctorById: (id: string) => DoctorProfile | undefined;
  getAppointmentById: (id: string) => Appointment | undefined;
}

const INITIAL_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-201',
    userId: 'doc-201',
    name: 'Dr. Priya Kulkarni',
    title: 'Senior Consultant Physician & Diabetologist',
    qualifications: 'MBBS, MD (General Medicine) - KEM Hospital Mumbai',
    registrationCouncil: 'Maharashtra Medical Council (MMC)',
    registrationNumber: 'MMC/2012/04/1820',
    specialty: 'General Medicine & Family Health',
    specialtySlug: 'general',
    experienceYears: 14,
    languages: ['English', 'Marathi', 'Hindi'],
    consultationFee: 499,
    rating: 4.9,
    reviewCount: 312,
    verified: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableTimeSlots: ['10:00 AM - 10:30 AM', '11:00 AM - 11:30 AM', '02:00 PM - 02:30 PM', '04:00 PM - 04:30 PM', '06:00 PM - 06:30 PM'],
    about: 'Experienced clinical physician specializing in preventive cardiology, infectious fevers, hypertension management, and lifestyle metabolic health.',
    hospitalAffiliation: 'Jupiter Hospital & Global Clinical Network, Pune',
  },
  {
    id: 'doc-202',
    userId: 'doc-202',
    name: 'Dr. Rajesh Deshmukh',
    title: 'Consultant Pediatrician & Neonatologist',
    qualifications: 'MBBS, DCH, DNB (Pediatrics) - Grant Medical College',
    registrationCouncil: 'Maharashtra Medical Council (MMC)',
    registrationNumber: 'MMC/2015/09/3142',
    specialty: 'Pediatrics & Child Health',
    specialtySlug: 'pediatrics',
    experienceYears: 11,
    languages: ['English', 'Marathi', 'Hindi'],
    consultationFee: 599,
    rating: 4.95,
    reviewCount: 245,
    verified: true,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeSlots: ['11:30 AM - 12:00 PM', '03:00 PM - 03:30 PM', '05:00 PM - 05:30 PM'],
    about: 'Dedicated pediatrician focusing on acute pediatric infections, growth milestones, immunization guidance, and childhood respiratory allergies.',
    hospitalAffiliation: 'Surya Children\'s Hospital, Mumbai',
  },
  {
    id: 'doc-203',
    userId: 'doc-203',
    name: 'Dr. Ananya Sen',
    title: 'Consultant Dermatologist & Trichologist',
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    registrationCouncil: 'Delhi Medical Council (DMC)',
    registrationNumber: 'DMC/2016/11/4901',
    specialty: 'Dermatology & Skin Care',
    specialtySlug: 'dermatology',
    experienceYears: 9,
    languages: ['English', 'Hindi'],
    consultationFee: 650,
    rating: 4.88,
    reviewCount: 189,
    verified: true,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    availableTimeSlots: ['10:30 AM - 11:00 AM', '02:30 PM - 03:00 PM', '04:30 PM - 05:00 PM'],
    about: 'Expert in clinical dermatology including eczema, psoriasis, inflammatory acne, allergic dermatoses, and hair loss evaluations.',
    hospitalAffiliation: 'Fortis Healthcare, New Delhi',
  },
  {
    id: 'doc-204',
    userId: 'doc-204',
    name: 'Dr. Vikramaditya Rao',
    title: 'Consultant Interventional Cardiologist',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology) - AIIMS New Delhi',
    registrationCouncil: 'Karnataka Medical Council (KMC)',
    registrationNumber: 'KMC/2010/02/0987',
    specialty: 'Cardiology & Heart Health',
    specialtySlug: 'cardiology',
    experienceYears: 16,
    languages: ['English', 'Hindi', 'Kannada'],
    consultationFee: 850,
    rating: 4.92,
    reviewCount: 410,
    verified: true,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['04:00 PM - 04:30 PM', '05:00 PM - 05:30 PM', '06:00 PM - 06:30 PM'],
    about: 'Specialist in ischemic heart disease prevention, post-angioplasty care, cardiac rhythm assessment, and hypertensive crisis triage.',
    hospitalAffiliation: 'Manipal Hospitals, Bengaluru',
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-501',
    patientId: 'pat-101',
    patientName: 'Aarav Sharma',
    patientEmail: 'aarav.sharma@example.in',
    doctorId: 'doc-201',
    doctorName: 'Dr. Priya Kulkarni',
    doctorSpecialty: 'General Medicine & Family Health',
    date: '2026-10-12',
    timeSlot: '11:00 AM - 11:30 AM',
    status: 'confirmed',
    consultationType: 'text',
    symptomSummary: 'Mild cough and intermittent fever for 2 days; throat irritation.',
    consultationFee: 499,
    paymentStatus: 'completed',
    createdAt: '2026-10-09T03:00:00.000Z',
  },
  {
    id: 'apt-502',
    patientId: 'pat-101',
    patientName: 'Aarav Sharma',
    patientEmail: 'aarav.sharma@example.in',
    doctorId: 'doc-203',
    doctorName: 'Dr. Ananya Sen',
    doctorSpecialty: 'Dermatology & Skin Care',
    date: '2026-09-28',
    timeSlot: '02:30 PM - 03:00 PM',
    status: 'completed',
    consultationType: 'text',
    symptomSummary: 'Mild rash on forearm with itching after contact with plant.',
    consultationFee: 650,
    paymentStatus: 'completed',
    createdAt: '2026-09-27T08:00:00.000Z',
  },
];

const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'note-701',
    appointmentId: 'apt-502',
    patientId: 'pat-101',
    doctorId: 'doc-203',
    doctorName: 'Dr. Ananya Sen',
    doctorRegistration: 'DMC/2016/11/4901',
    subjectiveSymptoms: 'Patient reported localized pruritic erythematous macules over right volar forearm for 3 days following gardening exposure.',
    clinicalObservations: 'No signs of secondary infection or systemic anaphylaxis. Lesions are well-demarcated contact dermatitis presentation.',
    provisionalDiagnosis: 'Mild Allergic Contact Dermatitis (ICD-10 L23.9)',
    carePlanInstructions: 'Keep area clean with cool compresses. Avoid scrubbing or scented soaps. Apply soothing calamine lotion twice daily.',
    prescribedLifestyleAdvice: 'Wear protective garden gloves. Avoid scratching to prevent secondary bacterial infection.',
    followUpAdvice: 'Follow up if redness spreads, develops warmth, or does not improve within 5 days.',
    referralRequired: false,
    createdAt: '2026-09-28T03:45:00.000Z',
    updatedAt: '2026-09-28T03:45:00.000Z',
  },
];

const DEFAULT_CONFIG: ClinicConfig = {
  clinicName: 'Online Doctor Care',
  tagline: 'Your Health, Your Care, Your Doctor.',
  emergencyPhone: '112',
  ambulancePhone: '108',
  nationalHealthHelpline: '1075',
  supportEmail: 'support@onlinedoctorcare.in',
  supportPhone: '+91 1800 200 4455',
  telemedicineGuidelinesRef: 'Telemedicine Practice Guidelines, Board of Governors in Supersession of MCI, 2020',
  defaultConsultationFee: 499,
  currencySymbol: '₹',
  activeLanguages: ['en', 'hi', 'mr'],
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(() => {
    const saved = localStorage.getItem('odc_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('odc_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [assessments, setAssessments] = useState<SymptomAssessment[]>(() => {
    const saved = localStorage.getItem('odc_assessments');
    return saved ? JSON.parse(saved) : [];
  });

  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(() => {
    const saved = localStorage.getItem('odc_clinical_notes');
    return saved ? JSON.parse(saved) : INITIAL_CLINICAL_NOTES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('odc_audit_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        actorId: 'adm-001',
        actorName: 'Clinical Admin',
        actorRole: 'admin',
        action: 'DOCTOR_VERIFIED',
        resourceType: 'DoctorProfile',
        resourceId: 'doc-201',
        timestamp: '2026-01-01T10:00:00.000Z',
        status: 'success',
      },
    ];
  });

  const [config, setConfig] = useState<ClinicConfig>(() => {
    const saved = localStorage.getItem('odc_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('odc_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('odc_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('odc_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('odc_clinical_notes', JSON.stringify(clinicalNotes));
  }, [clinicalNotes]);

  useEffect(() => {
    localStorage.setItem('odc_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('odc_config', JSON.stringify(config));
  }, [config]);

  const addAuditLog = (action: string, resourceType: string, resourceId: string, status: 'success' | 'warning' | 'denied' = 'success') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: 'system',
      actorName: 'System / User Action',
      actorRole: 'patient',
      action,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const bookAppointment = (params: {
    patientId: string;
    patientName: string;
    patientEmail: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    consultationType: 'text' | 'video' | 'in_clinic';
    symptomSummary?: string;
    symptomAssessmentId?: string;
  }) => {
    // 1. Double-booking prevention algorithm (Section 9: "Do not allow two confirmed appointments to occupy the same doctor time slot")
    const hasConflict = appointments.some(
      (apt) =>
        apt.doctorId === params.doctorId &&
        apt.date === params.date &&
        apt.timeSlot === params.timeSlot &&
        (apt.status === 'confirmed' || apt.status === 'in_progress' || apt.status === 'requested')
    );

    if (hasConflict) {
      addAuditLog('BOOKING_REJECTED_SLOT_COLLISION', 'Appointment', params.doctorId, 'warning');
      return {
        success: false,
        error: 'This doctor time slot is already reserved. Please choose another convenient time slot.',
      };
    }

    const doctor = doctors.find((d) => d.id === params.doctorId);
    if (!doctor) {
      return { success: false, error: 'Selected doctor could not be located.' };
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-5)}`,
      patientId: params.patientId,
      patientName: params.patientName,
      patientEmail: params.patientEmail,
      doctorId: params.doctorId,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date: params.date,
      timeSlot: params.timeSlot,
      status: 'confirmed',
      consultationType: params.consultationType,
      symptomSummary: params.symptomSummary,
      symptomAssessmentId: params.symptomAssessmentId,
      consultationFee: doctor.consultationFee,
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    addAuditLog('APPOINTMENT_CONFIRMED', 'Appointment', newAppointment.id, 'success');
    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
    addAuditLog(`APPOINTMENT_${status.toUpperCase()}`, 'Appointment', appointmentId, 'success');
  };

  const saveClinicalNote = (noteData: Omit<ClinicalNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: ClinicalNote = {
      ...noteData,
      id: `note-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClinicalNotes((prev) => [newNote, ...prev]);
    // Also mark appointment as completed if not already
    updateAppointmentStatus(noteData.appointmentId, 'completed');
    addAuditLog('CLINICAL_NOTE_AUTHORED', 'ClinicalNote', newNote.id, 'success');
  };

  const saveAssessment = (assessmentData: Omit<SymptomAssessment, 'id' | 'timestamp'>): SymptomAssessment => {
    const newAssessment: SymptomAssessment = {
      ...assessmentData,
      id: `asm-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
    };
    setAssessments((prev) => [newAssessment, ...prev]);
    addAuditLog('SYMPTOM_ASSESSMENT_COMPLETED', 'SymptomAssessment', newAssessment.id, 'success');
    return newAssessment;
  };

  const updateDoctorVerification = (doctorId: string, verified: boolean) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, verified } : doc))
    );
    addAuditLog(verified ? 'DOCTOR_VERIFIED' : 'DOCTOR_UNVERIFIED', 'DoctorProfile', doctorId, 'success');
  };

  const updateDoctorFee = (doctorId: string, fee: number) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, consultationFee: fee } : doc))
    );
  };

  const updateClinicConfig = (newConfig: Partial<ClinicConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    addAuditLog('CLINIC_CONFIG_UPDATED', 'ClinicConfig', 'global', 'success');
  };

  const getDoctorById = (id: string) => doctors.find((d) => d.id === id);
  const getAppointmentById = (id: string) => appointments.find((a) => a.id === id);

  return (
    <ClinicContext.Provider
      value={{
        doctors,
        appointments,
        assessments,
        clinicalNotes,
        auditLogs,
        config,
        bookAppointment,
        updateAppointmentStatus,
        saveClinicalNote,
        saveAssessment,
        updateDoctorVerification,
        updateDoctorFee,
        updateClinicConfig,
        getDoctorById,
        getAppointmentById,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
