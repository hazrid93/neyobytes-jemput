import { useNavigate } from 'react-router-dom';
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
} from '@mantine/core';
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
  IconStar,
  IconStarFilled,
} from '@tabler/icons-react';
import { cubicBezier, motion, type Variants } from 'framer-motion';
import Logo from '../components/common/Logo';

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

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: quickReveal },
  }),
};

// ---------------------------------------------------------------------------
// Shared style constants
// ---------------------------------------------------------------------------
const GOLD = '#B08D5B';
const GOLD_LIGHT = '#D4AF37';
const CREAM = '#FDF8F0';
const CREAM_ALT = '#F5E6D3';
const DARK = '#2C1810';
const DARK_MID = '#4A3B2D';

// ---------------------------------------------------------------------------
// Section: SectionTitle helper
// ---------------------------------------------------------------------------
function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <Stack align="center" gap={8} mb={48}>
      <Title
        order={2}
        ta="center"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          color: DARK,
        }}
      >
        {children}
      </Title>
      {/* ornamental divider */}
      <Group gap={12} justify="center" style={{ opacity: 0.5 }}>
        <Box style={{ width: 50, height: 1, background: GOLD_LIGHT }} />
        <Text style={{ color: GOLD_LIGHT, fontSize: 14, lineHeight: 1 }}>&#10047;</Text>
        <Box style={{ width: 50, height: 1, background: GOLD_LIGHT }} />
      </Group>
      {sub && (
        <Text ta="center" c="dimmed" maw={560} size="md">
          {sub}
        </Text>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 100%, rgba(176,141,91,0.06) 0%, transparent 50%),
          ${CREAM}
        `,
      }}
    >
      {/* CSS ornamental pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              ${GOLD} 0px, ${GOLD} 1px, transparent 1px, transparent 20px
            ),
            repeating-linear-gradient(
              -45deg,
              ${GOLD} 0px, ${GOLD} 1px, transparent 1px, transparent 20px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Decorative corner flourishes */}
      <svg
        style={{ position: 'absolute', top: 24, left: 24, opacity: 0.12, width: 120, height: 120 }}
        viewBox="0 0 120 120"
        fill="none"
      >
        <path d="M0 0 C40 0 60 20 60 60 C60 20 80 0 120 0" stroke={GOLD_LIGHT} strokeWidth="1" />
        <path d="M0 0 C0 40 20 60 60 60 C20 60 0 80 0 120" stroke={GOLD_LIGHT} strokeWidth="1" />
      </svg>
      <svg
        style={{ position: 'absolute', bottom: 24, right: 24, opacity: 0.12, width: 120, height: 120, transform: 'rotate(180deg)' }}
        viewBox="0 0 120 120"
        fill="none"
      >
        <path d="M0 0 C40 0 60 20 60 60 C60 20 80 0 120 0" stroke={GOLD_LIGHT} strokeWidth="1" />
        <path d="M0 0 C0 40 20 60 60 60 C20 60 0 80 0 120" stroke={GOLD_LIGHT} strokeWidth="1" />
      </svg>

      <Container size="sm" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Logo size="lg" color={GOLD} />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <Text
            mt={24}
            size="lg"
            style={{
              color: DARK_MID,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 300,
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            }}
          >
            Kad Kahwin Digital Premium
          </Text>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <Title
            order={1}
            mt={16}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 700,
              color: DARK,
              lineHeight: 1.15,
            }}
          >
            Undangan Digital Premium
            <br />
            <Text
              component="span"
              inherit
              style={{ color: GOLD }}
            >
              untuk Majlis Impian Anda
            </Text>
          </Title>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
          <Text mt={20} size="lg" c="dimmed" maw={500} mx="auto" style={{ lineHeight: 1.7 }}>
            Cipta kad kahwin digital yang cantik, elegan dan mudah dikongsi.
            Sempurna untuk pasangan moden Malaysia.
          </Text>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
          <Group justify="center" mt={36} gap="md">
            <Button
              size="lg"
              radius="xl"
              rightSection={<IconArrowRight size={18} />}
              onClick={() => navigate('/login')}
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '0 36px',
                height: 52,
                boxShadow: '0 4px 24px rgba(176,141,91,0.3)',
              }}
            >
              Cipta Kad Percuma
            </Button>
            <Button
              size="lg"
              radius="xl"
              variant="outline"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                borderColor: GOLD,
                color: GOLD,
                fontWeight: 500,
                height: 52,
                padding: '0 32px',
              }}
            >
              Ketahui Lebih Lanjut
            </Button>
          </Group>
        </motion.div>

        {/* Trust badge */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Text mt={48} size="sm" c="dimmed" style={{ opacity: 0.6 }}>
            Dipercayai oleh 2,000+ pasangan di seluruh Malaysia
          </Text>
        </motion.div>
      </Container>
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
  },
  {
    icon: IconPalette,
    title: 'Cantik & Elegan',
    desc: 'Koleksi rekaan premium yang direka khas untuk majlis perkahwinan Melayu, moden dan tradisional.',
  },
  {
    icon: IconCalendarEvent,
    title: 'RSVP Pintar',
    desc: 'Urus senarai tetamu dengan mudah. Ketahui siapa yang hadir dan jumlah kehadiran secara automatik.',
  },
  {
    icon: IconCash,
    title: 'Salam Kaut Digital',
    desc: 'Terima hadiah wang secara digital melalui kod QR. Mudah untuk tetamu, selamat untuk anda.',
  },
  {
    icon: IconShare,
    title: 'Kongsi Mudah',
    desc: 'Kongsi melalui WhatsApp, pautan atau kod QR. Sampai terus ke telefon tetamu anda.',
  },
  {
    icon: IconChartBar,
    title: 'Analitik',
    desc: 'Pantau siapa yang telah membuka kad dan RSVP. Rancang majlis anda dengan data yang tepat.',
  },
];

function Features() {
  return (
    <Box
      component="section"
      id="features"
      py={80}
      style={{ background: '#fff' }}
    >
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

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={32}>
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
                padding={32}
                radius="lg"
                style={{
                  border: `1px solid ${CREAM_ALT}`,
                  background: CREAM,
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(176,141,91,0.12)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Box
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, rgba(176,141,91,0.1) 0%, rgba(212,175,55,0.08) 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <f.icon size={28} color={GOLD} stroke={1.5} />
                </Box>
                <Text
                  fw={600}
                  size="lg"
                  mb={8}
                  style={{ color: DARK, fontFamily: "'Playfair Display', serif" }}
                >
                  {f.title}
                </Text>
                <Text size="sm" style={{ color: DARK_MID, lineHeight: 1.7 }}>
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
// HOW IT WORKS
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
    <Box component="section" py={80} style={{ background: CREAM }}>
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
                {/* Step number circle */}
                <Box
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    border: `2px solid ${GOLD_LIGHT}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    position: 'relative',
                  }}
                >
                  <Text
                    fw={700}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      color: GOLD,
                    }}
                  >
                    {s.num}
                  </Text>
                </Box>
                {/* Connector line (not on last item) */}
                <Text
                  fw={600}
                  size="xl"
                  style={{ color: DARK, fontFamily: "'Playfair Display', serif" }}
                >
                  {s.title}
                </Text>
                <Text size="sm" c="dimmed" maw={300} style={{ lineHeight: 1.7 }}>
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
          border: highlighted ? `2px solid ${GOLD_LIGHT}` : `1px solid ${CREAM_ALT}`,
          background: highlighted ? '#fff' : CREAM,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: highlighted ? `0 16px 48px rgba(176,141,91,0.15)` : 'none',
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
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: 11,
            }}
          >
            {badge}
          </Badge>
        )}

        <Text
          fw={600}
          size="lg"
          mb={4}
          style={{ color: DARK, fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </Text>

        <Group align="baseline" gap={4} mb={24}>
          <Text
            fw={700}
            style={{
              fontSize: 42,
              fontFamily: "'Playfair Display', serif",
              color: GOLD,
              lineHeight: 1,
            }}
          >
            {price}
          </Text>
          {period && (
            <Text size="sm" c="dimmed">
              {period}
            </Text>
          )}
        </Group>

        <Divider mb={20} color={CREAM_ALT} />

        <List
          spacing={12}
          icon={<IconCircleCheck size={18} color={GOLD} stroke={1.5} />}
          style={{ flex: 1 }}
        >
          {planFeatures.map((f) => (
            <List.Item key={f}>
              <Text size="sm" style={{ color: DARK_MID }}>
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
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                  border: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(176,141,91,0.25)',
                }
              : {
                  background: 'transparent',
                  border: `1.5px solid ${GOLD}`,
                  color: GOLD,
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
    <Box component="section" py={80} style={{ background: '#fff' }}>
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle sub="Pilih pelan yang sesuai dengan keperluan majlis anda.">
            Pelan Harga
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={28} maw={700} mx="auto">
          {plans.map((p, i) => (
            <PlanCard key={p.name} {...p} index={i} />
          ))}
        </SimpleGrid>

        <Text ta="center" c="dimmed" size="sm" mt={32} style={{ opacity: 0.7 }}>
          Bayaran sekali sahaja. Kad aktif selama 60 hari. Boleh diperbaharui.
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
    <Box component="section" py={80} style={{ background: CREAM }}>
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
        >
          <SectionTitle sub="Dengar apa kata pasangan yang telah menggunakan Jemput.">
            Testimoni Pelanggan
          </SectionTitle>
        </motion.div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={28}>
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
                padding={32}
                radius="lg"
                style={{
                  background: '#fff',
                  border: `1px solid ${CREAM_ALT}`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Stars */}
                <Group gap={2} mb={16}>
                  {Array.from({ length: t.stars }).map((_, idx) => (
                    <IconStarFilled key={idx} size={16} color={GOLD_LIGHT} />
                  ))}
                </Group>

                <Text
                  size="sm"
                  style={{ color: DARK_MID, lineHeight: 1.8, fontStyle: 'italic', flex: 1 }}
                >
                  &ldquo;{t.text}&rdquo;
                </Text>

                <Divider my={16} color={CREAM_ALT} />

                <Group gap={8}>
                  {/* Avatar placeholder */}
                  <Box
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${CREAM_ALT} 0%, rgba(212,175,55,0.2) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconStar size={18} color={GOLD} stroke={1.5} />
                  </Box>
                  <Stack gap={0}>
                    <Text fw={600} size="sm" style={{ color: DARK }}>
                      {t.name}
                    </Text>
                    <Text size="xs" c="dimmed">
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
      py={80}
      style={{
        background: `linear-gradient(135deg, ${DARK} 0%, ${DARK_MID} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative pattern */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              ${GOLD_LIGHT} 0px, ${GOLD_LIGHT} 1px, transparent 1px, transparent 30px
            ),
            repeating-linear-gradient(
              -45deg,
              ${GOLD_LIGHT} 0px, ${GOLD_LIGHT} 1px, transparent 1px, transparent 30px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      <Container size="sm" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: CREAM,
            }}
          >
            Sedia Untuk Mencipta
            <br />
            Kad Kahwin Impian Anda?
          </Title>
          <Text size="md" mb={36} style={{ color: 'rgba(253,248,240,0.7)', lineHeight: 1.7 }}>
            Sertai ribuan pasangan Malaysia yang telah memilih Jemput
            untuk menjadikan majlis mereka lebih istimewa.
          </Text>
          <Button
            size="lg"
            radius="xl"
            rightSection={<IconArrowRight size={18} />}
            onClick={() => navigate('/login')}
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
              border: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0 40px',
              height: 54,
              boxShadow: '0 4px 24px rgba(176,141,91,0.4)',
            }}
          >
            Mula Sekarang — Percuma
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <Box
      component="footer"
      py={48}
      style={{
        background: DARK,
        borderTop: `1px solid rgba(176,141,91,0.15)`,
      }}
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={32} mb={40}>
          {/* Brand column */}
          <Stack gap={12}>
            <Logo size="sm" color={CREAM_ALT} />
            <Text size="sm" style={{ color: 'rgba(253,248,240,0.5)', lineHeight: 1.7 }}>
              Platform kad kahwin digital premium untuk pasangan Malaysia moden.
            </Text>
          </Stack>

          {/* Links */}
          <Stack gap={8}>
            <Text fw={600} size="sm" mb={4} style={{ color: CREAM_ALT }}>
              Pautan
            </Text>
            <Anchor href="#features" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Ciri-ciri
            </Anchor>
            <Anchor href="#" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Harga
            </Anchor>
            <Anchor href="#" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Tentang Kami
            </Anchor>
            <Anchor href="#" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Hubungi Kami
            </Anchor>
          </Stack>

          {/* Legal */}
          <Stack gap={8}>
            <Text fw={600} size="sm" mb={4} style={{ color: CREAM_ALT }}>
              Undang-undang
            </Text>
            <Anchor href="#" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Terma & Syarat
            </Anchor>
            <Anchor href="#" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Dasar Privasi
            </Anchor>
            <Anchor href="#" size="sm" style={{ color: 'rgba(253,248,240,0.5)' }} underline="hover">
              Polisi Bayaran Balik
            </Anchor>
          </Stack>

          {/* Social */}
          <Stack gap={8}>
            <Text fw={600} size="sm" mb={4} style={{ color: CREAM_ALT }}>
              Ikuti Kami
            </Text>
            <Group gap={12}>
              <Anchor href="#" style={{ color: 'rgba(253,248,240,0.5)' }}>
                <IconBrandInstagram size={22} stroke={1.5} />
              </Anchor>
              <Anchor href="#" style={{ color: 'rgba(253,248,240,0.5)' }}>
                <IconBrandFacebook size={22} stroke={1.5} />
              </Anchor>
              <Anchor href="#" style={{ color: 'rgba(253,248,240,0.5)' }}>
                <IconBrandTwitter size={22} stroke={1.5} />
              </Anchor>
            </Group>
            <Text size="sm" mt={8} style={{ color: 'rgba(253,248,240,0.35)' }}>
              hello@jemput.neyobytes.com
            </Text>
          </Stack>
        </SimpleGrid>

        <Divider color="rgba(176,141,91,0.12)" />

        <Group justify="space-between" mt={24}>
          <Text size="xs" style={{ color: 'rgba(253,248,240,0.35)' }}>
            &copy; 2026 Jemput by Neyobytes. Hak cipta terpelihara.
          </Text>
          <Text size="xs" style={{ color: 'rgba(253,248,240,0.25)' }}>
            Dibina dengan kasih sayang di Malaysia
          </Text>
        </Group>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// NAVBAR (floating)
// ---------------------------------------------------------------------------
function Navbar() {
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(253,248,240,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid rgba(176,141,91,0.1)`,
      }}
    >
      <Container size="lg">
        <Group justify="space-between" h={64}>
          <Logo size="sm" color={GOLD} />
          <Group gap="lg" visibleFrom="sm">
            <Anchor
              href="#features"
              size="sm"
              fw={500}
              style={{ color: DARK_MID }}
              underline="never"
            >
              Ciri-ciri
            </Anchor>
            <Anchor
              href="#pricing"
              size="sm"
              fw={500}
              style={{ color: DARK_MID }}
              underline="never"
            >
              Harga
            </Anchor>
            <Anchor
              href="#testimonials"
              size="sm"
              fw={500}
              style={{ color: DARK_MID }}
              underline="never"
            >
              Testimoni
            </Anchor>
          </Group>
          <Group gap="sm">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => navigate('/login')}
              style={{ color: GOLD, fontWeight: 500 }}
            >
              Log Masuk
            </Button>
            <Button
              size="sm"
              radius="xl"
              onClick={() => navigate('/login')}
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                border: 'none',
                fontWeight: 600,
              }}
            >
              Daftar
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// LANDING PAGE
// ---------------------------------------------------------------------------
export default function LandingPage() {
  return (
    <Box style={{ background: CREAM }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Box id="pricing">
        <Pricing />
      </Box>
      <Box id="testimonials">
        <Testimonials />
      </Box>
      <CTASection />
      <Footer />
    </Box>
  );
}
