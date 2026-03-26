import { useEffect } from 'react';
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
  Loader,
  Center,
} from '@mantine/core';
import {
  IconCircleCheck,
  IconArrowRight,
  IconSparkles,
} from '@tabler/icons-react';
import { cubicBezier, motion, type Variants } from 'framer-motion';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/authStore';
import type { Plan } from '../types';

// ---------------------------------------------------------------------------
// Theme constants (matching new landing page)
// ---------------------------------------------------------------------------
const NAVY = '#0A1628';
const NAVY_LIGHT = '#1E3A5F';
const GOLD = '#D4AF37';
const GOLD_WARM = '#C8A951';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#F8FAFC';
const SLATE_200 = '#E2E8F0';
const SLATE_500 = '#64748B';
const SLATE_700 = '#334155';

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
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: softReveal,
    },
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

// ---------------------------------------------------------------------------
// Plan Card
// ---------------------------------------------------------------------------
function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isPopular = plan.sort_order === 1; // Basic plan is popular
  const isFree = plan.price_myr === 0;

  const handleSelect = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/dashboard/checkout?plan=${plan.id}`);
    }
  };

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
          border: isPopular
            ? `2px solid ${GOLD}`
            : `1px solid ${SLATE_200}`,
          background: isPopular ? WHITE : OFF_WHITE,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: isPopular
            ? '0 24px 48px rgba(10,22,40,0.1)'
            : 'none',
          transform: isPopular ? 'scale(1.03)' : 'none',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isPopular) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(10,22,40,0.08)';
          }
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isPopular) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {isPopular && (
          <Badge
            variant="filled"
            size="sm"
            leftSection={<IconSparkles size={12} />}
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
            Popular
          </Badge>
        )}

        <Text
          fw={600}
          size="lg"
          mb={4}
          style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}
        >
          {plan.name_ms}
        </Text>

        <Text size="sm" c="dimmed" mb={16}>
          {plan.description}
        </Text>

        <Group align="baseline" gap={4} mb={8}>
          <Text
            fw={700}
            style={{
              fontSize: 42,
              fontFamily: "'Playfair Display', serif",
              color: NAVY,
              lineHeight: 1,
            }}
          >
            {isFree ? 'RM0' : `RM${plan.price_myr}`}
          </Text>
          {!isFree && (
            <Text size="sm" style={{ color: SLATE_500 }}>
              / kad
            </Text>
          )}
        </Group>

        <Text size="xs" mb={24} style={{ color: SLATE_500 }}>
          Aktif selama {plan.duration_days} hari
        </Text>

        <Divider mb={20} color={SLATE_200} />

        <List
          spacing={12}
          icon={<IconCircleCheck size={18} color={GOLD} stroke={1.5} />}
          style={{ flex: 1 }}
        >
          {plan.features.map((feature) => (
            <List.Item key={feature}>
              <Text size="sm" style={{ color: SLATE_700 }}>
                {feature}
              </Text>
            </List.Item>
          ))}
        </List>

        <Button
          fullWidth
          mt={28}
          radius="xl"
          size="md"
          rightSection={<IconArrowRight size={16} />}
          onClick={handleSelect}
          style={
            isPopular
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
          Pilih Pelan Ini
        </Button>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Pricing Page
// ---------------------------------------------------------------------------
export default function PricingPage() {
  const navigate = useNavigate();
  const { plans, loading, fetchPlans } = usePaymentStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <Box style={{ background: OFF_WHITE, minHeight: '100vh' }}>
      {/* Navbar */}
      <Box
        component="nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: `1px solid ${SLATE_200}`,
        }}
      >
        <Container size="lg">
          <Group justify="space-between" h={64}>
            <Text
              fw={700}
              size="xl"
              onClick={() => navigate('/')}
              style={{
                cursor: 'pointer',
                fontFamily: "'Playfair Display', serif",
                color: NAVY,
              }}
            >
              Jemput
            </Text>
            <Group gap="sm">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => navigate('/')}
                style={{ color: SLATE_700, fontWeight: 500 }}
              >
                Laman Utama
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
                }}
              >
                Log Masuk
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        py={80}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.04) 0%, transparent 60%),
            ${OFF_WHITE}
          `,
        }}
      >
        <Container size="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <Stack align="center" gap={8} mb={48}>
              <Title
                order={1}
                ta="center"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  color: NAVY,
                }}
              >
                Pelan & Harga
              </Title>
              {/* Gold accent line */}
              <Box
                style={{
                  width: 48,
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${GOLD_WARM}, ${GOLD})`,
                }}
              />
              <Text ta="center" maw={560} size="lg" mt={8} style={{ color: SLATE_500 }}>
                Pilih pelan yang sesuai untuk majlis anda
              </Text>
            </Stack>
          </motion.div>

          {loading ? (
            <Center py={60}>
              <Loader color={NAVY_LIGHT} />
            </Center>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, md: 3 }}
              spacing={28}
              style={{ alignItems: 'stretch' }}
            >
              {plans
                .filter((p) => p.is_active)
                .map((plan, i) => (
                  <PlanCard key={plan.id} plan={plan} index={i} />
                ))}
            </SimpleGrid>
          )}

          {/* Bottom note */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
          >
            <Box
              mt={48}
              p={24}
              style={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 12,
                border: `1px solid ${SLATE_200}`,
                textAlign: 'center',
              }}
            >
              <Text size="sm" style={{ color: SLATE_500, lineHeight: 1.7 }}>
                Bayaran sekali sahaja. Kad anda aktif selama tempoh yang
                dipilih. Boleh dilanjutkan selepas tamat.
              </Text>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
