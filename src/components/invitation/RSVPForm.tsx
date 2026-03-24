import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../stores/invitationStore';

interface RSVPFormProps {
  invitationId: string;
}

export default function RSVPForm({ invitationId }: RSVPFormProps) {
  const submitRSVP = useInvitationStore((s) => s.submitRSVP);

  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
              }}
            >
              {loading ? 'Menghantar...' : 'Hantar RSVP'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
