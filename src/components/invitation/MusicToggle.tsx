import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../stores/invitationStore';

interface MusicToggleProps {
  musicUrl?: string;
  musicType?: 'youtube' | 'direct';
}

/**
 * Extract a YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Just a raw video ID (11 chars)
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Already a plain video ID (11 alphanumeric + dash/underscore chars)
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  try {
    const parsed = new URL(url);

    // youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }

    // youtube.com/embed/VIDEO_ID or youtube.com/shorts/VIDEO_ID
    const pathMatch = parsed.pathname.match(/\/(embed|shorts|v)\/([A-Za-z0-9_-]{11})/);
    if (pathMatch) {
      return pathMatch[2];
    }
  } catch {
    // Not a valid URL
  }

  // Fallback regex for edge cases
  const fallback = url.match(/(?:v=|\/(?:embed|shorts|v)\/)([A-Za-z0-9_-]{11})/);
  return fallback ? fallback[1] : null;
}

export default function MusicToggle({ musicUrl, musicType = 'direct' }: MusicToggleProps) {
  const musicPlaying = useInvitationStore((s) => s.musicPlaying);
  const toggleMusic = useInvitationStore((s) => s.toggleMusic);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseVisible, setPulseVisible] = useState(true);
  const hasInteractedRef = useRef(false);

  // Determine if this is a YouTube URL (auto-detect if musicType not explicitly set)
  const isYouTube =
    musicType === 'youtube' ||
    (musicUrl
      ? /youtu\.?be|youtube\.com/.test(musicUrl)
      : false);

  const videoId = isYouTube && musicUrl ? extractYouTubeVideoId(musicUrl) : null;

  // Build YouTube embed URL
  const youtubeEmbedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : null;

  // Send postMessage commands to YouTube iframe
  const sendYouTubeCommand = useCallback(
    (func: string) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args: '' }),
          '*'
        );
      }
    },
    []
  );

  // --- YouTube control ---
  useEffect(() => {
    if (!isYouTube || !videoId) return;

    if (musicPlaying) {
      sendYouTubeCommand('unMute');
      sendYouTubeCommand('playVideo');
    } else {
      // If user has never interacted, just keep muted
      // If user toggled off, mute + pause
      if (hasInteractedRef.current) {
        sendYouTubeCommand('mute');
        sendYouTubeCommand('pauseVideo');
      }
    }
  }, [musicPlaying, isYouTube, videoId, sendYouTubeCommand]);

  // --- Direct audio control ---
  useEffect(() => {
    if (isYouTube || !musicUrl) return;

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
  }, [musicPlaying, musicUrl, isYouTube]);

  // Hide the attention pulse after first interaction
  useEffect(() => {
    if (musicPlaying && pulseVisible) {
      hasInteractedRef.current = true;
      setPulseVisible(false);
    }
  }, [musicPlaying, pulseVisible]);

  const handleToggle = useCallback(() => {
    hasInteractedRef.current = true;
    setPulseVisible(false);
    toggleMusic();
  }, [toggleMusic]);

  // Don't render if no music URL
  if (!musicUrl || musicUrl.length === 0) return null;

  return (
    <>
      {/* Hidden YouTube iframe */}
      {isYouTube && youtubeEmbedUrl && (
        <iframe
          ref={iframeRef}
          src={youtubeEmbedUrl}
          allow="autoplay; encrypted-media"
          style={{
            position: 'fixed',
            width: '0',
            height: '0',
            border: 'none',
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1,
          }}
          title="Background music"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  right: '56px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  background: 'rgba(44,24,16,0.85)',
                  backdropFilter: 'blur(4px)',
                  fontFamily: 'var(--font-body, "Poppins"), sans-serif',
                  fontSize: '11px',
                  color: '#FDF8F0',
                  pointerEvents: 'none',
                  letterSpacing: '0.5px',
                }}
              >
                {musicPlaying ? 'Hentikan muzik' : 'Mainkan muzik'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring to draw attention */}
          {pulseVisible && (
            <motion.div
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.5, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid var(--secondary-color, #D4AF37)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Main button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            aria-label={musicPlaying ? 'Hentikan muzik' : 'Mainkan muzik'}
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid color-mix(in srgb, var(--secondary-color, #D4AF37) 40%, transparent)',
              background: 'rgba(253,248,240,0.95)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(44,24,16,0.1)',
              padding: 0,
            }}
          >
            {musicPlaying ? (
              /* Animated equalizer bars */
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '2.5px',
                  height: '18px',
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: ['4px', '16px', '8px', '14px', '4px'],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                    style={{
                      width: '3px',
                      borderRadius: '1.5px',
                      background: 'var(--secondary-color, #D4AF37)',
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Music note icon when paused */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--secondary-color, #D4AF37)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            )}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
