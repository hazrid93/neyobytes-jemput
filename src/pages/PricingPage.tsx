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
import { motion } from 'framer-motion';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/authStore';
import type { Plan } from '../types';

// ---------------------------------------------------------------------------
// Theme constants (matching landing page)
// ---------------------------------------------------------------------------
const GOLD = '#B08D5B';
const GOLD_LIGHT = '#D4AF37';
const CREAM = '#FDF8F0';
const CREAM_ALT = '#F5E6D3';
const DARK = '#2C1810';
const DARK_MID = '#4A3B2D';

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
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
            ? `2px solid ${GOLD_LIGHT}`
            : `1px solid ${CREAM_ALT}`,
          background: isPopular ? '#fff' : CREAM,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: isPopular
            ? `0 16px 48px rgba(176,141,91,0.15)`
            : 'none',
          transform: isPopular ? 'scale(1.03)' : 'none',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isPopular) {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow =
              '0 12px 40px rgba(176,141,91,0.12)';
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
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: 11,
            }}
          >
            Popular
          </Badge>
        )}

        <Text
          fw={600}
          size="lg"
          mb={4}
          style={{ color: DARK, fontFamily: "'Playfair Display', serif" }}
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
              color: GOLD,
              lineHeight: 1,
            }}
          >
            {isFree ? 'RM0' : `RM${plan.price_myr}`}
          </Text>
          {!isFree && (
            <Text size="sm" c="dimmed">
              / kad
            </Text>
          )}
        </Group>

        <Text size="xs" c="dimmed" mb={24}>
          Aktif selama {plan.duration_days} hari
        </Text>

        <Divider mb={20} color={CREAM_ALT} />

        <List
          spacing={12}
          icon={<IconCircleCheck size={18} color={GOLD} stroke={1.5} />}
          style={{ flex: 1 }}
        >
          {plan.features.map((feature) => (
            <List.Item key={feature}>
              <Text size="sm" style={{ color: DARK_MID }}>
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
    <Box style={{ background: CREAM, minHeight: '100vh' }}>
      {/* Navbar */}
      <Box
        component="nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(253,248,240,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid rgba(176,141,91,0.1)`,
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
                color: GOLD,
              }}
            >
              Jemput
            </Text>
            <Group gap="sm">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => navigate('/')}
                style={{ color: DARK_MID, fontWeight: 500 }}
              >
                Laman Utama
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
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%),
            ${CREAM}
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
                  color: DARK,
                }}
              >
                Pelan & Harga
              </Title>
              <Group
                gap={12}
                justify="center"
                style={{ opacity: 0.5 }}
              >
                <Box
                  style={{ width: 50, height: 1, background: GOLD_LIGHT }}
                />
                <Text
                  style={{
                    color: GOLD_LIGHT,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  &#10047;
                </Text>
                <Box
                  style={{ width: 50, height: 1, background: GOLD_LIGHT }}
                />
              </Group>
              <Text ta="center" c="dimmed" maw={560} size="lg" mt={8}>
                Pilih pelan yang sesuai untuk majlis anda
              </Text>
            </Stack>
          </motion.div>

          {loading ? (
            <Center py={60}>
              <Loader color={GOLD} />
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
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 12,
                border: `1px solid ${CREAM_ALT}`,
                textAlign: 'center',
              }}
            >
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
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
