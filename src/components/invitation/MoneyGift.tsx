import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MoneyGift as MoneyGiftType } from '../../types';
import TemplateSectionShell from './TemplateSectionShell';
import { getActionButtonStyle } from '../../lib/template-ui';
import { getCopy } from '../../lib/invitation-copy';
import EditableCopy from './EditableCopy';

interface MoneyGiftProps {
  moneyGift: MoneyGiftType;
  templateId: string;
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
}

export default function MoneyGift({ moneyGift, templateId, copyOverrides, previewEditMode = false }: MoneyGiftProps) {
  const [copied, setCopied] = useState(false);
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(moneyGift.account_number.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = moneyGift.account_number.replace(/\s/g, '');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
        <EditableCopy as="span" value={copy('money_gift.eyebrow', 'Salam Kaut')} copyKey="money_gift.eyebrow" editMode={previewEditMode} />
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
          marginBottom: '8px',
        }}
      >
        <EditableCopy as="span" value={copy('money_gift.title', 'Hadiah Wang')} copyKey="money_gift.title" editMode={previewEditMode} />
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '12px',
          color: 'var(--primary-color, #8B6F4E)',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}
      >
        <EditableCopy as="span" value={copy('money_gift.description', 'Doa restu anda sudah cukup bermakna. Sekiranya ingin memberi sumbangan, boleh melalui:')} copyKey="money_gift.description" editMode={previewEditMode} />
      </motion.p>

      {/* Money gift card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ position: 'relative' }}
      >
        <TemplateSectionShell templateId={templateId} padding="28px 20px">
          <p
            style={{
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--secondary-color, #D4AF37)',
              marginBottom: '12px',
            }}
          >
            {moneyGift.bank_name}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontSize: '17px',
              fontWeight: 500,
              color: 'var(--text-color, #2C1810)',
              marginBottom: '8px',
            }}
          >
            {moneyGift.account_name}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: moneyGift.qr_code_url ? '24px' : '0',
            }}
          >
          <p
            style={{
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-color, #2C1810)',
              letterSpacing: '2px',
              margin: 0,
            }}
          >
            {moneyGift.account_number}
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
              handleCopy();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 40%, transparent)',
              borderRadius: '4px',
              background: copied
                ? 'color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)'
                : 'transparent',
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '1px',
              textTransform: 'uppercase' as const,
              color: 'var(--secondary-color, #D4AF37)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ...getActionButtonStyle(templateId, 'outline'),
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <EditableCopy as="span" value={copy('money_gift.copied', 'Disalin')} copyKey="money_gift.copied" editMode={previewEditMode} />
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                <EditableCopy as="span" value={copy('money_gift.copy', 'Salin')} copyKey="money_gift.copy" editMode={previewEditMode} />
              </>
            )}
          </motion.button>
          </div>

          {moneyGift.qr_code_url && moneyGift.qr_code_url.length > 0 && (
            <div>
              <div
                style={{
                  width: '60px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
                  margin: '0 auto 20px',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--primary-color, #8B6F4E)',
                  marginBottom: '12px',
                }}
              >
                <EditableCopy as="span" value={copy('money_gift.qr_label', 'Imbas Kod QR')} copyKey="money_gift.qr_label" editMode={previewEditMode} />
              </p>
              <img
                src={moneyGift.qr_code_url}
                alt="QR Code"
                style={{
                  width: '160px',
                  height: '160px',
                  objectFit: 'contain',
                  border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 20%, transparent)',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              />
            </div>
          )}
        </TemplateSectionShell>
      </motion.div>
    </section>
  );
}
