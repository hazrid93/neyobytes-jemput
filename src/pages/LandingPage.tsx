import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  Badge,
  List,
  Divider,
  Box,
  Anchor,
  Burger,
  Drawer,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBolt,
  IconPalette,
  IconCalendarEvent,
  IconCash,
  IconShare,
  IconChartBar,
  IconCircleCheck,
  IconArrowRight,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
  IconClipboardList,
  IconEdit,
  IconUsers,
  IconStarFilled,
  IconStar,
  IconX,
  IconDeviceMobile,
  IconMusic,
  IconPhoto,
  IconMapPin,
  IconHeart,
  IconChevronRight,
} from '@tabler/icons-react';
import { cubicBezier, motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Logo from '../components/common/Logo';
import { fetchPublicSiteSettings } from '../lib/site-settings';
import type { SiteSettings } from '../types';
import { NAVY, NAVY_MID, NAVY_LIGHT, BLUE, BLUE_LIGHT, GOLD, GOLD_WARM, GOLD_PALE, WHITE, OFF_WHITE, SLATE_100, SLATE_200, SLATE_500, SLATE_700 } from '../constants/colors';

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------
const softReveal = cubicBezier(0.25, 0.46, 0.45, 0.94);
const quickReveal = cubicBezier(0.16, 1, 0.3, 1);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: softReveal },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: quickReveal },
  }),
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: softReveal } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: softReveal } },
};

// ---------------------------------------------------------------------------
// Section helpers
// ---------------------------------------------------------------------------
function SectionTitle({
  children,
  sub,
  light,
  align = 'center',
}: {
  children: React.ReactNode;
  sub?: string;
  light?: boolean;
  align?: 'center' | 'left';
}) {
  return (
    <Stack align={align} gap={8} mb={48}>
      <Title
        order={2}
        ta={align}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
          color: light ? WHITE : NAVY,
          fontWeight: 700,
        }}
      >
        {children}
      </Title>
      {/* Gold accent line */}
      <Group gap={12} justify={align === 'center' ? 'center' : 'flex-start'}>
        <Box
          style={{
            width: 48,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_PALE})`,
          }}
        />
      </Group>
      {sub && (
        <Text
          ta={align}
          maw={560}
          size="md"
          style={{
            color: light ? 'rgba(255,255,255,0.65)' : SLATE_500,
            lineHeight: 1.7,
          }}
        >
          {sub}
        </Text>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// NAVBAR (fixed, glassmorphism, mobile hamburger)
// ---------------------------------------------------------------------------
function Navbar() {
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Ciri-ciri', href: '#features' },
    { label: 'Rekaan', href: '#showcase' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Testimoni', href: '#testimonials' },
  ];

  return (
    <>
      <Box
        component="nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
          borderBottom: scrolled ? `1px solid ${SLATE_200}` : '1px solid transparent',
          transition: 'all 0.35s ease',
        }}
      >
        <Container size="lg">
          <Group justify="space-between" h={72}>
            <Box onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <Logo size="sm" color={scrolled ? NAVY : WHITE} />
            </Box>

            {/* Desktop nav */}
            <Group gap={32} visibleFrom="sm">
              {navLinks.map((link) => (
                <Anchor
                  key={link.href}
                  href={link.href}
                  size="sm"
                  fw={500}
                  underline="never"
                  style={{
                    color: scrolled ? SLATE_700 : 'rgba(255,255,255,0.85)',
                    transition: 'color 0.2s ease',
                    letterSpacing: '0.01em',
                  }}
                >
                  {link.label}
                </Anchor>
              ))}
            </Group>

            <Group gap="sm" visibleFrom="sm">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => navigate('/login')}
                style={{
                  color: scrolled ? NAVY_LIGHT : 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                }}
              >
                Log Masuk
              </Button>
              <Button
                size="sm"
                radius="xl"
                onClick={() => navigate('/login')}
                style={{
                  background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                  border: 'none',
                  fontWeight: 600,
                  color: NAVY,
                  boxShadow: '0 2px 12px rgba(212,175,55,0.3)',
                }}
              >
                Daftar Percuma
              </Button>
            </Group>

            {/* Mobile burger */}
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              color={scrolled ? NAVY : WHITE}
              size="sm"
            />
          </Group>
        </Container>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="280px"
        withCloseButton={false}
        zIndex={300}
        styles={{
          body: { padding: 0 },
          content: { background: NAVY },
        }}
      >
        <Box p="lg">
          <Group justify="space-between" mb={32}>
            <Logo size="sm" color={WHITE} />
            <ActionIcon variant="subtle" onClick={close}>
              <IconX size={20} color="rgba(255,255,255,0.7)" />
            </ActionIcon>
          </Group>
          <Stack gap={24}>
            {navLinks.map((link) => (
              <Anchor
                key={link.href}
                href={link.href}
                onClick={close}
                size="lg"
                fw={500}
                underline="never"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                {link.label}
              </Anchor>
            ))}
            <Divider color="rgba(255,255,255,0.1)" />
            <Button
              fullWidth
              variant="subtle"
              size="md"
              onClick={() => { close(); navigate('/login'); }}
              style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}
            >
              Log Masuk
            </Button>
            <Button
              fullWidth
              size="md"
              radius="xl"
              onClick={() => { close(); navigate('/login'); }}
              style={{
                background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                border: 'none',
                fontWeight: 600,
                color: NAVY,
              }}
            >
              Daftar Percuma
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

// ---------------------------------------------------------------------------
// HERO — Full-bleed dark navy, bold statement, parallax card preview
// ---------------------------------------------------------------------------
function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <Box
      ref={heroRef}
      component="section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse 80% 50% at 20% 80%, rgba(30,58,95,0.6) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(37,99,235,0.15) 0%, transparent 50%),
          linear-gradient(160deg, ${NAVY} 0%, ${NAVY_MID} 60%, ${NAVY_LIGHT} 100%)
        `,
      }}
    >
      {/* Geometric grid pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Floating gold accent dots */}
      <Box
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: GOLD,
          opacity: 0.4,
          boxShadow: `0 0 20px ${GOLD}`,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '8%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: GOLD_PALE,
          opacity: 0.3,
          boxShadow: `0 0 16px ${GOLD_PALE}`,
        }}
      />

      <Container size="xl" style={{ position: 'relative', zIndex: 1, paddingTop: 100, paddingBottom: 80 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} style={{ alignItems: 'center' }}>
          {/* Left: text content */}
          <Stack gap={0}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <Badge
                size="lg"
                radius="xl"
                variant="outline"
                style={{
                  borderColor: 'rgba(212,175,55,0.4)',
                  color: GOLD,
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  marginBottom: 24,
                }}
              >
                Kad Kahwin Digital #1 Malaysia
              </Badge>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <Title
                order={1}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
                  fontWeight: 800,
                  color: WHITE,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Undangan Digital
                <br />
                <Text
                  component="span"
                  inherit
                  style={{
                    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_PALE} 50%, ${GOLD_WARM} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  yang Memukau
                </Text>
              </Title>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <Text
                mt={20}
                size="lg"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.75,
                  maxWidth: 480,
                  fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
                }}
              >
                Cipta kad kahwin digital yang elegan dalam masa 5 minit.
                10 rekaan premium, RSVP pintar, Salam Kaut Digital &mdash;
                sempurna untuk pasangan moden Malaysia.
              </Text>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
              <Group mt={36} gap="md">
                <Button
                  size="lg"
                  radius="xl"
                  rightSection={<IconArrowRight size={18} />}
                  onClick={() => navigate('/login')}
                  style={{
                    background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '0 36px',
                    height: 54,
                    color: NAVY,
                    boxShadow: `0 4px 24px rgba(212,175,55,0.35)`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,55,0.5)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,175,55,0.35)';
                  }}
                >
                  Cipta Kad Percuma
                </Button>
                <Button
                  size="lg"
                  radius="xl"
                  variant="outline"
                  onClick={() => navigate('/cuba')}
                  style={{
                    borderColor: 'rgba(255,255,255,0.25)',
                    color: WHITE,
                    fontWeight: 500,
                    height: 54,
                    padding: '0 32px',
                    backdropFilter: 'blur(8px)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  Cuba Sekarang
                </Button>
              </Group>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
              <Group mt={40} gap={32}>
                <Stack gap={2}>
                  <Text fw={700} size="xl" style={{ color: WHITE }}>2,000+</Text>
                  <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Pasangan</Text>
                </Stack>
                <Box style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
                <Stack gap={2}>
                  <Text fw={700} size="xl" style={{ color: WHITE }}>10</Text>
                  <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Rekaan Premium</Text>
                </Stack>
                <Box style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
                <Stack gap={2}>
                  <Text fw={700} size="xl" style={{ color: WHITE }}>5 min</Text>
                  <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Masa Cipta</Text>
                </Stack>
              </Group>
            </motion.div>
          </Stack>

          {/* Right: Miniature invitation card preview */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div style={{ y: cardY, rotate: cardRotate }}>
              <InvitationPreviewCard />
            </motion.div>
          </motion.div>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Miniature Invitation Preview Card (pure CSS/SVG, no images)
// ---------------------------------------------------------------------------
function InvitationPreviewCard() {
  return (
    <Box
      style={{
        width: 300,
        maxWidth: '85vw',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: `
          0 32px 64px rgba(0,0,0,0.4),
          0 0 0 1px rgba(212,175,55,0.15),
          inset 0 1px 0 rgba(255,255,255,0.05)
        `,
        background: '#FDF8F0',
        position: 'relative',
      }}
    >
      {/* Songket-style header pattern */}
      <Box
        style={{
          height: 180,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,175,55,0.15) 0%, transparent 60%),
            linear-gradient(180deg, #FDF8F0 0%, #F5E6D3 100%)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Geometric songket pattern */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
          viewBox="0 0 300 180"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 40} y1="0" x2={i * 40 + 20} y2="180" stroke="#8B6F4E" strokeWidth="0.5" />
              <line x1={i * 40 + 20} y1="0" x2={i * 40} y2="180" stroke="#8B6F4E" strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Gold flourish */}
        <svg width="60" height="24" viewBox="0 0 60 24" fill="none" style={{ marginBottom: 8, opacity: 0.5 }}>
          <path d="M0 12C8 12 12 4 20 4C24 4 27 6 28 8" stroke="#D4AF37" strokeWidth="1" />
          <path d="M60 12C52 12 48 4 40 4C36 4 33 6 32 8" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="30" cy="6" r="2" fill="#D4AF37" opacity="0.4" />
        </svg>

        <Text
          style={{
            fontFamily: "'Amiri', serif",
            fontSize: 13,
            color: '#8B6F4E',
            opacity: 0.7,
            letterSpacing: '0.05em',
          }}
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
        <Text
          mt={8}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 11,
            color: '#8B6F4E',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Walimatul Urus
        </Text>
        <Text
          mt={10}
          fw={700}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: '#2C1810',
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          Aisyah &amp; Ahmad
        </Text>
      </Box>

      {/* Card body */}
      <Box p={20} style={{ textAlign: 'center' }}>
        <Group justify="center" gap={8} mb={12}>
          <Box style={{ width: 24, height: 1, background: '#D4AF37', opacity: 0.4 }} />
          <Text style={{ fontSize: 10, color: '#D4AF37', opacity: 0.6 }}>&#10047;</Text>
          <Box style={{ width: 24, height: 1, background: '#D4AF37', opacity: 0.4 }} />
        </Group>

        <Text size="xs" style={{ color: '#4A3B2D', lineHeight: 1.6 }}>
          Dengan penuh kesyukuran, kami menjemput Dato&apos;/Datin/Tuan/Puan ke majlis perkahwinan anak kami.
        </Text>

        <Box
          mt={16}
          p={12}
          style={{
            background: 'rgba(212,175,55,0.06)',
            borderRadius: 12,
            border: '1px solid rgba(212,175,55,0.12)',
          }}
        >
          <Text fw={600} size="xs" style={{ color: '#2C1810' }}>
            Sabtu, 15 Mac 2026
          </Text>
          <Text size="xs" style={{ color: '#4A3B2D', opacity: 0.7 }}>
            11:00 AM &ndash; 4:00 PM
          </Text>
          <Text size="xs" mt={4} style={{ color: '#4A3B2D', opacity: 0.7 }}>
            Dewan Seri Endon, Putrajaya
          </Text>
        </Box>

        <Group justify="center" gap={8} mt={16}>
          <Box
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: `linear-gradient(135deg, #8B6F4E, #D4AF37)`,
              color: '#FDF8F0',
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            RSVP
          </Box>
          <Box
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid rgba(139,111,78,0.3)',
              color: '#8B6F4E',
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            Lokasi
          </Box>
        </Group>
      </Box>

      {/* Glow ring */}
      <Box
        style={{
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          borderRadius: 22,
          border: `1px solid rgba(212,175,55,0.2)`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// FEATURES
// ---------------------------------------------------------------------------
const features = [
  {
    icon: IconBolt,
    title: 'Mudah & Pantas',
    desc: 'Cipta kad kahwin digital yang menakjubkan dalam masa 5 minit sahaja. Tiada kemahiran reka bentuk diperlukan.',
    color: BLUE,
  },
  {
    icon: IconPalette,
    title: 'Cantik & Elegan',
    desc: 'Koleksi 10 rekaan premium yang direka khas untuk majlis perkahwinan Melayu, moden dan tradisional.',
    color: '#8B5CF6',
  },
  {
    icon: IconCalendarEvent,
    title: 'RSVP Pintar',
    desc: 'Urus senarai tetamu dengan mudah. Ketahui siapa yang hadir dan jumlah kehadiran secara automatik.',
    color: '#059669',
  },
  {
    icon: IconCash,
    title: 'Salam Kaut Digital',
    desc: 'Terima hadiah wang secara digital melalui kod QR. Mudah untuk tetamu, selamat untuk anda.',
    color: GOLD,
  },
  {
    icon: IconShare,
    title: 'Kongsi Mudah',
    desc: 'Kongsi melalui WhatsApp, pautan atau kod QR. Sampai terus ke telefon tetamu anda.',
    color: '#EC4899',
  },
  {
    icon: IconChartBar,
    title: 'Analitik',
    desc: 'Pantau siapa yang telah membuka kad dan RSVP. Rancang majlis anda dengan data yang tepat.',
    color: '#F59E0B',
  },
];

function Features() {
  return (
    <Box component="section" id="features" py={100} style={{ background: WHITE }}>
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle sub="Semua yang anda perlukan untuk mencipta undangan digital yang sempurna.">
            Ciri-ciri Istimewa
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={scaleIn}
              custom={i}
            >
              <Card
                padding={28}
                radius="lg"
                style={{
                  border: `1px solid ${SLATE_200}`,
                  background: WHITE,
                  height: '100%',
                  transition: 'all 0.35s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(10,22,40,0.08)';
                  e.currentTarget.style.borderColor = `${f.color}30`;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = SLATE_200;
                }}
              >
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${f.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <f.icon size={24} color={f.color} stroke={1.5} />
                </Box>
                <Text
                  fw={600}
                  size="lg"
                  mb={8}
                  style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}
                >
                  {f.title}
                </Text>
                <Text size="sm" style={{ color: SLATE_500, lineHeight: 1.7 }}>
                  {f.desc}
                </Text>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// TEMPLATE SHOWCASE — Miniature preview cards of each theme
// ---------------------------------------------------------------------------
const showcaseTemplates = [
  {
    name: 'Songket Emas',
    desc: 'Tenunan emas tradisional',
    colors: ['#8B6F4E', '#D4AF37', '#FDF8F0'],
    pattern: 'songket',
  },
  {
    name: 'Sakura Pink',
    desc: 'Kelopak sakura romantis',
    colors: ['#C77B8B', '#E8A0B0', '#FFF5F7'],
    pattern: 'floral',
  },
  {
    name: 'Batik Nusantara',
    desc: 'Motif batik biru & emas',
    colors: ['#1B3A5C', '#C9A96E', '#F0EDE6'],
    pattern: 'batik',
  },
  {
    name: 'Seni Islamik',
    desc: 'Corak geometri Islam',
    colors: ['#1A5E4A', '#C5A55A', '#F5F2EC'],
    pattern: 'islamic',
  },
  {
    name: 'Moden Minimalis',
    desc: 'Bersih dan kontemporari',
    colors: ['#333333', '#888888', '#FFFFFF'],
    pattern: 'minimal',
  },
  {
    name: 'Malam Berkilau',
    desc: 'Gelap & kilauan emas',
    colors: ['#C9A96E', '#D4AF37', '#1A1A2E'],
    pattern: 'glamour',
  },
];

function TemplatePreviewMini({ name, desc, colors, pattern }: typeof showcaseTemplates[number]) {
  const [primary, secondary, bg] = colors;
  const isDark = bg === '#1A1A2E';
  const textColor = isDark ? '#F0E6D3' : (pattern === 'batik' ? '#0D1F33' : '#2C1810');

  return (
    <Box
      style={{
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        background: bg,
        border: isDark ? '1px solid rgba(201,169,110,0.2)' : `1px solid ${secondary}20`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        transition: 'all 0.35s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
      }}
    >
      {/* Mini card header */}
      <Box p={16} style={{ textAlign: 'center' }}>
        <svg width="40" height="12" viewBox="0 0 40 12" fill="none" style={{ opacity: 0.5, marginBottom: 6 }}>
          <path d="M0 6C6 6 9 2 14 2C17 2 19 3 20 5" stroke={secondary} strokeWidth="0.8" />
          <path d="M40 6C34 6 31 2 26 2C23 2 21 3 20 5" stroke={secondary} strokeWidth="0.8" />
        </svg>
        <Text
          fw={600}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 14,
            color: textColor,
            lineHeight: 1.2,
          }}
        >
          Nama &amp; Nama
        </Text>
        <Text size="xs" mt={4} style={{ color: textColor, opacity: 0.5 }}>
          15.03.2026
        </Text>
        <Box
          mt={8}
          style={{
            height: 24,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 8, color: bg, fontWeight: 600, letterSpacing: '0.1em' }}>RSVP</Text>
        </Box>
      </Box>

      {/* Template label */}
      <Box
        px={16}
        py={10}
        style={{
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : `${secondary}15`}`,
          background: isDark ? 'rgba(255,255,255,0.03)' : `${secondary}08`,
        }}
      >
        <Text fw={600} size="xs" style={{ color: textColor }}>
          {name}
        </Text>
        <Text size="xs" style={{ color: textColor, opacity: 0.5 }}>
          {desc}
        </Text>
      </Box>
    </Box>
  );
}

function Showcase() {
  const navigate = useNavigate();

  return (
    <Box component="section" id="showcase" py={100} style={{ background: OFF_WHITE }}>
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle sub="Pilih daripada 10 rekaan eksklusif yang direka untuk pelbagai citarasa — tradisional hingga moden.">
            Koleksi Rekaan Premium
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing={16}>
          {showcaseTemplates.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scaleIn}
              custom={i}
            >
              <TemplatePreviewMini {...t} />
            </motion.div>
          ))}
        </SimpleGrid>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
        >
          <Group justify="center" mt={40}>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              rightSection={<IconChevronRight size={16} />}
              onClick={() => navigate('/cuba')}
              style={{
                borderColor: NAVY_LIGHT,
                color: NAVY,
                fontWeight: 600,
              }}
            >
              Lihat Semua Rekaan
            </Button>
          </Group>
        </motion.div>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// HOW IT WORKS — numbered timeline
// ---------------------------------------------------------------------------
const steps = [
  {
    icon: IconClipboardList,
    num: '01',
    title: 'Daftar & Pilih Rekaan',
    desc: 'Daftar akaun percuma dan pilih daripada koleksi rekaan premium kami yang sesuai dengan tema majlis anda.',
  },
  {
    icon: IconEdit,
    num: '02',
    title: 'Isi Maklumat Majlis',
    desc: 'Masukkan butiran majlis, muat naik gambar, tetapkan muzik latar dan sesuaikan setiap elemen mengikut citarasa anda.',
  },
  {
    icon: IconUsers,
    num: '03',
    title: 'Kongsi Kepada Tetamu',
    desc: 'Terbitkan kad anda dan kongsi melalui WhatsApp, media sosial atau kod QR. Tetamu boleh RSVP terus dari kad.',
  },
];

function HowItWorks() {
  return (
    <Box component="section" py={100} style={{ background: WHITE }}>
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle sub="Tiga langkah mudah untuk mencipta kad kahwin digital anda.">
            Bagaimana Ia Berfungsi
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={40}>
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={i + 1}
            >
              <Stack align="center" ta="center" gap={16}>
                {/* Step number with ring */}
                <Box
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: `2px solid ${NAVY_LIGHT}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: WHITE,
                    position: 'relative',
                  }}
                >
                  <Text
                    fw={700}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      color: NAVY,
                    }}
                  >
                    {s.num}
                  </Text>
                  {/* Gold dot accent */}
                  <Box
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: GOLD,
                      border: `3px solid ${WHITE}`,
                    }}
                  />
                </Box>
                <Text
                  fw={600}
                  size="xl"
                  style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}
                >
                  {s.title}
                </Text>
                <Text size="sm" c="dimmed" maw={300} style={{ lineHeight: 1.7, color: SLATE_500 }}>
                  {s.desc}
                </Text>
              </Stack>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// EDITOR PREVIEW — Show what the editor looks like
// ---------------------------------------------------------------------------
function EditorPreview() {
  return (
    <Box
      component="section"
      py={100}
      style={{
        background: `linear-gradient(180deg, ${OFF_WHITE} 0%, ${WHITE} 100%)`,
      }}
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} style={{ alignItems: 'center' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={slideInLeft}
          >
            <SectionTitle
              align="left"
              sub="Editor visual yang mudah digunakan — ubah teks, warna, gambar dan susun atur seksyen dengan hanya klik dan taip."
            >
              Editor Visual
              <br />
              <Text
                component="span"
                inherit
                style={{ color: BLUE }}
              >
                yang Berkuasa
              </Text>
            </SectionTitle>

            <Stack gap={16} mt={24}>
              {[
                { icon: IconPalette, text: '10 tema premium dengan warna & fon tersendiri' },
                { icon: IconMusic, text: 'Muzik latar dan galeri gambar' },
                { icon: IconDeviceMobile, text: 'Responsif sempurna pada semua peranti' },
                { icon: IconPhoto, text: 'Muat naik gambar tanpa had saiz' },
                { icon: IconMapPin, text: 'Peta lokasi interaktif dengan navigasi' },
                { icon: IconHeart, text: 'Buku tetamu & ucapan daripada tetamu' },
              ].map((item) => (
                <Group key={item.text} gap={12} align="flex-start">
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${BLUE}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <item.icon size={16} color={BLUE} stroke={1.5} />
                  </Box>
                  <Text size="sm" style={{ color: SLATE_700, lineHeight: 1.6 }}>
                    {item.text}
                  </Text>
                </Group>
              ))}
            </Stack>
          </motion.div>

          {/* Simulated editor screenshot */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={slideInRight}
          >
            <Box
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 32px 64px rgba(10,22,40,0.12), 0 0 0 1px rgba(10,22,40,0.06)',
                background: WHITE,
              }}
            >
              {/* Browser chrome */}
              <Box
                style={{
                  height: 36,
                  background: SLATE_100,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  gap: 6,
                  borderBottom: `1px solid ${SLATE_200}`,
                }}
              >
                <Box style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                <Box style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                <Box style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
                <Box
                  ml={12}
                  style={{
                    flex: 1,
                    height: 20,
                    borderRadius: 6,
                    background: WHITE,
                    border: `1px solid ${SLATE_200}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                  }}
                >
                  <Text size="xs" style={{ color: SLATE_500, fontSize: 9 }}>
                    jemput.neyobytes.com/editor
                  </Text>
                </Box>
              </Box>

              {/* Simulated editor UI */}
              <Box style={{ display: 'flex', height: 320 }}>
                {/* Sidebar */}
                <Box
                  style={{
                    width: 140,
                    background: SLATE_100,
                    borderRight: `1px solid ${SLATE_200}`,
                    padding: '12px 8px',
                  }}
                >
                  {['Muka Depan', 'Pengantin', 'Butiran Majlis', 'RSVP', 'Galeri', 'Buku Tamu'].map(
                    (label, i) => (
                      <Box
                        key={label}
                        mb={4}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: i === 0 ? `${BLUE}15` : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 2,
                            background: i === 0 ? BLUE : SLATE_500,
                            opacity: i === 0 ? 1 : 0.3,
                          }}
                        />
                        <Text
                          size="xs"
                          style={{
                            fontSize: 9,
                            color: i === 0 ? BLUE : SLATE_500,
                            fontWeight: i === 0 ? 600 : 400,
                          }}
                        >
                          {label}
                        </Text>
                      </Box>
                    )
                  )}
                </Box>

                {/* Main editor area */}
                <Box style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Form fields */}
                  <Box>
                    <Text size="xs" style={{ color: SLATE_500, fontSize: 9, marginBottom: 3 }}>
                      Nama Pengantin Lelaki
                    </Text>
                    <Box
                      style={{
                        height: 28,
                        borderRadius: 6,
                        border: `1px solid ${SLATE_200}`,
                        background: WHITE,
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Text size="xs" style={{ color: NAVY, fontSize: 10 }}>Ahmad bin Abu</Text>
                    </Box>
                  </Box>
                  <Box>
                    <Text size="xs" style={{ color: SLATE_500, fontSize: 9, marginBottom: 3 }}>
                      Nama Pengantin Perempuan
                    </Text>
                    <Box
                      style={{
                        height: 28,
                        borderRadius: 6,
                        border: `1px solid ${SLATE_200}`,
                        background: WHITE,
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Text size="xs" style={{ color: NAVY, fontSize: 10 }}>Aisyah binti Ali</Text>
                    </Box>
                  </Box>
                  <Box>
                    <Text size="xs" style={{ color: SLATE_500, fontSize: 9, marginBottom: 3 }}>
                      Tema Rekaan
                    </Text>
                    <Group gap={4}>
                      {['#8B6F4E', '#C77B8B', '#1B3A5C', '#1A5E4A', '#333'].map((c) => (
                        <Box
                          key={c}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: c,
                            border: c === '#8B6F4E' ? `2px solid ${BLUE}` : `1px solid ${SLATE_200}`,
                          }}
                        />
                      ))}
                    </Group>
                  </Box>
                  <Box mt="auto">
                    <Box
                      style={{
                        height: 28,
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${BLUE}, ${BLUE_LIGHT})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text size="xs" style={{ color: WHITE, fontSize: 10, fontWeight: 600 }}>
                        Terbitkan Kad
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// PRICING
// ---------------------------------------------------------------------------
interface PlanProps {
  name: string;
  price: string;
  period?: string;
  badge?: string;
  features: string[];
  highlighted?: boolean;
  index: number;
}

function PlanCard({ name, price, period, badge, features: planFeatures, highlighted, index }: PlanProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={scaleIn}
      custom={index}
      style={{ height: '100%' }}
    >
      <Card
        padding={36}
        radius="lg"
        style={{
          border: highlighted ? `2px solid ${GOLD}` : `1px solid ${SLATE_200}`,
          background: highlighted ? WHITE : OFF_WHITE,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: highlighted ? '0 24px 48px rgba(10,22,40,0.1)' : 'none',
          transform: highlighted ? 'scale(1.03)' : 'none',
        }}
      >
        {badge && (
          <Badge
            variant="filled"
            size="sm"
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: 11,
              color: NAVY,
            }}
          >
            {badge}
          </Badge>
        )}

        <Text
          fw={600}
          size="lg"
          mb={4}
          style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </Text>

        <Group align="baseline" gap={4} mb={24}>
          <Text
            fw={700}
            style={{
              fontSize: 42,
              fontFamily: "'Playfair Display', serif",
              color: NAVY,
              lineHeight: 1,
            }}
          >
            {price}
          </Text>
          {period && (
            <Text size="sm" style={{ color: SLATE_500 }}>
              {period}
            </Text>
          )}
        </Group>

        <Divider mb={20} color={SLATE_200} />

        <List
          spacing={12}
          icon={<IconCircleCheck size={18} color={GOLD} stroke={1.5} />}
          style={{ flex: 1 }}
        >
          {planFeatures.map((f) => (
            <List.Item key={f}>
              <Text size="sm" style={{ color: SLATE_700 }}>
                {f}
              </Text>
            </List.Item>
          ))}
        </List>

        <Button
          fullWidth
          mt={28}
          radius="xl"
          size="md"
          onClick={() => navigate('/login')}
          style={
            highlighted
              ? {
                  background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 100%)`,
                  border: 'none',
                  fontWeight: 700,
                  color: NAVY,
                  boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
                }
              : {
                  background: 'transparent',
                  border: `1.5px solid ${NAVY_LIGHT}`,
                  color: NAVY,
                  fontWeight: 600,
                }
          }
        >
          Pilih Pelan
        </Button>
      </Card>
    </motion.div>
  );
}

const plans: Omit<PlanProps, 'index'>[] = [
  {
    name: 'Asas',
    price: 'RM29',
    period: '/ kad',
    badge: 'Popular',
    highlighted: true,
    features: [
      'Semua rekaan premium',
      'Tanpa watermark',
      'Galeri gambar',
      'Muzik latar',
      'Pemasa undur',
      'Buku tetamu',
    ],
  },
  {
    name: 'Premium',
    price: 'RM59',
    period: '/ kad',
    features: [
      'Semua ciri Asas',
      'Salam Kaut Digital',
      'Senarai hadiah (wishlist)',
      'Analitik terperinci',
      'Eksport senarai tetamu',
      'Sokongan keutamaan',
    ],
  },
];

function Pricing() {
  return (
    <Box
      component="section"
      id="pricing"
      py={100}
      style={{
        background: `linear-gradient(180deg, ${WHITE} 0%, ${OFF_WHITE} 100%)`,
      }}
    >
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle sub="Bayaran sekali sahaja. Kad aktif selama 60 hari. Boleh diperbaharui.">
            Pelan Harga
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={28} maw={700} mx="auto">
          {plans.map((p, i) => (
            <PlanCard key={p.name} {...p} index={i} />
          ))}
        </SimpleGrid>

        <Text ta="center" size="sm" mt={32} style={{ color: SLATE_500, opacity: 0.8 }}>
          Tiada bayaran tersembunyi. Tiada langganan bulanan.
        </Text>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
const testimonials = [
  {
    name: 'Nurul Aisyah & Ahmad Firdaus',
    location: 'Kuala Lumpur',
    text: 'Jemput memudahkan urusan kad kahwin kami. Rekaan yang sangat cantik dan tetamu kami semua puji! RSVP automatik jimatkan banyak masa.',
    stars: 5,
  },
  {
    name: 'Siti Khadijah & Muhammad Haziq',
    location: 'Johor Bahru',
    text: 'Kami guna pelan Premium dan memang berbaloi. Salam Kaut Digital sangat membantu. Tetamu boleh bagi hadiah tanpa perlu bawa sampul.',
    stars: 5,
  },
  {
    name: 'Farah Nabilah & Irfan Syahmi',
    location: 'Pulau Pinang',
    text: 'Saya tak sangka boleh buat kad kahwin digital secantik ini dalam masa 10 minit. Sangat mudah digunakan dan harga berpatutan!',
    stars: 5,
  },
];

function Testimonials() {
  return (
    <Box
      component="section"
      id="testimonials"
      py={100}
      style={{
        background: NAVY,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid pattern */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle light sub="Dengar apa kata pasangan yang telah menggunakan Jemput.">
            Testimoni Pelanggan
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={24}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={i + 1}
              style={{ height: '100%' }}
            >
              <Card
                padding={28}
                radius="lg"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Stars */}
                <Group gap={2} mb={16}>
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <IconStarFilled key={idx} size={14} color={GOLD} />
                  ))}
                </Group>

                <Text
                  size="sm"
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    flex: 1,
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </Text>

                <Divider my={16} color="rgba(255,255,255,0.08)" />

                <Group gap={10}>
                  {/* Avatar */}
                  <Box
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${GOLD}40, ${GOLD_PALE}30)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconStar size={16} color={GOLD} stroke={1.5} />
                  </Box>
                  <Stack gap={0}>
                    <Text fw={600} size="sm" style={{ color: WHITE }}>
                      {t.name}
                    </Text>
                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {t.location}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// CTA Section
// ---------------------------------------------------------------------------
function CTASection() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      py={100}
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 50%),
          ${WHITE}
        `,
        position: 'relative',
      }}
    >
      <Container size="sm" style={{ textAlign: 'center' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={0}
        >
          <Title
            order={2}
            mb={16}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              color: NAVY,
              lineHeight: 1.15,
            }}
          >
            Sedia Untuk Mencipta
            <br />
            Kad Kahwin{' '}
            <Text
              component="span"
              inherit
              style={{
                background: `linear-gradient(135deg, ${GOLD_WARM}, ${GOLD})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Impian Anda?
            </Text>
          </Title>
          <Text size="md" mb={40} style={{ color: SLATE_500, lineHeight: 1.7 }}>
            Sertai ribuan pasangan Malaysia yang telah memilih Jemput
            untuk menjadikan majlis mereka lebih istimewa.
          </Text>
          <Group justify="center" gap="md">
            <Button
              size="lg"
              radius="xl"
              rightSection={<IconArrowRight size={18} />}
              onClick={() => navigate('/login')}
              style={{
                background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_LIGHT} 100%)`,
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0 40px',
                height: 56,
                color: WHITE,
                boxShadow: '0 8px 32px rgba(10,22,40,0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,22,40,0.3)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,22,40,0.2)';
              }}
            >
              Mula Sekarang — Percuma
            </Button>
            <Button
              size="lg"
              radius="xl"
              variant="outline"
              onClick={() => navigate('/cuba')}
              style={{
                borderColor: SLATE_200,
                color: NAVY,
                fontWeight: 600,
                height: 56,
                padding: '0 36px',
              }}
            >
              Cuba Editor
            </Button>
          </Group>
        </motion.div>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchPublicSiteSettings().then(setSettings);
  }, []);

  return (
    <Box
      component="footer"
      py={48}
      style={{
        background: NAVY,
        borderTop: `1px solid rgba(255,255,255,0.06)`,
      }}
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={32} mb={40}>
          {/* Brand column */}
          <Stack gap={12}>
            <Logo size="sm" color={WHITE} />
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              {settings?.company_tagline || 'Platform kad kahwin digital premium untuk pasangan Malaysia moden.'}
            </Text>
          </Stack>

          {/* Links */}
          <Stack gap={8}>
            <Text fw={600} size="sm" mb={4} style={{ color: WHITE }}>
              Pautan
            </Text>
            <Anchor href="/#features" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Ciri-ciri
            </Anchor>
            <Anchor href="/#pricing" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Harga
            </Anchor>
            <Anchor component={Link} to="/tentang-kami" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Tentang Kami
            </Anchor>
            <Anchor component={Link} to="/hubungi-kami" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Hubungi Kami
            </Anchor>
          </Stack>

          {/* Legal */}
          <Stack gap={8}>
            <Text fw={600} size="sm" mb={4} style={{ color: WHITE }}>
              Undang-undang
            </Text>
            <Anchor component={Link} to="/terma" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Terma & Syarat
            </Anchor>
            <Anchor component={Link} to="/privasi" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Dasar Privasi
            </Anchor>
            <Anchor component={Link} to="/polisi-bayaran-balik" size="sm" style={{ color: 'rgba(255,255,255,0.45)' }} underline="hover">
              Polisi Bayaran Balik
            </Anchor>
          </Stack>

          {/* Social */}
          <Stack gap={8}>
            <Text fw={600} size="sm" mb={4} style={{ color: WHITE }}>
              Ikuti Kami
            </Text>
            <Group gap={12}>
              {(settings?.instagram_url || '').trim() && (
                <Anchor href={settings?.instagram_url} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <IconBrandInstagram size={22} stroke={1.5} />
                </Anchor>
              )}
              {(settings?.facebook_url || '').trim() && (
                <Anchor href={settings?.facebook_url} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <IconBrandFacebook size={22} stroke={1.5} />
                </Anchor>
              )}
              {(settings?.x_url || '').trim() && (
                <Anchor href={settings?.x_url} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <IconBrandTwitter size={22} stroke={1.5} />
                </Anchor>
              )}
            </Group>
            <Text size="sm" mt={8} style={{ color: 'rgba(255,255,255,0.3)' }}>
              {settings?.contact_email || 'hello@jemput.neyobytes.com'}
            </Text>
          </Stack>
        </SimpleGrid>

        <Divider color="rgba(255,255,255,0.06)" />

        <Group justify="space-between" mt={24}>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            &copy; 2026 Jemput by Neyobytes. Hak cipta terpelihara.
          </Text>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Dibina dengan kasih sayang di Malaysia
          </Text>
        </Group>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// LANDING PAGE — compose all sections
// ---------------------------------------------------------------------------
export default function LandingPage() {
  return (
    <Box style={{ background: WHITE, overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <HowItWorks />
      <EditorPreview />
      <Pricing />
      <Testimonials />
      <CTASection />
      <Footer />
    </Box>
  );
}
