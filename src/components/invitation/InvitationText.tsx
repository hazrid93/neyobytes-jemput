import { motion } from 'framer-motion';
import type { Invitation } from '../../types';
import TemplateSectionShell from './TemplateSectionShell';

interface InvitationTextProps {
  invitation: Invitation;
  templateId: string;
}

export default function InvitationText({ invitation, templateId }: InvitationTextProps) {
  return (
    <section
      style={{
        padding: '40px 24px 60px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Groom's parents */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '24px' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--primary-color, #8B6F4E)',
            marginBottom: '8px',
            opacity: 0.8,
          }}
        >
          Pihak Lelaki
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--text-color, #2C1810)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {invitation.groom_parent_names}
        </p>
      </motion.div>

      {/* Decorative separator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          margin: '20px 0',
          color: 'var(--secondary-color, #D4AF37)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37))',
          }}
        />
        <span style={{ fontSize: '14px' }}>&#10022;</span>
        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, var(--secondary-color, #D4AF37), transparent)',
          }}
        />
      </motion.div>

      {/* Bride's parents */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ marginBottom: '36px' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body, "Poppins"), sans-serif',
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--primary-color, #8B6F4E)',
            marginBottom: '8px',
            opacity: 0.8,
          }}
        >
          Pihak Perempuan
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display, "Playfair Display"), serif',
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--text-color, #2C1810)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {invitation.bride_parent_names}
        </p>
      </motion.div>

      {/* Invitation text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ position: 'relative' }}
      >
        <TemplateSectionShell templateId={templateId} padding="30px 24px">
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-color, #FDF8F0)',
              padding: '0 12px',
              color: 'var(--secondary-color, #D4AF37)',
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontSize: '24px',
              lineHeight: 1,
            }}
          >
            &#8220;
          </span>
          <p
            style={{
              fontFamily: 'var(--font-body, "Poppins"), sans-serif',
              fontSize: '13px',
              lineHeight: 1.9,
              color: 'var(--text-color, #2C1810)',
              margin: 0,
              fontWeight: 300,
            }}
          >
            {invitation.invitation_text}
          </p>
          <span
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-color, #FDF8F0)',
              padding: '0 12px',
              color: 'var(--secondary-color, #D4AF37)',
              fontFamily: 'var(--font-display, "Playfair Display"), serif',
              fontSize: '24px',
              lineHeight: 1,
            }}
          >
            &#8221;
          </span>
        </TemplateSectionShell>
      </motion.div>
    </section>
  );
}
