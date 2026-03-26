import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell,
  Burger,
  Group,
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
  Anchor,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconCards,
  IconPlus,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconChevronRight,
  IconMessage2,
  IconUsers,
  IconCrown,
  IconEdit,
} from '@tabler/icons-react';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStore } from '../stores/dashboardStore';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import InvitationEditor from '../components/dashboard/InvitationEditor';
import RSVPDashboard from '../components/dashboard/RSVPDashboard';
import GuestbookManager from '../components/dashboard/GuestbookManager';
import SubscriptionPage from '../components/dashboard/SubscriptionPage';
import CheckoutPage from '../components/dashboard/CheckoutPage';
import CheckoutReturnPage from '../components/dashboard/CheckoutReturnPage';
import Logo from '../components/common/Logo';

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

// Build breadcrumb segments from the current path
function useBreadcrumbs(invitations: Array<{ id: string; groom_name: string; bride_name: string }>) {
  const location = useLocation();
  const currentPath = location.pathname;

  return useMemo(() => {
    const crumbs: Array<{ label: string; path: string }> = [
      { label: 'Dashboard', path: '/dashboard' },
    ];

    // /dashboard (index) — just "Dashboard"
    if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
      return crumbs;
    }

    // /dashboard/edit/:id
    const editMatch = currentPath.match(/^\/dashboard\/edit\/(.+)/);
    if (editMatch) {
      const invId = editMatch[1];
      const inv = invitations.find((i) => i.id === invId);
      const label = inv ? `${inv.groom_name} & ${inv.bride_name}` : 'Editor';
      crumbs.push({ label: 'Edit', path: '' }); // non-clickable
      crumbs.push({ label, path: '' });
      return crumbs;
    }

    // /dashboard/rsvp/:id
    const rsvpMatch = currentPath.match(/^\/dashboard\/rsvp\/(.+)/);
    if (rsvpMatch) {
      const invId = rsvpMatch[1];
      const inv = invitations.find((i) => i.id === invId);
      if (inv) {
        crumbs.push({ label: `${inv.groom_name} & ${inv.bride_name}`, path: `/dashboard/edit/${invId}` });
      }
      crumbs.push({ label: 'RSVP', path: '' });
      return crumbs;
    }

    // /dashboard/guestbook/:id
    const guestbookMatch = currentPath.match(/^\/dashboard\/guestbook\/(.+)/);
    if (guestbookMatch) {
      const invId = guestbookMatch[1];
      const inv = invitations.find((i) => i.id === invId);
      if (inv) {
        crumbs.push({ label: `${inv.groom_name} & ${inv.bride_name}`, path: `/dashboard/edit/${invId}` });
      }
      crumbs.push({ label: 'Buku Tamu', path: '' });
      return crumbs;
    }

    // /dashboard/subscription
    if (currentPath.includes('/dashboard/subscription')) {
      crumbs.push({ label: 'Langganan', path: '' });
      return crumbs;
    }

    // /dashboard/checkout/return
    if (currentPath.includes('/dashboard/checkout/return')) {
      crumbs.push({ label: 'Pembayaran', path: '' });
      crumbs.push({ label: 'Status', path: '' });
      return crumbs;
    }

    // /dashboard/checkout
    if (currentPath.includes('/dashboard/checkout')) {
      crumbs.push({ label: 'Pembayaran', path: '' });
      return crumbs;
    }

    return crumbs;
  }, [currentPath, invitations]);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const { invitations } = useDashboardStore();
  const [opened, { toggle, close }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const isEditorMode = location.pathname.includes('/dashboard/edit/');
  const breadcrumbs = useBreadcrumbs(invitations);

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
        navbar={{
          width: 280,
          breakpoint: 10000, // always collapsible — never auto-show
          collapsed: { mobile: !opened, desktop: !opened },
        }}
        padding={isEditorMode ? 0 : 'md'}
        styles={{
          header: {
            background: 'linear-gradient(90deg, #FDF8F0, #F5E6D3)',
            borderBottom: '1px solid #E8D5B7',
            zIndex: 200,
          },
          navbar: {
            background: '#FDFAF5',
            borderRight: '1px solid #E8D5B7',
            zIndex: 201,
          },
          main: {
            background: '#FAFAFA',
          },
        }}
      >
        {/* ─── Header ─── */}
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            {/* Left: Burger + Logo + Breadcrumbs */}
            <Group gap="sm">
              <Burger
                opened={opened}
                onClick={toggle}
                size="sm"
                aria-label="Navigasi"
              />
              <Box
                onClick={() => navigate('/dashboard')}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Logo size="sm" color="#8B6F4E" />
              </Box>

              {/* Desktop breadcrumbs */}
              {!isMobile && (
                <Group gap={4} style={{ flexWrap: 'nowrap' }}>
                  {breadcrumbs.map((crumb, idx) => (
                    <Group key={idx} gap={4} style={{ flexWrap: 'nowrap' }}>
                      {idx > 0 && (
                        <IconChevronRight size={14} color="#8B6F4E" style={{ opacity: 0.5, flexShrink: 0 }} />
                      )}
                      {crumb.path && idx < breadcrumbs.length - 1 ? (
                        <Anchor
                          size="sm"
                          c="#8B6F4E"
                          fw={500}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(crumb.path);
                          }}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {crumb.label}
                        </Anchor>
                      ) : (
                        <Text
                          size="sm"
                          c={idx === breadcrumbs.length - 1 ? '#5A4633' : 'dimmed'}
                          fw={idx === breadcrumbs.length - 1 ? 600 : 400}
                          style={{ whiteSpace: 'nowrap' }}
                          lineClamp={1}
                        >
                          {crumb.label}
                        </Text>
                      )}
                    </Group>
                  ))}
                </Group>
              )}
            </Group>

            {/* Right: User menu */}
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

        {/* ─── Collapsible Sidebar (all screens) ─── */}
        <AppShell.Navbar p="sm">
          <Box style={{ flex: 1, overflowY: 'auto' }}>
            {/* Main nav items */}
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

            {/* Per-invitation sub-nav */}
            {invitations.length > 0 && (
              <>
                <Divider my="sm" label="Kad Anda" labelPosition="left" />
                {invitations.map((inv) => (
                  <NavLink
                    key={inv.id}
                    label={`${inv.groom_name} & ${inv.bride_name}`}
                    leftSection={<IconCards size={16} />}
                    active={currentPath.includes(inv.id)}
                    defaultOpened={currentPath.includes(inv.id)}
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
                      label="Edit"
                      leftSection={<IconEdit size={14} />}
                      active={currentPath === `/dashboard/edit/${inv.id}`}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        navigate(`/dashboard/edit/${inv.id}`);
                        close();
                      }}
                      variant="light"
                      color="orange"
                      style={{ borderRadius: 6 }}
                    />
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

          {/* Bottom: Create new card */}
          <Box mt="auto" pt="md">
            <Divider mb="sm" />
            <Button
              fullWidth
              leftSection={<IconPlus size={18} />}
              variant="light"
              color="gold"
              onClick={() => {
                navigate('/dashboard');
                close();
              }}
            >
              Cipta Kad Baru
            </Button>
          </Box>
        </AppShell.Navbar>

        {/* ─── Main Content ─── */}
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
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/return" element={<CheckoutReturnPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </ProtectedRoute>
  );
}
