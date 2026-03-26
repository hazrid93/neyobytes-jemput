import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, buildSystemPrompt, checkQuota } from '../../lib/chatbot';
import type { ChatMessage } from '../../types';

interface ChatbotWidgetProps {
  invitationId: string;
  enabled: boolean;
  weddingContext: string;
  extraContext?: string;
  dailyLimit?: number;
  /** When false, chatbot returns a canned response without hitting the LLM backend */
  subscriptionActive?: boolean;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'initial',
  role: 'assistant',
  content:
    'Assalamualaikum! Saya pembantu digital untuk majlis ini. Tanya apa sahaja tentang majlis perkahwinan ini. 😊',
  timestamp: new Date().toISOString(),
};

export default function ChatbotWidget({
  invitationId,
  enabled,
  weddingContext,
  extraContext,
  dailyLimit = 20,
  subscriptionActive = true,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isConfigured = true; // Backend handles LLM config; always available if API is running

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!enabled) return null;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || quotaExceeded) return;

    if (!isConfigured) return;

    // If the invitation owner has no active subscription, return a canned
    // response entirely on the client — no backend / LLM call at all.
    if (!subscriptionActive) {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      // Short delay to feel natural
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 600));
      setIsTyping(false);
      const blockedMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Maaf, ciri chatbot ini memerlukan langganan aktif. Sila hubungi pihak pengantin untuk sebarang pertanyaan.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, blockedMsg]);
      return;
    }

    // Check quota before sending
    try {
      const quota = await checkQuota(invitationId, dailyLimit);
      setRemaining(quota.remaining);

      if (!quota.allowed) {
        setQuotaExceeded(true);
        const quotaMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Maaf, had soalan harian telah dicapai (${dailyLimit} soalan/hari). Sila cuba semula esok.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, quotaMsg]);
        return;
      }
    } catch (err) {
      console.error('Quota check failed:', err);
      // Continue anyway if quota check fails (graceful degradation)
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const systemPrompt = buildSystemPrompt(weddingContext, extraContext);

      // Build conversation history for API (exclude the initial greeting)
      const apiMessages = [...messages.filter((m) => m.id !== 'initial'), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage({
        messages: apiMessages,
        systemPrompt,
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Maaf, saya tidak dapat menjawab sekarang. Sila hubungi pihak pengantin.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            aria-label="Buka chatbot"
            style={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary-color, #D4AF37) 0%, var(--primary-color, #8B6F4E) 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--secondary-color, #D4AF37) 40%, transparent)',
              zIndex: 1000,
              animation: 'chatbot-pulse 2s ease-in-out 3',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 5.813 2 10.5c0 2.694 1.475 5.087 3.775 6.625L4.5 21.5l4.325-2.437C9.863 19.35 10.913 19.5 12 19.5c5.523 0 10-3.813 10-8.5S17.523 2 12 2z"
                fill="white"
              />
              <circle cx="8" cy="10.5" r="1.25" fill="var(--secondary-color, #D4AF37)" />
              <circle cx="12" cy="10.5" r="1.25" fill="var(--secondary-color, #D4AF37)" />
              <circle cx="16" cy="10.5" r="1.25" fill="var(--secondary-color, #D4AF37)" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: 24,
              width: 'min(380px, calc(100vw - 48px))',
              maxHeight: 'min(500px, calc(100vh - 100px))',
              background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 92%, white)',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 1001,
              border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 24%, transparent)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, var(--secondary-color, #D4AF37) 0%, var(--primary-color, #8B6F4E) 100%)',
                color: 'white',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.477 2 2 5.813 2 10.5c0 2.694 1.475 5.087 3.775 6.625L4.5 21.5l4.325-2.437C9.863 19.35 10.913 19.5 12 19.5c5.523 0 10-3.813 10-8.5S17.523 2 12 2z"
                    fill="white"
                  />
                </svg>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Tanya Kami</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chatbot"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Not configured message */}
            {!isConfigured && (
              <div
                style={{
                  padding: 24,
                  textAlign: 'center',
                  color: 'var(--primary-color, #8B6F4E)',
                  fontSize: 14,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Chatbot belum dikonfigurasi. Sila hubungi pihak pengantin untuk sebarang pertanyaan.
              </div>
            )}

            {/* Messages area */}
            {isConfigured && (
              <>
                 <div
                  className="chatbot-messages-scroll"
                   style={{
                     flex: 1,
                     overflowY: 'auto',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                     minHeight: 200,
                     scrollbarColor: 'color-mix(in srgb, var(--secondary-color, #D4AF37) 65%, transparent) transparent',
                   }}
                 >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent:
                          msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: '10px 14px',
                          borderRadius:
                            msg.role === 'user'
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                          background:
                            msg.role === 'user'
                              ? 'linear-gradient(135deg, var(--secondary-color, #D4AF37), var(--primary-color, #8B6F4E))'
                              : 'color-mix(in srgb, var(--accent-color, #F5E6D3) 65%, white)',
                          color: msg.role === 'user' ? 'white' : 'var(--text-color, #2C1810)',
                          fontSize: 14,
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div
                        style={{
                          padding: '10px 18px',
                          borderRadius: '16px 16px 16px 4px',
                          background: 'color-mix(in srgb, var(--accent-color, #F5E6D3) 65%, white)',
                          display: 'flex',
                          gap: 4,
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ ...typingDotStyle, animationDelay: '0ms' }} />
                        <span style={{ ...typingDotStyle, animationDelay: '150ms' }} />
                        <span style={{ ...typingDotStyle, animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Remaining quota indicator */}
                {remaining !== null && dailyLimit > 0 && (
                  <div
                    style={{
                      padding: '4px 12px',
                      background: quotaExceeded
                        ? 'rgba(255, 59, 48, 0.08)'
                        : 'color-mix(in srgb, var(--secondary-color, #D4AF37) 10%, transparent)',
                      borderTop: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 24%, transparent)',
                      textAlign: 'center',
                      fontSize: 12,
                      color: quotaExceeded ? '#e03131' : 'var(--primary-color, #8B6F4E)',
                      flexShrink: 0,
                    }}
                  >
                    {quotaExceeded
                      ? `Had harian dicapai (${dailyLimit} soalan/hari)`
                      : `Baki soalan hari ini: ${remaining}`}
                  </div>
                )}

                {/* Input area */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderTop: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 24%, transparent)',
                    background: 'color-mix(in srgb, var(--bg-color, #FDF8F0) 96%, white)',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      quotaExceeded
                        ? 'Had soalan harian dicapai'
                        : 'Taip soalan anda...'
                    }
                    disabled={isTyping || quotaExceeded}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      width: 0,
                      border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 24%, transparent)',
                      borderRadius: 20,
                      padding: '8px 16px',
                      fontSize: 14,
                      outline: 'none',
                      background: quotaExceeded ? '#f5f5f5' : 'white',
                      color: 'var(--text-color, #2C1810)',
                      fontFamily: 'Poppins, sans-serif',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping || quotaExceeded}
                    aria-label="Hantar"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: 'none',
                      background:
                        input.trim() && !isTyping && !quotaExceeded
                          ? 'linear-gradient(135deg, var(--secondary-color, #D4AF37) 0%, var(--primary-color, #8B6F4E) 100%)'
                          : 'color-mix(in srgb, var(--accent-color, #F5E6D3) 75%, var(--bg-color, #FDF8F0))',
                      cursor:
                        input.trim() && !isTyping && !quotaExceeded
                          ? 'pointer'
                          : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global keyframe styles */}
      <style>{`
        @keyframes chatbot-pulse {
          0%, 100% { box-shadow: 0 4px 20px color-mix(in srgb, var(--secondary-color, #D4AF37) 40%, transparent); }
          50% { box-shadow: 0 4px 30px color-mix(in srgb, var(--secondary-color, #D4AF37) 65%, transparent), 0 0 0 8px color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent); }
        }
        @keyframes chatbot-typing-dot {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        [aria-label="Buka chatbot"]:focus-visible,
        [aria-label="Tutup chatbot"]:focus-visible {
          outline: 2px solid var(--secondary-color, #D4AF37);
          outline-offset: 2px;
        }
        .chatbot-messages-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .chatbot-messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chatbot-messages-scroll::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--secondary-color, #D4AF37) 55%, transparent);
          border-radius: 999px;
        }
        .chatbot-messages-scroll::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--secondary-color, #D4AF37) 75%, transparent);
        }
      `}</style>
    </>
  );
}

const typingDotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: 'var(--primary-color, #8B6F4E)',
  display: 'inline-block',
  animation: 'chatbot-typing-dot 1.2s ease-in-out infinite',
};
