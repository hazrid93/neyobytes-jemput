import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../stores/invitationStore';

interface RSVPFormProps {
  invitationId: string;
  rsvpDeadline?: string;
  rsvpEnabled: boolean;
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

export default function RSVPForm({ invitationId, rsvpDeadline, rsvpEnabled }: RSVPFormProps) {
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
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.5)',
    fontFamily: 'var(--font-body, "Poppins"), sans-serif',
    fontSize: '13px',
    color: 'var(--text-color, #2C1810)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
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
        RSVP
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
        Pengesahan Kehadiran
      </motion.h3>

      {/* ==================== CLOSED STATE ==================== */}
      {isClosed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '48px 24px',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.3)',
          }}
        >
          {/* Lock icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid rgba(212,175,55,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              background: 'rgba(212,175,55,0.05)',
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
            RSVP Ditutup
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
            Maaf, tempoh RSVP telah tamat.
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
              Tarikh tutup: {formattedDeadline}
            </p>
          )}
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
              style={{
                padding: '40px 24px',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.3)',
              }}
            >
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
                Terima Kasih!
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '13px',
                  color: 'var(--primary-color, #8B6F4E)',
                  lineHeight: 1.6,
                }}
              >
                {attending
                  ? 'Pengesahan kehadiran anda telah direkodkan. Kami menantikan kehadiran anda!'
                  : 'Terima kasih atas maklum balas anda. Semoga kita dapat bertemu di lain masa.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '4px',
                padding: '28px 20px',
                background: 'rgba(255,255,255,0.3)',
              }}
            >
              {/* Deadline banner */}
              {formattedDeadline && (
                <div
                  style={{
                    marginBottom: '24px',
                    padding: '10px 16px',
                    borderRadius: '4px',
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.15)',
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
                    Sila sahkan kehadiran anda sebelum{' '}
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
                <p style={labelStyle}>Kehadiran</p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    style={{
                      padding: '14px 16px',
                      border: attending === true
                        ? '2px solid var(--secondary-color, #D4AF37)'
                        : '1px solid rgba(212,175,55,0.3)',
                      borderRadius: '4px',
                      background: attending === true
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))'
                        : 'transparent',
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '13px',
                      fontWeight: attending === true ? 600 : 400,
                      color: attending === true
                        ? 'var(--secondary-color, #D4AF37)'
                        : 'var(--primary-color, #8B6F4E)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    style={{
                      padding: '14px 16px',
                      border: attending === false
                        ? '2px solid var(--secondary-color, #D4AF37)'
                        : '1px solid rgba(212,175,55,0.3)',
                      borderRadius: '4px',
                      background: attending === false
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))'
                        : 'transparent',
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '13px',
                      fontWeight: attending === false ? 600 : 400,
                      color: attending === false
                        ? 'var(--secondary-color, #D4AF37)'
                        : 'var(--primary-color, #8B6F4E)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Tidak Hadir
                  </button>
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Nama</label>
                <input
                  type="text"
                  placeholder="Nama penuh anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>No. Telefon</label>
                <input
                  type="tel"
                  placeholder="012-345 6789"
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
                      <label style={labelStyle}>Dewasa</label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '4px',
                          overflow: 'hidden',
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
                      <label style={labelStyle}>Kanak-kanak</label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '4px',
                          overflow: 'hidden',
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
                <label style={labelStyle}>Ucapan (Pilihan)</label>
                <textarea
                  placeholder="Tulis ucapan anda..."
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
                onClick={handleSubmit}
                disabled={attending === null || !name.trim() || loading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  border: 'none',
                  borderRadius: '4px',
                  background:
                    attending === null || !name.trim()
                      ? 'rgba(212,175,55,0.3)'
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
                {loading ? 'Menghantar...' : 'Hantar RSVP'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
