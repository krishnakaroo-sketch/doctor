import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  AlertTriangle,
  Stethoscope,
  Globe,
  Trash2,
  PhoneCall,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../services/api';
import { evaluateEmergencyTriage } from '../services/safetyTriage';
import { ChatMessage, Language } from '../types';

interface MedicalChatPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const MedicalChatPage: React.FC<MedicalChatPageProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting =
    language === 'hi'
      ? 'नमस्ते! मैं आपका स्वास्थ्य सूचना सहायक हूँ। आप कैसा महसूस कर रहे हैं? कृपया अपने लक्षण बताएं।'
      : language === 'mr'
      ? 'नमस्कार! मी आपला आरोग्य सहाय्यक आहे. आपल्याला काय त्रास होत आहे? कृपया सांगा.'
      : 'Hello! I am your Health Information Assistant on Online Doctor Care. How can I help you today? Feel free to describe any symptoms you are experiencing.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: true,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState<{
    triggered: boolean;
    instructions: string[];
  } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // 1. Immediate deterministic emergency triage check
    const triage = evaluateEmergencyTriage(userText, language);
    if (triage.isEmergency) {
      setIsLoading(false);
      setEmergencyAlert({
        triggered: true,
        instructions: triage.emergencyInstructions,
      });

      const alertMsg: ChatMessage = {
        id: `msg-alert-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'hi'
            ? '⚠️ आपातकालीन सूचना: आपके लक्षण किसी गंभीर स्थिति के संकेत हो सकते हैं। कृपया चैटबॉट पर निर्भर न रहें और तुरंत राष्ट्रीय आपातकालीन सेवा 112 या एम्बुलेंस 108 पर संपर्क करें।'
            : language === 'mr'
            ? '⚠️ तातडीची सूचना: आपण नमूद केलेली लक्षणे गंभीर वैद्यकीय आणीबाणी दर्शवू शकतात. कृपया लगेच राष्ट्रीय आपत्कालीन क्रमांक 112 किंवा रुग्णवाहिका 108 वर संपर्क साधा.'
            : '⚠️ MEDICAL EMERGENCY ALERT: The symptoms you described may indicate a life-threatening medical emergency. Dial India National Emergency (112) or Ambulance (108) immediately. Do not rely on an online chat.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: true,
        emergencyAlert: true,
        needsDoctorHandoff: true,
      };

      setMessages((prev) => [...prev, alertMsg]);
      return;
    }

    // 2. Call server API
    try {
      const historyContext = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendChatMessage(userText, historyContext, language);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: true,
        emergencyAlert: res.isEmergency,
        needsDoctorHandoff: res.needsDoctorHandoff,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (res.isEmergency) {
        setEmergencyAlert({
          triggered: true,
          instructions: ['Urgent hospital care recommended.'],
        });
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, but I encountered an issue. Please try again or connect directly with our human doctors.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: true,
      },
    ]);
    setShowClearConfirm(false);
    setEmergencyAlert(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-t-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              AI Health Information Assistant
            </h1>
            <p className="text-[11px] text-slate-500">
              Evidence-Informed Guidance · Multilingual Support (EN / HI / MR)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* In-chat language switch (keeps session intact) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['en', 'hi', 'mr'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2 py-0.5 rounded font-medium uppercase ${
                  language === l ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('doctors')}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-semibold rounded-md transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Connect to Doctor</span>
          </button>
        </div>
      </div>

      {/* Emergency banner in chat if active */}
      {emergencyAlert && emergencyAlert.triggered && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-200 shrink-0" />
            <span>Emergency warning detected. Call 112 immediately.</span>
          </div>
          <a
            href="tel:112"
            className="bg-white text-rose-900 font-bold px-2 py-0.5 rounded text-[11px] shrink-0"
          >
            Call 112
          </a>
        </div>
      )}

      {/* Message scroll container */}
      <div className="flex-1 overflow-y-auto bg-slate-50 border-x border-slate-200 p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : msg.emergencyAlert
                    ? 'bg-rose-50 border-2 border-rose-500 text-rose-950 rounded-tl-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-teal-700">Health Assistant</span>
                    <span>Informational Guidance Only</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Hand-off callout to Human Doctor */}
                {msg.needsDoctorHandoff && !isUser && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Would you like to consult a registered doctor?
                    </span>
                    <button
                      onClick={() => onNavigate('doctors')}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold rounded transition-colors inline-flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Book Doctor (₹499+)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Message metadata & actions */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <>
                    <span>·</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-600 transition-colors flex items-center gap-0.5"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-teal-600" />
                          <span className="text-teal-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setFeedback({ ...feedback, [msg.id]: 'up' })}
                      className={`hover:text-teal-700 ${feedback[msg.id] === 'up' ? 'text-teal-600' : ''}`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setFeedback({ ...feedback, [msg.id]: 'down' })}
                      className={`hover:text-rose-700 ${feedback[msg.id] === 'down' ? 'text-rose-600' : ''}`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span>Evaluating clinical context...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white border border-slate-200 rounded-b-xl p-3 shadow-xs">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={
              language === 'hi'
                ? 'अपने लक्षण बताएं (उदा. मुझे कल से खांसी है)...'
                : language === 'mr'
                ? 'तुमचा त्रास लिहा (उदा. मला कालपासून खोकला आहे)...'
                : 'Describe your symptoms or ask a medical question...'
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          This AI assistant does not diagnose, prescribe, or provide emergency care. In an emergency, dial 112.
        </p>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-lg border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Clear Conversation?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to clear this message history? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded"
              >
                Clear Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
