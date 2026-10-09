import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Language, PatientProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  patientProfile: PatientProfile | null;
  isAuthenticated: boolean;
  loginAs: (role: Role) => void;
  loginWithCredentials: (email: string, role?: Role) => boolean;
  registerPatient: (details: {
    name: string;
    email: string;
    phone?: string;
    preferredLanguage: Language;
    isMinor?: boolean;
    guardianName?: string;
    state?: string;
    city?: string;
    emergencyContactPhone?: string;
  }) => void;
  logout: () => void;
  updateLanguagePreference: (lang: Language) => void;
  withdrawConsent: () => void;
  requestAccountDeletion: () => boolean;
}

const INITIAL_USERS: Record<Role, User> = {
  patient: {
    id: 'pat-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98201 12345',
    role: 'patient',
    preferredLanguage: 'en',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  doctor: {
    id: 'doc-201',
    name: 'Dr. Priya Kulkarni, MD',
    email: 'dr.priya.kulkarni@onlinedoctorcare.in',
    phone: '+91 98220 54321',
    role: 'doctor',
    preferredLanguage: 'mr',
    createdAt: '2025-11-20T08:30:00.000Z',
  },
  admin: {
    id: 'adm-001',
    name: 'Clinical Admin (Govt. Compliance)',
    email: 'compliance@onlinedoctorcare.in',
    role: 'admin',
    preferredLanguage: 'en',
    createdAt: '2025-10-01T00:00:00.000Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('odc_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS.patient;
      }
    }
    return INITIAL_USERS.patient; // Default logged in as patient for immediate testing & exploration
  });

  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(() => {
    const saved = localStorage.getItem('odc_patient_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      userId: 'pat-101',
      dateOfBirth: '1992-06-14',
      gender: 'male',
      state: 'Maharashtra',
      city: 'Pune',
      bloodGroup: 'B+',
      emergencyContactName: 'Sunita Sharma',
      emergencyContactPhone: '+91 98201 99999',
      existingConditions: ['Mild Asthma'],
      allergies: ['Penicillin'],
      currentMedications: ['Salbutamol inhaler as needed'],
      consentGiven: true,
      consentTimestamp: '2026-01-15T10:02:00.000Z',
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('odc_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('odc_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (patientProfile) {
      localStorage.setItem('odc_patient_profile', JSON.stringify(patientProfile));
    } else {
      localStorage.removeItem('odc_patient_profile');
    }
  }, [patientProfile]);

  const loginAs = (role: Role) => {
    const targetUser = INITIAL_USERS[role];
    setCurrentUser(targetUser);
  };

  const loginWithCredentials = (email: string, role: Role = 'patient'): boolean => {
    const normalized = email.toLowerCase().trim();
    if (normalized.includes('doctor') || normalized.includes('priya') || role === 'doctor') {
      setCurrentUser(INITIAL_USERS.doctor);
      return true;
    }
    if (normalized.includes('admin') || role === 'admin') {
      setCurrentUser(INITIAL_USERS.admin);
      return true;
    }
    
    // Default patient login
    const user: User = {
      id: `pat-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: normalized,
      role: 'patient',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return true;
  };

  const registerPatient = (details: {
    name: string;
    email: string;
    phone?: string;
    preferredLanguage: Language;
    isMinor?: boolean;
    guardianName?: string;
    state?: string;
    city?: string;
    emergencyContactPhone?: string;
  }) => {
    const newId = `pat-${Date.now().toString().slice(-4)}`;
    const newUser: User = {
      id: newId,
      name: details.name,
      email: details.email,
      phone: details.phone,
      role: 'patient',
      preferredLanguage: details.preferredLanguage,
      createdAt: new Date().toISOString(),
    };

    const newProfile: PatientProfile = {
      userId: newId,
      state: details.state || 'Maharashtra',
      city: details.city || 'Mumbai',
      emergencyContactName: details.guardianName || 'Family Member',
      emergencyContactPhone: details.emergencyContactPhone || '',
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setPatientProfile(newProfile);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateLanguagePreference = (lang: Language) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, preferredLanguage: lang });
    }
  };

  const withdrawConsent = () => {
    if (patientProfile) {
      setPatientProfile({
        ...patientProfile,
        consentGiven: false,
        consentTimestamp: new Date().toISOString(),
      });
    }
  };

  const requestAccountDeletion = () => {
    // DPDP Act 2023 compliant data deletion request
    logout();
    setPatientProfile(null);
    localStorage.removeItem('odc_user');
    localStorage.removeItem('odc_patient_profile');
    localStorage.removeItem('odc_symptom_assessments');
    localStorage.removeItem('odc_appointments');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        patientProfile,
        isAuthenticated: !!currentUser,
        loginAs,
        loginWithCredentials,
        registerPatient,
        logout,
        updateLanguagePreference,
        withdrawConsent,
        requestAccountDeletion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
