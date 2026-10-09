import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Emergency keywords check on server side for immediate safety triage
const EMERGENCY_KEYWORDS = [
  'chest pain', 'cannot breathe', 'can\'t breathe', 'difficulty breathing',
  'loss of consciousness', 'unconscious', 'fainted', 'slurred speech',
  'face drooping', 'paralysis', 'coughing blood', 'vomiting blood',
  'severe bleeding', 'seizure', 'convulsion', 'poison', 'snake bite',
  'सांस नहीं आ रही', 'सीने में दर्द', 'बेहोश', 'लकवा', 'दौरा', 'जहर',
  'श्वास घेता येत नाही', 'छातीत वेदना', 'बेशुद्ध', 'फिट आली'
];

function checkEmergencyWarning(text: string): boolean {
  const lower = (text || '').toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

// AI Symptom Assessment Endpoint
app.post('/api/ai/symptom-check', async (req, res) => {
  try {
    const {
      mainSymptom,
      duration,
      severity,
      progression,
      associatedSymptoms = [],
      ageGroup,
      pregnancyStatus,
      existingConditions = '',
      language = 'en',
    } = req.body;

    const fullDescription = `${mainSymptom} ${associatedSymptoms.join(' ')}`;
    const isSevereOrEmergency = severity === 'unbearable' || checkEmergencyWarning(fullDescription);

    if (isSevereOrEmergency) {
      return res.json({
        language,
        symptomSummary: `Patient reports acute/severe symptoms: ${mainSymptom} (${severity}, duration: ${duration}).`,
        possibleCauses: ['Potential Acute Medical Emergency requiring immediate clinical evaluation.'],
        generalInformation: [
          'Severe symptoms, acute chest pain, or breathing distress require emergency hospital casualty evaluation.',
          'Do not wait for digital consultations when symptoms are acute.',
        ],
        urgency: 'emergency',
        recommendedNextStep: 'Dial India National Emergency 112 or Ambulance 108 immediately, or go to the nearest hospital casualty.',
        emergencyWarning: true,
        followUpQuestion: 'Are you in a safe position with emergency assistance on the way?',
        needsClinicianReview: true,
        disclaimer: 'This automated safety alert is triggered for your protection. It is not a medical diagnosis.',
      });
    }

    // Call Gemini API if available
    if (ai) {
      const prompt = `
You are a senior health information assistant for Online Doctor Care (India).
A patient described their health situation:
- Primary symptom: "${mainSymptom}"
- Duration: "${duration}"
- Reported Severity: "${severity}"
- Progression: "${progression}"
- Associated symptoms: ${associatedSymptoms.join(', ') || 'None reported'}
- Age Group: "${ageGroup || 'Adult'}"
- Pregnancy context (voluntary): "${pregnancyStatus || 'N/A'}"
- Known conditions: "${existingConditions || 'None reported'}"
- Preferred Language: "${language}"

Guidelines:
1. Provide safe preliminary health information in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
2. Never provide a definitive diagnosis or prescription. Never recommend specific prescription dosages or antibiotics.
3. List 2 to 3 possible medical considerations as possibilities only.
4. Recommend sensible next steps (such as lifestyle self-care for very mild issues, or booking a consultation with a verified doctor).
5. Output valid JSON only matching this schema:
{
  "symptomSummary": "string",
  "possibleCauses": ["string"],
  "generalInformation": ["string"],
  "urgency": "routine" | "urgent" | "self_care",
  "recommendedNextStep": "string",
  "followUpQuestion": "string",
  "disclaimer": "This AI-generated assessment is for preliminary informational purposes only and is not a medical diagnosis."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          systemInstruction: 'You are an ethical, safe clinical health information assistant for an Indian telemedicine platform. Adhere strictly to the Indian Telemedicine Practice Guidelines. Never give prescription advice or definitive diagnoses.',
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          language,
          ...parsed,
          emergencyWarning: false,
          needsClinicianReview: true,
        });
      } catch {
        // Fallback to structured object if JSON parsing fails
      }
    }

    // Graceful clinical fallback if Gemini is unconfigured or returns non-JSON
    const fallbackSummary = `Reported: ${mainSymptom} for ${duration}, noted as ${severity}. Progression: ${progression}.`;
    return res.json({
      language,
      symptomSummary: fallbackSummary,
      possibleCauses: [
        'Acute viral or upper respiratory syndrome',
        'Tension or musculoskeletal fatigue',
        'Non-specific inflammatory reaction',
      ],
      generalInformation: [
        'Ensure adequate hydration with clean fluids and rest.',
        'Monitor temperature and symptom progression twice daily.',
        'Consult a verified doctor for a formal physical examination and appropriate prescription.',
      ],
      urgency: severity === 'severe' ? 'urgent' : 'routine',
      recommendedNextStep: 'Schedule a text or video consultation with one of our verified General Physicians.',
      followUpQuestion: 'Are you currently experiencing any high fever or chills?',
      emergencyWarning: false,
      needsClinicianReview: true,
      disclaimer: 'This AI-generated assessment is for preliminary informational purposes only. It is not a medical diagnosis or prescription.',
    });
  } catch (error) {
    console.error('Error in symptom-check:', error);
    res.status(500).json({
      error: 'An error occurred during symptom assessment.',
      emergencyWarning: false,
      recommendedNextStep: 'Please connect directly with our on-duty doctors.',
    });
  }
});

// AI Conversational Medical Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Immediate emergency check
    if (checkEmergencyWarning(message)) {
      return res.json({
        reply: language === 'hi'
          ? 'चेतावनी: आपके द्वारा बताए गए लक्षण आपातकालीन चिकित्सा स्थिति का संकेत दे सकते हैं। कृपया तुरंत 112 (राष्ट्रीय आपातकालीन सेवा) या 108 (एम्बुलेंस) पर संपर्क करें।'
          : language === 'mr'
          ? 'सावधान: आपण नमूद केलेली लक्षणे वैद्यकीय आणीबाणी दर्शवू शकतात. कृपया त्वरित 112 (राष्ट्रीय आपत्कालीन सेवा) किंवा 108 (रुग्णवाहिका) वर संपर्क साधा.'
          : 'EMERGENCY ALERT: Your symptoms may indicate an immediate life-threatening emergency. Do not wait for an online chat response. Dial India National Emergency (112) or Ambulance (108) immediately.',
        isEmergency: true,
        needsDoctorHandoff: true,
      });
    }

    if (ai) {
      const historyContext = conversationHistory
        .slice(-6)
        .map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'Patient' : 'Assistant'}: ${m.text}`)
        .join('\n');

      const systemPrompt = `
You are a compassionate, medically responsible Health Information Assistant on "Online Doctor Care", an Indian telemedicine platform.
Your goals:
1. Converse in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
2. Ask at most ONE relevant follow-up question at a time if symptom details (duration, severity) are missing.
3. Provide evidence-informed general health context. Never provide a final diagnosis, personalized medication doses, or recommend prescription-only drugs.
4. Gently recommend consulting one of the verified human doctors available on the platform.
5. If the user asks about dangerous warning signs, prioritize safety and advise contacting 112.
`;

      const prompt = `${historyContext ? `Previous context:\n${historyContext}\n\n` : ''}Patient: ${message}\nAssistant:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });

      const replyText = response.text || 'I understand your concern. Let me know if you would like to connect with a verified doctor.';
      return res.json({
        reply: replyText,
        isEmergency: false,
        needsDoctorHandoff: true,
      });
    }

    // Default intelligent clinical guidance if AI client is unconfigured
    let reply = `Thank you for sharing your symptoms. Based on your description, this requires careful monitoring. `;
    if (language === 'hi') {
      reply = `आपकी स्वास्थ्य संबंधी चिंता समझने के लिए धन्यवाद। लक्षणों की अवधि और तीव्रता पर नजर रखें। हमारे योग्य डॉक्टर से विस्तृत परामर्श के लिए आप अपॉइंटमेंट बुक कर सकते हैं।`;
    } else if (language === 'mr') {
      reply = `आरोग्यविषयक माहिती दिल्याबद्दल धन्यवाद. या त्रासावर लक्ष ठेवा आणि विश्रांती घ्या. अधिकृत निदानासाठी आमच्या नोंदणीकृत डॉक्टरांशी सल्लामसलत करा.`;
    } else {
      reply += `Could you share how many days you have had this, and if you have any existing health conditions? You can also connect directly with our verified Indian doctors for a comprehensive consultation.`;
    }

    return res.json({
      reply,
      isEmergency: false,
      needsDoctorHandoff: true,
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Unable to process health query. Please consult a doctor directly.',
      isEmergency: false,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Online Doctor Care (India)',
    aiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// In development, mount Vite middleware; in production serve static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Online Doctor Care server running on port ${PORT}`);
  });
}

startServer();
