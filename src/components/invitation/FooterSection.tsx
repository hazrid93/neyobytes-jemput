import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Invitation } from '../../types';

interface FooterSectionProps {
  invitation: Invitation;
}

export default function FooterSection({ invitation }: FooterSectionProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const groomFirst = invitation.groom_name.split(' ')[0];
  const brideFirst = invitation.bride_name.split(' ')[0];
  const hashtag = `#${groomFirst}${brideFirst}`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Jemputan ke Majlis Perkahwinan ${invitation.groom_name} & ${invitation.bride_name}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  return (
    <footer
      style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Hashtag */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: 'var(--font-display, "Playfair Display"), serif',
          fontSize: '24px',
          fontWeight: 600,
          fontStyle: 'italic',
          color: 'var(--secondary-color, #D4AF37)',
          marginBottom: '16px',
        }}
      >
        {hashtag}
      </motion.p>

      {/* Closing text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '13px',
          color: 'var(--text-color, #2C1810)',
          lineHeight: 1.7,
          marginBottom: '8px',
        }}
      >
        Dengan hormat,
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-display, "Playfair Display"), serif',
          fontSize: '16px',
          fontStyle: 'italic',
          color: 'var(--text-color, #2C1810)',
          marginBottom: '32px',
        }}
      >
        Keluarga Pengantin
      </motion.p>

      {/* Divider */}
      <div
        style={{
          width: '80px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
          margin: '0 auto 28px',
        }}
      />

      {/* Share buttons */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '10px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--primary-color, #8B6F4E)',
          marginBottom: '16px',
        }}
      >
        Kongsi Jemputan
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '40px',
        }}
      >
        {/* WhatsApp share */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
            borderRadius: '4px',
            background: 'transparent',
            textDecoration: 'none',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-color, #2C1810)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--secondary-color, #D4AF37)">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 30%, transparent)',
            borderRadius: '4px',
            background: linkCopied ? 'color-mix(in srgb, var(--secondary-color, #D4AF37) 10%, transparent)' : 'transparent',
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-color, #2C1810)',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color, #D4AF37)" strokeWidth="2">
            {linkCopied ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </>
            )}
          </svg>
          {linkCopied ? 'Disalin!' : 'Salin Pautan'}
        </button>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          paddingTop: '20px',
          borderTop: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '11px',
            color: 'var(--primary-color, #8B6F4E)',
            opacity: 0.6,
            margin: 0,
          }}
        >
          Dibuat dengan{' '}
          <span style={{ color: 'var(--secondary-color, #D4AF37)' }}>&#10084;</span>
          {' '}oleh{' '}
          <a
            href="/"
            style={{
              color: 'var(--secondary-color, #D4AF37)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Jemput
          </a>
        </p>
      </motion.div>
    </footer>
  );
}
