import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Logo from './Logo';

const GOLD = '#B08D5B';
const CREAM = '#FDF8F0';
const DARK = '#2C1810';
const DARK_MID = '#4A3B2D';

interface PublicInfoPageLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function PublicInfoPageLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: PublicInfoPageLayoutProps) {
  const navigate = useNavigate();

  return (
    <Box style={{ minHeight: '100vh', background: CREAM }}>
      <Box
        component="nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(253,248,240,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(176,141,91,0.12)',
        }}
      >
        <Container size="lg">
          <Group justify="space-between" h={64}>
            <Box onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <Logo size="sm" color={GOLD} />
            </Box>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/')}
              style={{ color: GOLD, fontWeight: 600 }}
            >
              Kembali
            </Button>
          </Group>
        </Container>
      </Box>

      <Box
        py={72}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%), ${CREAM}`,
        }}
      >
        <Container size="md">
          <Stack gap={10} mb={36} ta="center">
            <Text
              tt="uppercase"
              fw={700}
              size="xs"
              style={{ letterSpacing: '0.2em', color: GOLD }}
            >
              {eyebrow}
            </Text>
            <Title
              order={1}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: DARK,
              }}
            >
              {title}
            </Title>
            <Text size="md" style={{ color: DARK_MID, lineHeight: 1.8 }}>
              {subtitle}
            </Text>
          </Stack>

          <Box
            style={{
              background: 'rgba(255,255,255,0.78)',
              border: '1px solid rgba(176,141,91,0.14)',
              borderRadius: 20,
              padding: '32px',
              boxShadow: '0 24px 80px rgba(44,24,16,0.06)',
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
