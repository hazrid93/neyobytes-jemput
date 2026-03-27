import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, buildEditorSystemPrompt, checkEditorQuota } from '../../lib/chatbot';
import { NAVY, NAVY_LIGHT, OFF_WHITE, SLATE_200 } from '../../constants/colors';
import type { ChatMessage } from '../../types';

interface EditorChatAssistantProps {
  /** Whether the admin has enabled this chat context */
  enabled: boolean;
  /** Daily question limit (0 = unlimited) */
  dailyLimit: number;
  /** 'cuba_editor' for /cuba trial, 'editor' for signed-in users */
  contextKey: 'cuba_editor' | 'editor';
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'initial',
  role: 'assistant',
  content:
    'Hai! Saya pembantu AI untuk editor Jemput. Tanya apa sahaja tentang cara menggunakan editor ini.',
  timestamp: new Date().toISOString(),
};

/** Canned response when feature is disabled by admin or limit reached */
const DISABLED_RESPONSE = 'Cuba lagi nanti.';

export default function EditorChatAssistant({
  enabled,
  dailyLimit,
  contextKey,
}: EditorChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping || quotaExceeded) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // If admin has disabled this chat context, return canned response — NO LLM call
    if (!enabled) {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 500));
      setIsTyping(false);
      const blockedMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: DISABLED_RESPONSE,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, blockedMsg]);
      return;
    }

    // Check quota
    try {
      const quota = await checkEditorQuota(contextKey, dailyLimit);
      setRemaining(quota.remaining);

      if (!quota.allowed) {
        setQuotaExceeded(true);
        const quotaMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: DISABLED_RESPONSE,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, quotaMsg]);
        return;
      }
    } catch (err) {
      console.warn('Editor chat quota check failed:', err);
    }

    setIsTyping(true);

    try {
      const systemPrompt = buildEditorSystemPrompt();

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
      console.error('Editor chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, saya tidak dapat menjawab sekarang. Sila cuba sebentar lagi.',
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

  // --- Colour constants (dashboard uses gold/brown palette) ---
  const PRIMARY = NAVY;
  const ACCENT = NAVY_LIGHT;
  const BG = OFF_WHITE;
  const TEXT = NAVY;

  return (
    <>
      {/* FAB — bottom-right in the editor (bottom-left is used by preview chatbot) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            aria-label="Buka pembantu AI editor"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${PRIMARY} 100%)`,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 20px rgba(30,58,95,0.4)`,
              zIndex: 1000,
              animation: 'editor-chat-pulse 2s ease-in-out 3',
            }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.477 2 2 5.813 2 10.5c0 2.694 1.475 5.087 3.775 6.625L4.5 21.5l4.325-2.437C9.863 19.35 10.913 19.5 12 19.5c5.523 0 10-3.813 10-8.5S17.523 2 12 2z"
                  fill="white"
                />
                <circle cx="8" cy="10.5" r="1.25" fill={ACCENT} />
                <circle cx="12" cy="10.5" r="1.25" fill={ACCENT} />
                <circle cx="16" cy="10.5" r="1.25" fill={ACCENT} />
              </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
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
              right: 24,
              width: 'min(380px, calc(100vw - 48px))',
              maxHeight: 'min(520px, calc(100vh - 100px))',
              background: BG,
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 1001,
              border: `1px solid ${SLATE_200}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${PRIMARY} 100%)`,
                color: 'white',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.477 2 2 5.813 2 10.5c0 2.694 1.475 5.087 3.775 6.625L4.5 21.5l4.325-2.437C9.863 19.35 10.913 19.5 12 19.5c5.523 0 10-3.813 10-8.5S17.523 2 12 2z"
                    fill="white"
                  />
                  <circle cx="8" cy="10.5" r="1.25" fill={ACCENT} />
                  <circle cx="12" cy="10.5" r="1.25" fill={ACCENT} />
                  <circle cx="16" cy="10.5" r="1.25" fill={ACCENT} />
                </svg>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Tanya Kami</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup pembantu AI"
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

            {/* Messages */}
            <div
              className="editor-chat-messages-scroll"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 200,
                scrollbarColor: `rgba(30,58,95,0.55) transparent`,
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
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
                          ? `linear-gradient(135deg, ${ACCENT}, ${PRIMARY})`
                          : ACCENT,
                      color: 'white',
                      fontSize: 14,
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      whiteSpace: 'pre-wrap',
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
                      background: ACCENT,
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

            {/* Quota bar */}
            {remaining !== null && dailyLimit > 0 && (
              <div
                style={{
                  padding: '4px 12px',
                  background: quotaExceeded ? 'rgba(255, 59, 48, 0.08)' : `rgba(30,58,95,0.1)`,
                  borderTop: `1px solid ${SLATE_200}`,
                  textAlign: 'center',
                  fontSize: 12,
                  color: quotaExceeded ? '#e03131' : PRIMARY,
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
                borderTop: `1px solid ${SLATE_200}`,
                background: BG,
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
                    : 'Tanya tentang editor...'
                }
                disabled={isTyping || quotaExceeded}
                style={{
                  flex: 1,
                  minWidth: 0,
                  width: 0,
                  border: `1px solid ${SLATE_200}`,
                  borderRadius: 20,
                  padding: '8px 16px',
                  fontSize: 14,
                  outline: 'none',
                  background: quotaExceeded ? '#f5f5f5' : 'white',
                  color: TEXT,
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
                      ? `linear-gradient(135deg, ${ACCENT} 0%, ${PRIMARY} 100%)`
                      : ACCENT,
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyframe styles */}
      <style>{`
        @keyframes editor-chat-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(30,58,95,0.4); }
          50% { box-shadow: 0 4px 30px rgba(30,58,95,0.65), 0 0 0 8px rgba(30,58,95,0.15); }
        }
        @keyframes editor-chat-typing-dot {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        [aria-label="Buka pembantu AI editor"]:focus-visible,
        [aria-label="Tutup pembantu AI"]:focus-visible {
          outline: 2px solid ${ACCENT};
          outline-offset: 2px;
        }
        .editor-chat-messages-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .editor-chat-messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .editor-chat-messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(30,58,95,0.55);
          border-radius: 999px;
        }
        .editor-chat-messages-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(30,58,95,0.75);
        }
      `}</style>
    </>
  );
}

const typingDotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: NAVY_LIGHT,
  display: 'inline-block',
  animation: 'editor-chat-typing-dot 1.2s ease-in-out infinite',
};
