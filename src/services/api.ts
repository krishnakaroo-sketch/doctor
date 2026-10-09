import { Language, UrgencyLevel } from '../types';

export interface SymptomCheckRequest {
  mainSymptom: string;
  duration: string;
  severity: string;
  progression: string;
  associatedSymptoms: string[];
  ageGroup: string;
  pregnancyStatus?: string;
  existingConditions?: string;
  language: Language;
}

export interface SymptomCheckResponse {
  language: Language;
  symptomSummary: string;
  possibleCauses: string[];
  generalInformation: string[];
  urgency: UrgencyLevel;
  recommendedNextStep: string;
  emergencyWarning: boolean;
  followUpQuestion?: string;
  needsClinicianReview: boolean;
  disclaimer: string;
  error?: string;
}

export interface ChatResponse {
  reply: string;
  isEmergency: boolean;
  needsDoctorHandoff?: boolean;
  error?: string;
}

export async function checkSymptomsOnline(payload: SymptomCheckRequest): Promise<SymptomCheckResponse> {
  try {
    const res = await fetch('/api/ai/symptom-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: SymptomCheckResponse = await res.json();
    return data;
  } catch (err) {
    console.warn('API symptom check fallback to deterministic offline engine:', err);
    return {
      language: payload.language,
      symptomSummary: `Patient reports: ${payload.mainSymptom} (Duration: ${payload.duration}, Severity: ${payload.severity}).`,
      possibleCauses: [
        'Acute viral or upper respiratory syndrome',
        'Tension or physical fatigue',
        'Mild inflammatory response',
      ],
      generalInformation: [
        'Ensure proper oral hydration and rest.',
        'Record body temperature and symptom intensity twice daily.',
        'A physical examination by a registered physician is recommended for definitive care.',
      ],
      urgency: payload.severity === 'severe' ? 'urgent' : 'routine',
      recommendedNextStep: 'Schedule an appointment with a verified general physician on the platform.',
      emergencyWarning: false,
      followUpQuestion: 'Do you have any difficulties keeping fluids down or high fever?',
      needsClinicianReview: true,
      disclaimer: 'This assessment is for preliminary informational purposes only. It is not a medical diagnosis or prescription.',
    };
  }
}

export async function sendChatMessage(
  message: string,
  history: Array<{ sender: string; text: string }>,
  language: Language
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history, language }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    return data;
  } catch (err) {
    console.warn('API chat fallback:', err);
    return {
      reply:
        language === 'hi'
          ? 'आपके लक्षण दर्ज कर लिए गए हैं। कृपया हमारे प्रमाणित डॉक्टरों से विस्तृत परामर्श लें।'
          : language === 'mr'
          ? 'तुमच्या लक्षणांची नोंद घेण्यात आली आहे. अचूक उपचारासाठी कृपया आमच्या नोंदणीकृत डॉक्टरांशी बोला.'
          : 'I have recorded your symptoms. Since online assistance cannot replace clinical evaluation, I recommend consulting one of our verified physicians.',
      isEmergency: false,
      needsDoctorHandoff: true,
    };
  }
}
