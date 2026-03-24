import { motion } from 'framer-motion';

export default function IslamicGreeting() {
  return (
    <section
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Top ornament */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        style={{
          color: 'var(--secondary-color, #D4AF37)',
          fontSize: '20px',
          marginBottom: '24px',
          letterSpacing: '6px',
          opacity: 0.6,
        }}
      >
        &#10041;
      </motion.div>

      {/* Arabic greeting */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-arabic, "Amiri"), serif',
          fontSize: 'clamp(18px, 5vw, 24px)',
          color: 'var(--secondary-color, #D4AF37)',
          lineHeight: 1.8,
          direction: 'rtl',
          margin: '0 0 12px',
        }}
      >
        السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
      </motion.p>

      {/* Romanized */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          fontFamily: 'var(--font-display, "Playfair Display"), serif',
          fontSize: 'clamp(14px, 3.5vw, 17px)',
          fontStyle: 'italic',
          color: 'var(--text-color, #2C1810)',
          margin: '0 0 8px',
          lineHeight: 1.6,
        }}
      >
        Assalamualaikum Warahmatullahi Wabarakatuh
      </motion.p>

      {/* Translation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          fontFamily: 'var(--font-body, "Poppins"), sans-serif',
          fontSize: '11px',
          color: 'var(--primary-color, #8B6F4E)',
          letterSpacing: '1px',
          margin: 0,
          opacity: 0.8,
        }}
      >
        Semoga Sejahtera Ke Atas Kamu Serta Rahmat Dan Berkat-Nya
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{
          width: '100px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--secondary-color, #D4AF37), transparent)',
          margin: '28px auto 0',
        }}
      />

      {/* Bottom ornament */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 1.0 }}
        style={{
          color: 'var(--secondary-color, #D4AF37)',
          fontSize: '20px',
          marginTop: '24px',
          letterSpacing: '6px',
          opacity: 0.6,
        }}
      >
        &#10041;
      </motion.div>
    </section>
  );
}
