import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  ShieldCheck,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  Phone,
  Truck,
  Heart,
  Scale,
  Activity,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: Array<{ label: string; query: string }>;
}

interface LifeRouteAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveTracker?: () => void;
  onOpenConsent?: () => void;
  onOpenQR?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'assistant',
    text: `Namaste! I am LifeRoute AI, your clinical organ donation and emergency green corridor assistant for Visakhapatnam, Andhra Pradesh.\n\nI can assist you with active green corridor transit updates (KGH to Apollo Health City), THOTA 1994 legal protocols, AP Jeevandan registry guidelines, or emergency responder dispatch coordination. How may I help you today?`,
    timestamp: 'Just now',
    quickActions: [
      { label: 'Check Convoy 9042 Status', query: 'What is the live status of Convoy 9042?' },
      { label: 'Brain-Death Certification Steps', query: 'How does brain-death certification work under THOTA?' },
      { label: 'Vizag Emergency Helplines', query: 'Show Visakhapatnam emergency organ dispatch helplines' },
      { label: 'Organ Consent & Family Rules', query: 'What are the next-of-kin rules for organ donation?' },
    ],
  },
];

export const LifeRouteAssistantModal: React.FC<LifeRouteAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenLiveTracker,
  onOpenConsent,
  onOpenQR,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Contextual fallback response generator for offline and rapid testing
  const generateContextualResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('convoy') || q.includes('9042') || q.includes('status') || q.includes('transit')) {
      return `🚑 **Live Telemetry: Convoy 9042 (Kidney Graft)**\n\n• **Status:** Active in Green Corridor\n• **Organ:** Donor Kidney (Right Renal Graft)\n• **Route:** King George Hospital (KGH), Maharanipeta → Apollo Hospitals, Health City, Arilova (14.2 km)\n• **Current Location:** Maddilapalem BRTS Corridor (Cruising at 68 km/h)\n• **Perfusion Pod:** LifeRoute Orbit-P sealed at **4.2°C**, 96% humidity, 88% battery\n• **ETA to Recipient OT:** **14 minutes**\n• **Police Coordination:** Visakhapatnam City Traffic Police with 12 traffic intersections preempted to green.`;
    }

    if (q.includes('brain-death') || q.includes('certification') || q.includes('death')) {
      return `🩺 **Brain-Death Certification Protocol (THOTA 1994 & Jeevandan AP)**\n\n1. **First Priority:** Hospital trauma physicians always fight 100% to save the donor's life. Organ donation is never considered while life-saving care is ongoing.\n2. **Mandatory 6-Hour Gap:** Brain-stem death must be certified by two independent clinical evaluations conducted at least 6 hours apart.\n3. **Panel of 4 Independent Physicians:**\n   • Medical Superintendent / Hospital In-Charge (KGH Vizag)\n   • Independent Physician (Unrelated to transplant surgery)\n   • Independent Neurologist / Neurosurgeon\n   • Treating ICU Physician\n4. **Strict Separation:** Transplant surgical teams are legally barred from participating in brain-death verification.`;
    }

    if (q.includes('consent') || q.includes('family') || q.includes('pledge') || q.includes('preference')) {
      return `📝 **Organ Consent & Next-of-Kin Guidelines (Andhra Pradesh)**\n\n• **Donor Registry:** Dr. Ananya Reddy is registered under **NOTTO & AP Jeevandan** (ID: #AP-JVD-892401-VZ) with 6 authorized organs/tissues.\n• **First-Person Consent:** Under the THOTA Act (amended 2011), your digital pledge is legally recognized.\n• **Next-of-Kin Role:** In clinical practice, Jeevandan coordinators at KGH consult listed primary next-of-kin (K. Suresh Varma). Having your family informed ensures immediate, compassionate confirmation without delays.\n• You can update your pledge choices anytime via the **Update Consent Preferences** module.`;
    }

    if (q.includes('helpline') || q.includes('contact') || q.includes('phone') || q.includes('emergency') || q.includes('police')) {
      return `📞 **Official Visakhapatnam & National Emergency Helplines**\n\n• **NOTTO National Organ Helpline (India):** 1800-11-4770 (24/7 Toll-Free)\n• **Emergency Medical Ambulance (EMS):** 108\n• **Vizag City Traffic Police (Green Corridor Control):** 0891-2565454\n• **King George Hospital (KGH) Casualty/ICU Desk:** +91 891 256 4891\n• **AP Jeevandan State Coordination Desk:** +91 891 275 4400\n• **Primary Next of Kin (K. Suresh Varma):** +91 98480 23489`;
    }

    if (q.includes('thota') || q.includes('act') || q.includes('law') || q.includes('jeevandan')) {
      return `⚖️ **Statutory Legal Framework: THOTA Act, 1994**\n\n• **Transplantation of Human Organs and Tissues Act (THOTA), 1994 (Govt. of India):** Establishes criminal penalties for commercial organ trading, defines irreversible brain-stem death, and regulates donor registries.\n• **AP Jeevandan Cadaver Registry:** Operates the centralized organ matching system in Andhra Pradesh. Organs are matched strictly by clinical score, HLA tissue compatibility, medical urgency, and geographic transit feasibility to prevent wastage.`;
    }

    if (q.includes('pod') || q.includes('temp') || q.includes('perfusion') || q.includes('cold')) {
      return `❄️ **LifeRoute Orbit-P Perfusion Pod Telemetry**\n\n• **Kidney Transit Window:** 24–36 hours (Target temp: 2°C – 6°C; Current: **4.2°C**)\n• **Heart Transit Window:** 4–6 hours (Helicopter air corridor active to VTZ Helipad)\n• **Cornea Transit Window:** Up to 14 days (L.V. Prasad Eye Institute Mohsin Eye Bank)\n• **Sensors:** Continuous Bluetooth/GSM telemetry monitors perfusion pressure (28 mmHg), internal temperature, and GPS coordinates live.`;
    }

    return `Thank you for your inquiry regarding LifeRoute's organ donation and emergency transit network in Visakhapatnam.\n\nDr. Ananya Reddy is registered as an active donor with the Andhra Pradesh Jeevandan Program and NOTTO (#AP-JVD-892401-VZ). Whether you need to review active green corridors along the KGH-to-Apollo Arilova route, adjust pledged organs, or verify emergency protocols under the THOTA Act, our coordination desk is available 24/7.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // 1. First attempt: Direct @google/genai client if API key is configured
      const apiKey = (import.meta as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY;
      if (apiKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `User query: "${query}". Context: Dr. Ananya Reddy is a registered donor in Visakhapatnam, Andhra Pradesh (#AP-JVD-892401-VZ). Transit corridor active: KGH Maharanipeta to Apollo Health City Arilova via BRTS corridor. Ground answers in THOTA Act 1994 and AP Jeevandan.`
                  }
                ]
              }
            ],
            config: {
              systemInstruction: `You are LifeRoute AI, an emergency organ donation and green corridor dispatch assistant localized for Visakhapatnam (Vizag), Andhra Pradesh, India.
Key nodes: King George Hospital (KGH) Maharanipeta, Apollo Hospitals Health City Arilova, SevenHills Hospital, L.V. Prasad Eye Institute.
Regulatory framework: THOTA Act 1994, AP Jeevandan Program, NOTTO.
Answer concisely with clinical precision, clear formatting, and empathy. Mention emergency helplines (108, 1800-11-4770, Vizag Traffic 0891-2565454) when relevant.`,
            }
          });

          if (response?.text) {
            const aiMsg: ChatMessage = {
              id: `ai_${Date.now()}`,
              sender: 'assistant',
              text: response.text,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
            return;
          }
        } catch {
          // Fall through to proxy or local matrix
        }
      }

      // 2. Second attempt: Connect to server proxy `/api/chat` (if available)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.reply && !data.fallback) {
          const aiMsg: ChatMessage = {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Ignore network errors and proceed to clinical fallback matrix
    }

    // 3. Fallback: Rapid, robust local clinical and telemetry response matrix
    setTimeout(() => {
      const fallbackText = generateContextualResponse(query);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[680px] max-h-[92vh]">
        {/* Header with bot identity, live status, and close */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex items-center justify-between border-b border-teal-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-teal-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight text-white leading-tight">
                  LifeRoute Assistant
                </h3>
                <span className="text-[10px] font-mono font-semibold text-teal-300 bg-teal-900/60 px-1.5 py-0.2 rounded border border-teal-700/50">
                  Vizag AI Node
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-teal-200/80">
                <span>NOTTO & AP Jeevandan Grounded</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300 font-medium">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips Bar */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            Quick:
          </span>
          <button
            onClick={() => handleSendMessage('What is the live status of Convoy 9042?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:border-teal-400 hover:text-teal-800 transition-colors whitespace-nowrap shadow-2xs active:scale-95"
          >
            Convoy 9042 Telemetry
          </button>
          <button
            onClick={() => handleSendMessage('How does brain-death certification work under THOTA?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:border-teal-400 hover:text-teal-800 transition-colors whitespace-nowrap shadow-2xs active:scale-95"
          >
            Brain-Death Rules (THOTA)
          </button>
          <button
            onClick={() => handleSendMessage('Show Visakhapatnam emergency organ dispatch helplines')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:border-teal-400 hover:text-teal-800 transition-colors whitespace-nowrap shadow-2xs active:scale-95"
          >
            Vizag Helplines
          </button>
          <button
            onClick={() => handleSendMessage('What are the next-of-kin rules for organ donation?')}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:border-teal-400 hover:text-teal-800 transition-colors whitespace-nowrap shadow-2xs active:scale-95"
          >
            Next-of-Kin Consent
          </button>
        </div>

        {/* Scrollable Chat Messages Feed */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group animate-in fade-in duration-200`}
              >
                {/* Role & Timestamp */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                  <span className="font-semibold text-slate-500">
                    {isUser ? 'Dr. Ananya Reddy' : 'LifeRoute AI'}
                  </span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative p-3.5 rounded-2xl text-xs max-w-[88%] sm:max-w-[82%] leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-teal-700 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/90'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Copy button for assistant responses */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-teal-700 font-medium">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        THOTA 1994 & AP Jeevandan Grounded
                      </span>
                      <button
                        onClick={() => copyText(msg.text, msg.id)}
                        className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Dynamic Quick Actions attached to message */}
                {msg.quickActions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action.query)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200/70 text-teal-900 font-semibold hover:bg-teal-100 transition-colors text-left"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-24 text-slate-400 shadow-2xs animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about organ pledges, green corridors, or THOTA rules..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-800 placeholder:text-slate-400 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:hover:bg-teal-700 text-white transition-all shadow-xs shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Powered by LifeRoute AI · Clinical & Dispatch Grounding</span>
            <span className="text-teal-700 font-mono">THOTA/AP-JVD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating Action Button (FAB) launcher component for the assistant
interface LifeRouteAssistantFABProps {
  onClick: () => void;
  isOpen: boolean;
}

export const LifeRouteAssistantFAB: React.FC<LifeRouteAssistantFABProps> = ({
  onClick,
  isOpen,
}) => {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-slate-900 text-white shadow-xl shadow-teal-950/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border border-teal-500/40"
      aria-label="Open LifeRoute AI Assistant"
      title="Ask LifeRoute AI"
    >
      {/* Glowing medical radar pulse beacon */}
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />

      <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
        <Bot className="w-4 h-4 text-teal-200" />
      </div>

      <div className="text-left hidden xs:flex flex-col pr-1">
        <span className="text-xs font-bold leading-none block">LifeRoute AI</span>
        <span className="text-[9px] text-teal-200 font-medium leading-none block mt-0.5">
          Ask Assistant
        </span>
      </div>

      <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
    </button>
  );
};
