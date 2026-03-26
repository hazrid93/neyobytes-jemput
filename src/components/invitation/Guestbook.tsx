import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../stores/invitationStore';
import type { GuestbookMessage } from '../../types';
import TemplateSectionShell from './TemplateSectionShell';
import { getActionButtonStyle, getFieldStyle } from '../../lib/template-ui';
import { getCopy } from '../../lib/invitation-copy';
import EditableCopy from './EditableCopy';

interface GuestbookProps {
  invitationId: string;
  messages: GuestbookMessage[];
  templateId: string;
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Baru sahaja';
  if (minutes < 60) return `${minutes} minit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 30) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Guestbook({ invitationId, messages, templateId, copyOverrides, previewEditMode = false }: GuestbookProps) {
  const submitGuestbook = useInvitationStore((s) => s.submitGuestbook);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      await submitGuestbook({
        invitation_id: invitationId,
        name: name.trim(),
        message: message.trim(),
      });
      setName('');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.5)',
    fontFamily: 'var(--font-body, "Poppins"), sans-serif',
    fontSize: '13px',
    color: 'var(--text-color, #2C1810)',
    outline: 'none',
    boxSizing: 'border-box' as const,
    ...getFieldStyle(templateId),
  };

  return (
    <section
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Section title */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '10px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'var(--primary-color, #8B6F4E)',
          marginBottom: '8px',
        }}
      >
        <EditableCopy as="span" value={copy('guestbook.eyebrow', 'Buku Tetamu')} copyKey="guestbook.eyebrow" editMode={previewEditMode} />
      </motion.p>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-display, "Playfair Display"), serif',
          fontSize: '22px',
          fontWeight: 500,
          color: 'var(--text-color, #2C1810)',
          marginBottom: '28px',
        }}
      >
        <EditableCopy as="span" value={copy('guestbook.title', 'Ucapan & Doa')} copyKey="guestbook.title" editMode={previewEditMode} />
      </motion.h3>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ marginBottom: '24px', textAlign: 'left' }}
      >
        <TemplateSectionShell templateId={templateId} padding="24px 20px" contentStyle={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder={copy('guestbook.name_placeholder', 'Nama anda')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <textarea
              placeholder={copy('guestbook.message_placeholder', 'Tulis ucapan anda...')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical' as const,
                minHeight: '80px',
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(event) => {
              if ((event.target as HTMLElement).isContentEditable) {
                event.preventDefault();
                event.stopPropagation();
                return;
              }
              if (previewEditMode) {
                event.preventDefault();
                return;
              }
              handleSubmit();
            }}
            disabled={!name.trim() || !message.trim() || loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              border: 'none',
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              color:
                !name.trim() || !message.trim()
                  ? 'var(--primary-color, #8B6F4E)'
                  : 'var(--bg-color, #FDF8F0)',
              cursor: !name.trim() || !message.trim() ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              ...getActionButtonStyle(templateId, 'solid'),
            }}
          >
            <EditableCopy as="span" value={loading ? copy('guestbook.submitting', 'Menghantar...') : copy('guestbook.submit', 'Hantar Ucapan')} copyKey={loading ? 'guestbook.submitting' : 'guestbook.submit'} editMode={previewEditMode} />
          </motion.button>
        </TemplateSectionShell>
      </motion.div>

      {/* Messages list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)',
                borderRadius: '4px',
                padding: '16px 16px',
                background: 'rgba(255,255,255,0.2)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display, "Playfair Display"), serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-color, #2C1810)',
                    margin: 0,
                  }}
                >
                  {msg.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                    fontSize: '10px',
                    color: 'var(--primary-color, #8B6F4E)',
                    margin: 0,
                    opacity: 0.6,
                  }}
                >
                  {timeAgo(msg.created_at)}
                </p>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '13px',
                  color: 'var(--text-color, #2C1810)',
                  lineHeight: 1.6,
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                {msg.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
