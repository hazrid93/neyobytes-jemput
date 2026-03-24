import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../stores/invitationStore';

interface MusicToggleProps {
  musicUrl?: string;
}

export default function MusicToggle({ musicUrl }: MusicToggleProps) {
  const musicPlaying = useInvitationStore((s) => s.musicPlaying);
  const toggleMusic = useInvitationStore((s) => s.toggleMusic);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!musicUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    }

    if (musicPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked by browser
      });
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicPlaying, musicUrl]);

  // Don't render if no music URL
  if (!musicUrl || musicUrl.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        aria-label={musicPlaying ? 'Pause music' : 'Play music'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.4)',
          background: 'rgba(253,248,240,0.95)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 2px 12px rgba(44,24,16,0.1)',
        }}
      >
        {musicPlaying ? (
          /* Animated music notes */
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
              height: '18px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  height: ['6px', '16px', '6px'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '3px',
                  borderRadius: '2px',
                  background: 'var(--secondary-color, #D4AF37)',
                }}
              />
            ))}
          </div>
        ) : (
          /* Paused icon */
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--secondary-color, #D4AF37)"
            strokeWidth="2"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </motion.button>
    </AnimatePresence>
  );
}
