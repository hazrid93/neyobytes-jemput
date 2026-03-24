import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell,
  Burger,
  Group,
  Title,
  Text,
  NavLink,
  Button,
  Avatar,
  Menu,
  Box,
  Divider,
  Loader,
  Center,
  Stack,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconCards,
  IconPlus,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconHome,
  IconMessage2,
  IconUsers,
  IconCrown,
} from '@tabler/icons-react';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStore } from '../stores/dashboardStore';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import InvitationEditor from '../components/dashboard/InvitationEditor';
import RSVPDashboard from '../components/dashboard/RSVPDashboard';
import GuestbookManager from '../components/dashboard/GuestbookManager';
import SubscriptionPage from '../components/dashboard/SubscriptionPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="gold" />
          <Text c="dimmed">Memuatkan...</Text>
        </Stack>
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function InvitationSubPage({
  component: Component,
}: {
  component: React.ComponentType;
}) {
  const { fetchInvitationDetails } = useDashboardStore();
  const location = useLocation();
  // Extract id from the URL path
  const pathParts = location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  useEffect(() => {
    if (id) {
      fetchInvitationDetails(id);
    }
  }, [id, fetchInvitationDetails]);

  return <Component />;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const { invitations } = useDashboardStore();
  const [opened, { toggle, close }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Determine if we're in editor mode (hide sidebar)
  const isEditorMode = location.pathname.includes('/dashboard/edit/');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Kad Saya',
      icon: IconCards,
      path: '/dashboard',
      description: 'Semua kad jemputan',
    },
    {
      label: 'Langganan',
      icon: IconCrown,
      path: '/dashboard/subscription',
      description: 'Pelan & pembayaran',
    },
  ];

  const currentPath = location.pathname;

  return (
    <ProtectedRoute>
      <AppShell
        header={{ height: 60 }}
        navbar={
          isEditorMode
            ? undefined
            : {
                width: 260,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
              }
        }
        padding={isEditorMode ? 0 : 'md'}
        styles={{
          header: {
            background: 'linear-gradient(90deg, #FDF8F0, #F5E6D3)',
            borderBottom: '1px solid #E8D5B7',
          },
          navbar: {
            background: '#FDFAF5',
            borderRight: '1px solid #E8D5B7',
          },
          main: {
            background: '#FAFAFA',
          },
        }}
      >
        {/* Header */}
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="sm">
              {!isEditorMode && (
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
              )}
              {isEditorMode && (
                <Button
                  variant="subtle"
                  size="sm"
                  leftSection={<IconHome size={16} />}
                  onClick={() => navigate('/dashboard')}
                  color="dark"
                >
                  Dashboard
                </Button>
              )}
              <Title
                order={3}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: '#8B6F4E',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/dashboard')}
              >
                Jemput
              </Title>
              {!isMobile && (
                <Text size="xs" c="dimmed" mt={4}>
                  Dashboard
                </Text>
              )}
            </Group>

            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Button variant="subtle" color="dark" size="sm" rightSection={<IconChevronDown size={14} />}>
                  <Group gap="xs">
                    <Avatar
                      size="sm"
                      radius="xl"
                      color="gold"
                      variant="filled"
                    >
                      {(user?.full_name || user?.email || 'U')
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                    {!isMobile && (
                      <Text size="sm" fw={500}>
                        {user?.full_name || user?.email}
                      </Text>
                    )}
                  </Group>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Akaun</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />} disabled>
                  {user?.email}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  color="red"
                  onClick={handleSignOut}
                >
                  Log Keluar
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </AppShell.Header>

        {/* Sidebar */}
        {!isEditorMode && (
          <AppShell.Navbar p="sm">
            <Box style={{ flex: 1 }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  label={item.label}
                  description={item.description}
                  leftSection={<item.icon size={20} />}
                  active={
                    currentPath === item.path ||
                    (item.path === '/dashboard' && currentPath === '/dashboard/')
                  }
                  onClick={() => {
                    navigate(item.path);
                    close();
                  }}
                  variant="light"
                  color="gold"
                  style={{ borderRadius: 8, marginBottom: 4 }}
                />
              ))}

              {/* Show invitation sub-nav if on rsvp/guestbook page */}
              {invitations.length > 0 && (
                <>
                  <Divider my="sm" label="Kad Anda" labelPosition="left" />
                  {invitations.map((inv) => (
                    <NavLink
                      key={inv.id}
                      label={`${inv.groom_name} & ${inv.bride_name}`}
                      leftSection={<IconCards size={16} />}
                      active={currentPath.includes(inv.id)}
                      onClick={() => {
                        navigate(`/dashboard/edit/${inv.id}`);
                        close();
                      }}
                      variant="light"
                      color="gold"
                      style={{
                        borderRadius: 8,
                        marginBottom: 2,
                        fontSize: '0.85rem',
                      }}
                    >
                      <NavLink
                        label="RSVP"
                        leftSection={<IconUsers size={14} />}
                        active={currentPath === `/dashboard/rsvp/${inv.id}`}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          navigate(`/dashboard/rsvp/${inv.id}`);
                          close();
                        }}
                        variant="light"
                        color="blue"
                        style={{ borderRadius: 6 }}
                      />
                      <NavLink
                        label="Buku Tamu"
                        leftSection={<IconMessage2 size={14} />}
                        active={currentPath === `/dashboard/guestbook/${inv.id}`}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          navigate(`/dashboard/guestbook/${inv.id}`);
                          close();
                        }}
                        variant="light"
                        color="teal"
                        style={{ borderRadius: 6 }}
                      />
                    </NavLink>
                  ))}
                </>
              )}
            </Box>

            {/* Create New Button in sidebar */}
            <Box mt="auto" pt="md">
              <Divider mb="sm" />
              <Button
                fullWidth
                leftSection={<IconPlus size={18} />}
                variant="light"
                color="gold"
                onClick={() => navigate('/dashboard')}
              >
                Cipta Kad Baru
              </Button>
            </Box>
          </AppShell.Navbar>
        )}

        {/* Main Content */}
        <AppShell.Main>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="edit/:id" element={<InvitationEditor />} />
            <Route
              path="rsvp/:id"
              element={<InvitationSubPage component={RSVPDashboard} />}
            />
            <Route
              path="guestbook/:id"
              element={<InvitationSubPage component={GuestbookManager} />}
            />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </ProtectedRoute>
  );
}
