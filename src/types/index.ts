export type Role = 'patient' | 'doctor' | 'admin';

export type Language = 'en' | 'hi' | 'mr';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  preferredLanguage: Language;
  avatarUrl?: string;
  createdAt: string;
}

export interface PatientProfile {
  userId: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  state?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  existingConditions?: string[];
  allergies?: string[];
  currentMedications?: string[];
  consentGiven: boolean;
  consentTimestamp: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  title: string; // e.g. "Senior Consultant Physician"
  qualifications: string; // e.g. "MBBS, MD (General Medicine)"
  registrationCouncil: string; // e.g. "Maharashtra Medical Council (MMC)"
  registrationNumber: string; // e.g. "MMC/2012/04/1820"
  specialty: string;
  specialtySlug: 'general' | 'pediatrics' | 'dermatology' | 'cardiology' | 'gynecology' | 'orthopedics';
  experienceYears: number;
  languages: string[];
  consultationFee: number; // in INR
  rating: number;
  reviewCount: number;
  verified: boolean;
  availableDays: string[];
  availableTimeSlots: string[]; // e.g. ["10:00 AM", "11:00 AM"]
  about: string;
  hospitalAffiliation: string;
}

export type AppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type ConsultationType = 'text' | 'video' | 'in_clinic';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 10:30 AM"
  status: AppointmentStatus;
  consultationType: ConsultationType;
  symptomSummary?: string;
  symptomAssessmentId?: string;
  consultationFee: number;
  paymentStatus: 'pending' | 'completed' | 'exempted';
  notes?: string;
  createdAt: string;
  cancelledReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'doctor';
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
  emergencyAlert?: boolean;
  needsDoctorHandoff?: boolean;
}

export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'self_care';

export interface SymptomAssessment {
  id: string;
  patientId?: string;
  mainSymptom: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe' | 'unbearable';
  progression: 'improving' | 'worsening' | 'unchanged';
  associatedSymptoms: string[];
  ageGroup: string;
  isEmergency: boolean;
  urgency: UrgencyLevel;
  symptomSummary: string;
  possibleCauses: string[];
  generalInformation: string[];
  recommendedNextStep: string;
  followUpQuestion?: string;
  disclaimer: string;
  timestamp: string;
  language: Language;
}

export interface ClinicalNote {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorRegistration: string;
  subjectiveSymptoms: string;
  clinicalObservations: string;
  provisionalDiagnosis: string;
  carePlanInstructions: string;
  prescribedLifestyleAdvice: string;
  followUpAdvice: string;
  referralRequired?: boolean;
  referralDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  status: 'success' | 'warning' | 'denied';
}

export interface ClinicConfig {
  clinicName: string;
  tagline: string;
  emergencyPhone: string;
  ambulancePhone: string;
  nationalHealthHelpline: string;
  supportEmail: string;
  supportPhone: string;
  telemedicineGuidelinesRef: string;
  defaultConsultationFee: number;
  currencySymbol: string;
  activeLanguages: Language[];
}
