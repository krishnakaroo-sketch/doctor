import { Language } from '../types';

export interface EmergencyCheckResult {
  isEmergency: boolean;
  triggerCategory?: string;
  triggerKeywords?: string[];
  emergencyTitle: string;
  emergencyInstructions: string[];
  helplineNumbers: {
    nationalEmergency: string;
    ambulance: string;
    healthHelpline: string;
  };
}

// Emergency warning sign definitions based on Indian healthcare & WHO triage protocols
const EMERGENCY_CATEGORIES = [
  {
    category: 'respiratory_distress',
    keywords: [
      'can\'t breathe', 'cannot breathe', 'severe difficulty breathing', 'struggling to breathe',
      'gasping for air', 'turning blue', 'choking', 'suffocation',
      'सांस नहीं आ रही', 'सांस लेने में बहुत तकलीफ', 'दम घुट रहा',
      'श्वास घेता येत नाही', 'दम भरून येतोय', 'श्वास गुदमरतोय'
    ],
  },
  {
    category: 'cardiac_chest_pain',
    keywords: [
      'severe chest pain', 'crushing chest pressure', 'pain radiating to left arm',
      'heart attack', 'chest tightness sweating', 'jaw pain chest',
      'सीने में तेज दर्द', 'छाती में भारीपन', 'दिल का दौरा',
      'छातीत तीव्र वेदना', 'हार्ट अटॅक', 'छातीवर वजन'
    ],
  },
  {
    category: 'stroke_neurological',
    keywords: [
      'face drooping', 'facial drooping', 'sudden weakness in arm', 'slurred speech',
      'loss of speech', 'sudden paralysis', 'stroke', 'difficulty speaking suddenly',
      'मुंह टेढ़ा', 'हाथ पैर में कमजोरी', 'बोलने में असमर्थ', 'लकवा',
      'तोंड वाकडे होणे', 'एका बाजूला पक्षाघात', 'अचानक बोलणे बंद'
    ],
  },
  {
    category: 'consciousness_altered',
    keywords: [
      'unconscious', 'fainted and not waking', 'loss of consciousness', 'unresponsive',
      'severe confusion', 'seizure', 'continuous convulsions',
      'बेहोश', 'होश खो दिया', 'दौरा पड़ा', 'मिर्गी का दौरा',
      'बेशुद्ध', 'शुद्ध हरपणे', 'फिट आली', 'झटके येणे'
    ],
  },
  {
    category: 'severe_hemorrhage',
    keywords: [
      'uncontrolled bleeding', 'profuse bleeding', 'coughing large blood', 'vomiting blood',
      'खून बह रहा है', 'खून की उल्टी', 'रक्तस्त्राव बंद नहीं हो रहा',
      'रक्तस्त्राव थांबत नाही', 'रक्ताची उलटी', 'तीव्र रक्तस्त्राव'
    ],
  },
  {
    category: 'anaphylaxis_allergy',
    keywords: [
      'throat swelling', 'cannot swallow air', 'severe allergic reaction', 'anaphylaxis',
      'गला सूज गया', 'गंभीर एलर्जी', 'घसा सुजला', 'तीव्र ॲलर्जी'
    ],
  },
  {
    category: 'poisoning_overdose',
    keywords: [
      'swallowed poison', 'consumed pesticide', 'rat poison', 'snake bite', 'overdose',
      'जहर खा लिया', 'कीटनाशक', 'सांप ने काटा', 'सापाचा चावा', 'विषबाधा'
    ],
  },
];

export function evaluateEmergencyTriage(text: string, lang: Language = 'en'): EmergencyCheckResult {
  const normalized = text.toLowerCase();
  
  for (const cat of EMERGENCY_CATEGORIES) {
    const matched = cat.keywords.filter((kw) => normalized.includes(kw.toLowerCase()));
    if (matched.length > 0) {
      return {
        isEmergency: true,
        triggerCategory: cat.category,
        triggerKeywords: matched,
        emergencyTitle: getEmergencyTitle(lang),
        emergencyInstructions: getEmergencyInstructions(lang),
        helplineNumbers: {
          nationalEmergency: '112',
          ambulance: '108',
          healthHelpline: '1075',
        },
      };
    }
  }

  return {
    isEmergency: false,
    emergencyTitle: '',
    emergencyInstructions: [],
    helplineNumbers: {
      nationalEmergency: '112',
      ambulance: '108',
      healthHelpline: '1075',
    },
  };
}

function getEmergencyTitle(lang: Language): string {
  switch (lang) {
    case 'hi':
      return 'तत्काल आपातकालीन चेतावनी - तुरंत 112 पर कॉल करें';
    case 'mr':
      return 'तातडीची आपत्कालीन सूचना - लगेच 112 वर कॉल करा';
    default:
      return 'Immediate Medical Emergency Warning - Call 112 Now';
  }
}

function getEmergencyInstructions(lang: Language): string[] {
  switch (lang) {
    case 'hi':
      return [
        'आपके द्वारा बताए गए लक्षण किसी गंभीर चिकित्सीय आपात स्थिति के संकेत हो सकते हैं।',
        'इस चैटबॉट या ऑनलाइन मैसेज पर निर्भर न रहें। तुरंत राष्ट्रीय आपातकालीन नंबर 112 या एम्बुलेंस 108 पर कॉल करें।',
        'यदि संभव हो तो तुरंत नजदीकी अस्पताल के आपातकालीन विभाग (Emergency / Casualty) में जाएं।',
        'मरीज को अकेले न छोड़ें और सांस लेने में सहायता करें।',
      ];
    case 'mr':
      return [
        'आपण नमूद केलेली लक्षणे गंभीर वैद्यकीय आणीबाणी दर्शवू शकतात.',
        'या ऑनलाइन चॅटवर अवलंबून राहू नका. लगेच राष्ट्रीय आपत्कालीन क्रमांक 112 किंवा रुग्णवाहिका 108 वर संपर्क साधा.',
        'शक्य तितक्या लवकर जवळच्या रुग्णालयातील कॅज्युअल्टी (Emergency) कक्षात जा.',
        'रुग्णाला एकटे सोडू नका आणि श्वासोच्छवासावर लक्ष ठेवा.',
      ];
    default:
      return [
        'The symptoms you described may indicate a life-threatening medical emergency.',
        'Do not wait or rely on this online assistant. Dial India National Emergency (112) or Ambulance (108) immediately.',
        'Go directly to the nearest hospital casualty or emergency room (ER).',
        'Do not leave the patient alone; keep their airways clear while emergency help arrives.',
      ];
  }
}
