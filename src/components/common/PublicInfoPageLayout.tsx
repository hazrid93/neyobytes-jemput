import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Logo from './Logo';
import { NAVY, NAVY_LIGHT, GOLD, SLATE_200, SLATE_500, OFF_WHITE } from '../../constants/colors';

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
    <Box style={{ minHeight: '100vh', background: OFF_WHITE }}>
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
            <Box onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <Logo size="sm" color={NAVY} />
            </Box>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/')}
              style={{ color: NAVY_LIGHT, fontWeight: 600 }}
            >
              Kembali
            </Button>
          </Group>
        </Container>
      </Box>

      <Box
        py={72}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.04) 0%, transparent 60%), ${OFF_WHITE}`,
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
                color: NAVY,
              }}
            >
              {title}
            </Title>
            <Text size="md" style={{ color: SLATE_500, lineHeight: 1.8 }}>
              {subtitle}
            </Text>
          </Stack>

          <Box
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: `1px solid ${SLATE_200}`,
              borderRadius: 20,
              padding: '32px',
              boxShadow: '0 24px 80px rgba(10,22,40,0.04)',
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
