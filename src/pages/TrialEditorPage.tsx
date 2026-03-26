import { Box, Button, Container, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import InvitationEditor from '../components/dashboard/InvitationEditor';
import Logo from '../components/common/Logo';

export default function TrialEditorPage() {
  return (
    <Box style={{ minHeight: '100vh', background: '#FDF8F0' }}>
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(253,248,240,0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(176,141,91,0.14)',
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
