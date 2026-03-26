import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../stores/invitationStore';
import TemplateSectionShell from './TemplateSectionShell';
import { getActionButtonStyle, getFieldStyle } from '../../lib/template-ui';
import { getCopy } from '../../lib/invitation-copy';
import EditableCopy from './EditableCopy';

interface RSVPFormProps {
  invitationId: string;
  rsvpDeadline?: string;
  rsvpEnabled: boolean;
  templateId: string;
  styleVariant?: 'form-card' | 'soft-panel';
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
}

/**
 * Format a date string into Malay-friendly display.
 * Example: "18 Jun 2026, 11:59 malam"
 */
function formatMalayDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();

    const monthFormatter = new Intl.DateTimeFormat('ms-MY', { month: 'short' });
    const month = monthFormatter.format(date);

    const year = date.getFullYear();

    const hours24 = date.getHours();
    const minutes = date.getMinutes();

    // Malay time-of-day: pagi (morning), tengah hari (noon), petang (afternoon/evening), malam (night)
    let period: string;
    if (hours24 >= 0 && hours24 < 12) {
      period = 'pagi';
    } else if (hours24 === 12 && minutes === 0) {
      period = 'tengah hari';
    } else if (hours24 >= 12 && hours24 < 19) {
      period = 'petang';
    } else {
      period = 'malam';
    }

    const hours12 = hours24 % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${hours12}:${minutesStr} ${period}`;
  } catch {
    return dateStr;
  }
}

export default function RSVPForm({
  invitationId,
  rsvpDeadline,
  rsvpEnabled,
  templateId,
  styleVariant = 'form-card',
  copyOverrides,
  previewEditMode = false,
}: RSVPFormProps) {
  const submitRSVP = useInvitationStore((s) => s.submitRSVP);

  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Determine if RSVP is closed
  const isClosed = useMemo(() => {
    if (!rsvpEnabled) return true;
    if (rsvpDeadline) {
      return new Date() > new Date(rsvpDeadline);
    }
    return false;
  }, [rsvpEnabled, rsvpDeadline]);

  const formattedDeadline = useMemo(() => {
    if (!rsvpDeadline) return null;
    return formatMalayDate(rsvpDeadline);
  }, [rsvpDeadline]);

  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

  const handleSubmit = async () => {
    if (attending === null || !name.trim()) return;
    setLoading(true);
    try {
      await submitRSVP({
        invitation_id: invitationId,
        guest_name: name.trim(),
        phone: phone.trim() || undefined,
        attending,
        num_adults: attending ? numAdults : 0,
        num_children: attending ? numChildren : 0,
        message: message.trim() || undefined,
      });
      setSubmitted(true);
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
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
    ...getFieldStyle(templateId),
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body, "Poppins"), sans-serif',
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    color: 'var(--primary-color, #8B6F4E)',
    marginBottom: '6px',
    textAlign: 'left',
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
        <EditableCopy as="span" value={copy('rsvp.eyebrow', 'RSVP')} copyKey="rsvp.eyebrow" editMode={previewEditMode} />
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
        <EditableCopy as="span" value={copy('rsvp.title', 'Pengesahan Kehadiran')} copyKey="rsvp.title" editMode={previewEditMode} />
      </motion.h3>

      {/* ==================== CLOSED STATE ==================== */}
      {isClosed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{}}
        >
          <TemplateSectionShell templateId={templateId} padding="48px 24px" style={styleVariant === 'soft-panel' ? { borderRadius: '22px' } : undefined}>
          {/* Lock icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 35%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              background: 'color-mix(in srgb, var(--secondary-color, #D4AF37) 5%, transparent)',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--secondary-color, #D4AF37)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontSize: '18px',
              fontWeight: 500,
              color: 'var(--text-color, #2C1810)',
              marginBottom: '8px',
            }}
          >
            <EditableCopy as="span" value={copy('rsvp.closed_title', 'RSVP Ditutup')} copyKey="rsvp.closed_title" editMode={previewEditMode} />
          </p>

          <p
            style={{
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '13px',
              color: 'var(--primary-color, #8B6F4E)',
              lineHeight: 1.7,
              marginBottom: formattedDeadline ? '16px' : '0',
            }}
          >
            <EditableCopy as="span" value={copy('rsvp.closed_message', 'Maaf, tempoh RSVP telah tamat.')} copyKey="rsvp.closed_message" editMode={previewEditMode} />
          </p>

          {formattedDeadline && (
            <p
              style={{
                fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                fontSize: '11px',
                letterSpacing: '1px',
                color: 'var(--primary-color, #8B6F4E)',
                opacity: 0.7,
              }}
            >
              <EditableCopy as="span" value={copy('rsvp.deadline_prefix', 'Tarikh tutup:')} copyKey="rsvp.deadline_prefix" editMode={previewEditMode} /> {formattedDeadline}
            </p>
          )}
          </TemplateSectionShell>
        </motion.div>
      ) : (
        /* ==================== OPEN STATE ==================== */
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              style={{}}
            >
              <TemplateSectionShell templateId={templateId} padding="40px 24px" style={styleVariant === 'soft-panel' ? { borderRadius: '22px' } : undefined}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px solid var(--secondary-color, #D4AF37)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color, #D4AF37)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display, "Playfair Display"), serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'var(--text-color, #2C1810)',
                  marginBottom: '8px',
                }}
              >
                <EditableCopy as="span" value={copy('rsvp.success_title', 'Terima Kasih!')} copyKey="rsvp.success_title" editMode={previewEditMode} />
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '13px',
                  color: 'var(--primary-color, #8B6F4E)',
                  lineHeight: 1.6,
                }}
              >
                {attending ? (
                  <EditableCopy as="span" value={copy('rsvp.success_yes', 'Pengesahan kehadiran anda telah direkodkan. Kami menantikan kehadiran anda!')} copyKey="rsvp.success_yes" editMode={previewEditMode} />
                ) : (
                  <EditableCopy as="span" value={copy('rsvp.success_no', 'Terima kasih atas maklum balas anda. Semoga kita dapat bertemu di lain masa.')} copyKey="rsvp.success_no" editMode={previewEditMode} />
                )}
              </p>
              </TemplateSectionShell>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{}}
            >
              <TemplateSectionShell templateId={templateId} padding="28px 20px" style={styleVariant === 'soft-panel' ? { borderRadius: '22px' } : undefined}>
              {/* Deadline banner */}
              {formattedDeadline && (
                <div
                  style={{
                    marginBottom: '24px',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    background: 'color-mix(in srgb, var(--secondary-color, #D4AF37) 8%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '11px',
                      color: 'var(--primary-color, #8B6F4E)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    <EditableCopy as="span" value={copy('rsvp.banner_prefix', 'Sila sahkan kehadiran anda sebelum')} copyKey="rsvp.banner_prefix" editMode={previewEditMode} />{' '}
                    <span
                      style={{
                      fontWeight: 600,
                      color: 'var(--secondary-color, #D4AF37)',
                      }}
                    >
                      {formattedDeadline}
                    </span>
                  </p>
                </div>
              )}

              {/* Attendance toggle */}
              <div style={{ marginBottom: '24px' }}>
                <p style={labelStyle}>
                  <EditableCopy as="span" value={copy('rsvp.attendance_label', 'Kehadiran')} copyKey="rsvp.attendance_label" editMode={previewEditMode} />
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      if ((event.target as HTMLElement).isContentEditable) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                      }
                      setAttending(true);
                    }}
                    style={{
                      padding: '14px 16px',
                      border: attending === true
                        ? '2px solid var(--secondary-color, #D4AF37)'
                        : '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
                      background: attending === true
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent), color-mix(in srgb, var(--secondary-color, #D4AF37) 5%, transparent))'
                        : 'transparent',
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '13px',
                      fontWeight: attending === true ? 600 : 400,
                      color: attending === true
                        ? 'var(--secondary-color, #D4AF37)'
                        : 'var(--primary-color, #8B6F4E)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      ...getActionButtonStyle(templateId, 'outline'),
                    }}
                  >
                    <EditableCopy as="span" value={copy('rsvp.attend_yes', 'Hadir')} copyKey="rsvp.attend_yes" editMode={previewEditMode} />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      if ((event.target as HTMLElement).isContentEditable) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                      }
                      setAttending(false);
                    }}
                    style={{
                      padding: '14px 16px',
                      border: attending === false
                        ? '2px solid var(--secondary-color, #D4AF37)'
                        : '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
                      background: attending === false
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent), color-mix(in srgb, var(--secondary-color, #D4AF37) 5%, transparent))'
                        : 'transparent',
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '13px',
                      fontWeight: attending === false ? 600 : 400,
                      color: attending === false
                        ? 'var(--secondary-color, #D4AF37)'
                        : 'var(--primary-color, #8B6F4E)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      ...getActionButtonStyle(templateId, 'outline'),
                    }}
                  >
                    <EditableCopy as="span" value={copy('rsvp.attend_no', 'Tidak Hadir')} copyKey="rsvp.attend_no" editMode={previewEditMode} />
                  </button>
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  <EditableCopy as="span" value={copy('rsvp.name_label', 'Nama')} copyKey="rsvp.name_label" editMode={previewEditMode} />
                </label>
                <input
                  type="text"
                  placeholder={copy('rsvp.name_placeholder', 'Nama penuh anda')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  <EditableCopy as="span" value={copy('rsvp.phone_label', 'No. Telefon')} copyKey="rsvp.phone_label" editMode={previewEditMode} />
                </label>
                <input
                  type="tel"
                  placeholder={copy('rsvp.phone_placeholder', '012-345 6789')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Guest count - only show if attending */}
              {attending && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    {/* Adults counter */}
                    <div>
                      <label style={labelStyle}>
                        <EditableCopy as="span" value={copy('rsvp.adults_label', 'Dewasa')} copyKey="rsvp.adults_label" editMode={previewEditMode} />
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
                          overflow: 'hidden',
                          ...getFieldStyle(templateId),
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                            fontSize: '18px',
                            color: 'var(--secondary-color, #D4AF37)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            fontFamily: 'var(--font-display, "Playfair Display"), serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: 'var(--text-color, #2C1810)',
                          }}
                        >
                          {numAdults}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNumAdults(numAdults + 1)}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                            fontSize: '18px',
                            color: 'var(--secondary-color, #D4AF37)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children counter */}
                    <div>
                      <label style={labelStyle}>
                        <EditableCopy as="span" value={copy('rsvp.children_label', 'Kanak-kanak')} copyKey="rsvp.children_label" editMode={previewEditMode} />
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
                          overflow: 'hidden',
                          ...getFieldStyle(templateId),
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setNumChildren(Math.max(0, numChildren - 1))}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                            fontSize: '18px',
                            color: 'var(--secondary-color, #D4AF37)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            fontFamily: 'var(--font-display, "Playfair Display"), serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: 'var(--text-color, #2C1810)',
                          }}
                        >
                          {numChildren}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNumChildren(numChildren + 1)}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                            fontSize: '18px',
                            color: 'var(--secondary-color, #D4AF37)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>
                  <EditableCopy as="span" value={copy('rsvp.message_label', 'Ucapan (Pilihan)')} copyKey="rsvp.message_label" editMode={previewEditMode} />
                </label>
                <textarea
                  placeholder={copy('rsvp.message_placeholder', 'Tulis ucapan anda...')}
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

              {/* Submit button */}
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
                disabled={attending === null || !name.trim() || loading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  border: 'none',
                  background:
                    attending === null || !name.trim()
                      ? 'color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)'
                      : 'linear-gradient(135deg, var(--secondary-color, #D4AF37), #C5A028)',
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  color:
                    attending === null || !name.trim()
                      ? 'var(--primary-color, #8B6F4E)'
                      : 'var(--bg-color, #FDF8F0)',
                  cursor: attending === null || !name.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  ...getActionButtonStyle(templateId, 'solid'),
                }}
              >
                {loading && (
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </motion.svg>
                )}
                <EditableCopy as="span" value={loading ? copy('rsvp.submitting', 'Menghantar...') : copy('rsvp.submit', 'Hantar RSVP')} copyKey={loading ? 'rsvp.submitting' : 'rsvp.submit'} editMode={previewEditMode} />
              </motion.button>
              </TemplateSectionShell>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
