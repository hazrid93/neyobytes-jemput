import { motion } from 'framer-motion';
import type { GalleryImage } from '../../types';
import { getGalleryFrameStyle } from '../../lib/template-ui';
import EditableCopy from './EditableCopy';
import { getCopy } from '../../lib/invitation-copy';

interface GallerySectionProps {
  images: GalleryImage[];
  layout?: 'carousel' | 'grid' | 'masonry';
  templateId: string;
  copyOverrides?: Record<string, string>;
  previewEditMode?: boolean;
}

export default function GallerySection({
  images,
  layout = 'carousel',
  templateId,
  copyOverrides,
  previewEditMode = false,
}: GallerySectionProps) {
  const hasImages = images && images.length > 0;
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const copy = (key: string, fallback: string) => getCopy(copyOverrides, key, fallback);

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
        <EditableCopy
          as="span"
          value={copy('gallery.eyebrow', 'Galeri')}
          copyKey="gallery.eyebrow"
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
          marginBottom: '28px',
        }}
      >
        <EditableCopy
          as="span"
          value={copy('gallery.title', 'Kenangan Bersama')}
          copyKey="gallery.title"
          editMode={previewEditMode}
        />
      </motion.h3>

      {hasImages ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: layout === 'carousel' ? 'flex' : layout === 'grid' ? 'grid' : 'grid',
            gridTemplateColumns: layout === 'grid' ? 'repeat(2, minmax(0, 1fr))' : layout === 'masonry' ? 'repeat(2, minmax(0, 1fr))' : undefined,
            gap: '10px',
            overflowX: layout === 'carousel' ? 'auto' : 'visible',
            scrollSnapType: layout === 'carousel' ? 'x mandatory' : undefined,
            WebkitOverflowScrolling: layout === 'carousel' ? 'touch' : undefined,
            paddingBottom: layout === 'carousel' ? '12px' : '0',
            scrollbarWidth: layout === 'carousel' ? 'none' : undefined,
            msOverflowStyle: layout === 'carousel' ? 'none' : undefined,
            alignItems: layout === 'masonry' ? 'start' : undefined,
          }}
        >
          {sortedImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  flexShrink: layout === 'carousel' ? 0 : undefined,
                  width: layout === 'carousel' ? '280px' : '100%',
                  height:
                    layout === 'carousel'
                      ? '360px'
                      : layout === 'grid'
                        ? '180px'
                        : index % 3 === 0
                          ? '240px'
                          : '180px',
                  overflow: 'hidden',
                  border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 20%, transparent)',
                  scrollSnapAlign: layout === 'carousel' ? 'center' : undefined,
                  ...getGalleryFrameStyle(templateId, index),
                }}
              >
                <img
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </motion.div>
            ))}
        </motion.div>
      ) : (
        /* Beautiful placeholder */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 25%, transparent)',
            borderRadius: '4px',
            padding: '48px 24px',
            background: 'rgba(255,255,255,0.3)',
            position: 'relative',
          }}
        >
          {/* Ornamental frame corners */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
            <div
              key={pos}
              style={{
                position: 'absolute',
                [pos.includes('top') ? 'top' : 'bottom']: '12px',
                [pos.includes('left') ? 'left' : 'right']: '12px',
                width: '24px',
                height: '24px',
                borderTop: pos.includes('top') ? '1px solid var(--secondary-color, #D4AF37)' : 'none',
                borderBottom: pos.includes('bottom') ? '1px solid var(--secondary-color, #D4AF37)' : 'none',
                borderLeft: pos.includes('left') ? '1px solid var(--secondary-color, #D4AF37)' : 'none',
                borderRight: pos.includes('right') ? '1px solid var(--secondary-color, #D4AF37)' : 'none',
                opacity: 0.4,
              }}
            />
          ))}

          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--secondary-color, #D4AF37)"
            strokeWidth="1"
            style={{ opacity: 0.4, margin: '0 auto 16px', display: 'block' }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>

          <p
            style={{
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontSize: '16px',
              fontStyle: 'italic',
              color: 'var(--primary-color, #8B6F4E)',
              margin: '0 0 4px',
              opacity: 0.7,
            }}
          >
            <EditableCopy
              as="span"
              value={copy('gallery.empty_title', 'Gambar akan datang')}
              copyKey="gallery.empty_title"
              editMode={previewEditMode}
            />
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '11px',
              color: 'var(--primary-color, #8B6F4E)',
              margin: 0,
              opacity: 0.5,
            }}
          >
            <EditableCopy
              as="span"
              value={copy('gallery.empty_description', 'Nantikan koleksi foto kami')}
              copyKey="gallery.empty_description"
              editMode={previewEditMode}
            />
          </p>
        </motion.div>
      )}

      {/* Swipe hint for mobile */}
      {hasImages && layout === 'carousel' && images.length > 1 && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '10px',
            color: 'var(--primary-color, #8B6F4E)',
            marginTop: '12px',
            opacity: 0.5,
            letterSpacing: '1px',
          }}
        >
          <EditableCopy
            as="span"
            value={copy('gallery.swipe_hint', '← Leret untuk lihat lagi →')}
            copyKey="gallery.swipe_hint"
            editMode={previewEditMode}
          />
        </motion.p>
      )}

      {/* Hide scrollbar CSS */}
      <style>{`
        section div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
