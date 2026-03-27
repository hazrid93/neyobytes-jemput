import { Box, Button, Container, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import InvitationEditor from '../components/dashboard/InvitationEditor';
import Logo from '../components/common/Logo';
import { OFF_WHITE, SLATE_200 } from '../constants/colors';

export default function TrialEditorPage() {
  return (
    <Box style={{ minHeight: '100vh', background: OFF_WHITE }}>
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(248,250,252,0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${SLATE_200}`,
        }}
      >
        <Container size="xl" py="sm">
          <Group justify="space-between" align="center">
            <Box component={Link} to="/" style={{ textDecoration: 'none' }}>
              <Logo size="sm" />
            </Box>

            <Button
              component={Link}
              to="/"
              variant="subtle"
              color="gray"
              leftSection={<IconArrowLeft size={16} />}
            >
              Kembali ke Dashboard
            </Button>
          </Group>
        </Container>
      </Box>

      <InvitationEditor trialMode />
    </Box>
  );
}
