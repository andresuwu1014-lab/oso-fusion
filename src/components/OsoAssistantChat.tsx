import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

interface OsoAssistantChatProps {
  onSelectProductByName?: (name: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: '¡Hola! 🐾 Soy **Oso Asistente**, tu guía gastronómico en **Oso Fusión**.\n\nPuedo ayudarte a elegir platos según tus gustos, verificar alérgenos, contarte sobre nuestras promociones (como el Miércoles Fusión o Cumpleaños) o resolver dudas sobre domicilios en Ibagué.',
    timestamp: 'Ahora',
    suggestions: [
      '¿Qué plato me recomiendas?',
      '¿Tienen opciones sin gluten?',
      '¿Cuáles son las promociones activas?',
      '¿Dónde están ubicados y qué horario tienen?',
      '¿Cómo funcionan los domicilios?',
    ],
  },
];

export const OsoAssistantChat: React.FC<OsoAssistantChatProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        throw new Error('Error en el asistente');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Disculpa, tuve un inconveniente momentáneo. Recuerda que también puedes escribirnos directamente a nuestro WhatsApp oficial **3227688168** y con gusto te atenderemos. 🐾',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button with animated bear avatar */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1E2721] to-[#121614] gold-border-glow p-2.5 pr-5 shadow-2xl transition-all"
          id="btn-trigger-oso-assistant"
          title="Abrir Oso Asistente"
        >
          {/* Animated Mini Bear Icon */}
          <div className="w-10 h-10 rounded-full bg-[#202923] border border-[#E5B869] flex items-center justify-center relative overflow-hidden shadow-inner">
            <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
              <circle cx="27" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2" />
              <circle cx="73" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2" />
              <circle cx="50" cy="54" r="34" fill="#181C19" stroke="#E5B869" strokeWidth="2" />
              <path d="M 28 46 C 26 38, 44 38, 45 47 C 46 54, 30 55, 28 46 Z" stroke="#E5B869" strokeWidth="3" />
              <path d="M 72 46 C 74 38, 56 38, 55 47 C 54 54, 70 55, 72 46 Z" stroke="#E5B869" strokeWidth="3" />
              <circle cx="37" cy="46" r="3" fill="#F3EFE6" />
              <circle cx="63" cy="46" r="3" fill="#F3EFE6" />
              <ellipse cx="50" cy="61" rx="12" ry="8" fill="#262D28" />
              <path d="M 47 58 Q 50 56 53 58 Q 50 62 47 58 Z" fill="#E5B869" />
              <circle cx="72" cy="24" r="3" fill="#E89DA8" />
            </svg>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#8ED09E] animate-pulse" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xs text-[#F3EFE6]">
                OSO ASISTENTE
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#E5B869]/20 text-[#E5B869] border border-[#E5B869]/40">
                IA
              </span>
            </div>
            <p className="text-[10px] text-[#CFCBC0]/70">¿Preguntas sobre el menú?</p>
          </div>
        </motion.button>
      </div>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[620px] h-[78vh] rounded-3xl bg-[#141916] gold-border-glow shadow-2xl flex flex-col z-50 overflow-hidden"
            id="oso-assistant-window"
          >
            {/* Header */}
            <div className="p-4 bg-[#1A221D] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#232D26] border border-[#E5B869]/50 flex items-center justify-center text-[#E5B869]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-[#F3EFE6]">
                      Oso Asistente
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-[#8ED09E]" />
                  </div>
                  <p className="text-[11px] text-[#CFCBC0]/70">
                    Asesor oficial de Oso Fusión • Ibagué
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] font-medium shadow-md'
                        : 'bg-[#1D2520] border border-white/10 text-[#F3EFE6] shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>

                  <span className="text-[10px] text-[#CFCBC0]/50 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 rounded-full text-[11px] bg-[#222C25] hover:bg-[#2C3830] text-[#E5B869] border border-[#E5B869]/20 hover:border-[#E5B869]/50 transition-all text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#1D2520] border border-white/10 text-xs text-[#E5B869] w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#E5B869] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-[#CFCBC0] ml-1">Oso Asistente está escribiendo...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#181F1A] border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregunta sobre ingredientes, alérgenos, promos..."
                className="flex-1 rounded-xl bg-[#111412] border border-white/10 px-3.5 py-2 text-xs text-[#F3EFE6] placeholder-[#A6A298]/50 focus:border-[#E5B869] focus:outline-none transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] disabled:opacity-40 transition-all active:scale-95 shadow"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
