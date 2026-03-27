import { motion } from 'framer-motion';
import type { WishlistItem } from '../../types';
import TemplateSectionShell from './TemplateSectionShell';
import { getCopy } from '../../lib/invitation-copy';
import EditableCopy from './EditableCopy';

interface WishlistSectionProps {
  wishlist: WishlistItem[];
  templateId: string;
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
}

export default function WishlistSection({
  wishlist,
  templateId,
  copyOverrides,
  previewEditMode = false,
}: WishlistSectionProps) {
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

  if (!wishlist.length) return null;

  return (
    <section
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
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
        <EditableCopy
          as="span"
          value={copy('wishlist.eyebrow', 'Hadiah')}
          copyKey="wishlist.eyebrow"
          editMode={previewEditMode}
        />
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
        <EditableCopy
          as="span"
          value={copy('wishlist.title', 'Senarai Hadiah')}
          copyKey="wishlist.title"
          editMode={previewEditMode}
        />
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
        <EditableCopy
          as="span"
          value={copy(
            'wishlist.description',
            'Kehadiran anda sudah cukup bermakna. Sekiranya ingin memberi hadiah, berikut adalah beberapa cadangan kami.',
          )}
          copyKey="wishlist.description"
          editMode={previewEditMode}
        />
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <TemplateSectionShell templateId={templateId} padding="20px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {wishlist.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'color-mix(in srgb, var(--accent-color, #F5E6D3) 30%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)',
                  textAlign: 'left',
                }}
              >
                {/* Gift icon */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'color-mix(in srgb, var(--secondary-color, #D4AF37) 15%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--secondary-color, #D4AF37)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                  </svg>
                </div>

                {/* Item name + link */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-color, #2C1810)',
                      margin: 0,
                      textDecoration: item.claimed ? 'line-through' : 'none',
                      opacity: item.claimed ? 0.6 : 1,
                    }}
                  >
                    {item.name}
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (previewEditMode) e.preventDefault();
                      }}
                      style={{
                        fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                        fontSize: '11px',
                        color: 'var(--secondary-color, #D4AF37)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Lihat Produk
                    </a>
                  )}
                </div>

                {/* Claimed badge */}
                {item.claimed && (
                  <span
                    style={{
                      fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                      fontSize: '9px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#40c057',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    ✓ Dituntut
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </TemplateSectionShell>
      </motion.div>
    </section>
  );
}
