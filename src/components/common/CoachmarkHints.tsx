import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Portal,
  SimpleGrid,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconBulb, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconX } from '@tabler/icons-react';
import { NAVY, NAVY_LIGHT, OFF_WHITE } from '../../constants/colors';

export interface CoachmarkHintItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

type CoachmarkPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface CoachmarkStep {
  id: string;
  targetRef: RefObject<HTMLElement | null>;
  title: string;
  description: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface SmartCoachmarkProps {
  targetRef: RefObject<HTMLElement | null>;
  storageKey?: string;
  title: string;
  description: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  minWidth?: number;
  maxWidth?: number;
  open?: boolean;
  defaultOpen?: boolean;
  zIndex?: number;
  showSpotlight?: boolean;
  footer?: ReactNode;
  onClose?: () => void;
  /** When true, overlay & bubble use CSS transitions instead of hard jumps */
  animate?: boolean;
}

interface CoachmarkTourProps {
  storageKey: string;
  steps: CoachmarkStep[];
  open?: boolean;
  defaultOpen?: boolean;
  showSpotlight?: boolean;
  onFinish?: () => void;
  replayToken?: number;
}

interface CoachmarkHintsProps {
  storageKey: string;
  badge?: string;
  title: string;
  description?: string;
  items: CoachmarkHintItem[];
  collapsedLabel?: string;
  tone?: 'gold' | 'blue' | 'green';
}

interface PositionState {
  top: number;
  left: number;
  placement: CoachmarkPlacement;
  arrowLeft?: number;
  arrowTop?: number;
  visible: boolean;
  targetRect?: DOMRect;
}

const TONE_STYLES = {
  gold: {
    surface: 'linear-gradient(135deg, rgba(255,250,243,0.98) 0%, rgba(253,245,230,0.96) 100%)',
    border: 'rgba(212,175,55,0.26)',
    iconBg: 'rgba(212,175,55,0.14)',
    iconColor: '#A0781D',
    badgeBg: 'rgba(212,175,55,0.14)',
    badgeColor: NAVY_LIGHT,
  },
  blue: {
    surface: 'linear-gradient(135deg, rgba(245,249,255,0.98) 0%, rgba(236,244,255,0.96) 100%)',
    border: 'rgba(51,154,240,0.2)',
    iconBg: 'rgba(51,154,240,0.12)',
    iconColor: '#1C7ED6',
    badgeBg: 'rgba(51,154,240,0.12)',
    badgeColor: '#1C5D99',
  },
  green: {
    surface: 'linear-gradient(135deg, rgba(245,252,247,0.98) 0%, rgba(237,250,241,0.96) 100%)',
    border: 'rgba(47,158,68,0.2)',
    iconBg: 'rgba(47,158,68,0.12)',
    iconColor: '#2F9E44',
    badgeBg: 'rgba(47,158,68,0.12)',
    badgeColor: '#2B6F3E',
  },
};

const GAP = 14;
const ARROW = 14;
const VIEWPORT_PAD = 16;
const SPOTLIGHT_PAD = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getStoredFlag(storageKey: string) {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(storageKey) === '1';
}

export function SmartCoachmark({
  targetRef,
  storageKey,
  title,
  description,
  badge,
  actionLabel,
  onAction,
  minWidth = 260,
  maxWidth = 320,
  open,
  defaultOpen = true,
  zIndex = 450,
  showSpotlight = true,
  footer,
  onClose,
  animate = false,
}: SmartCoachmarkProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<PositionState>({
    top: 0,
    left: 0,
    placement: 'bottom',
    visible: false,
  });

  const isOpen = open ?? (!dismissed && defaultOpen);

  useEffect(() => {
    setMounted(true);
    if (storageKey) {
      setDismissed(getStoredFlag(storageKey));
    }
  }, [storageKey]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, '1');
    }
    onClose?.();
  }, [storageKey, onClose]);

  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const finishPosition = useCallback((rect: DOMRect, bubble: HTMLElement) => {
    const bubbleRect = bubble.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spaces = {
      top: rect.top,
      bottom: viewportHeight - rect.bottom,
      left: rect.left,
      right: viewportWidth - rect.right,
    };

    const candidates: CoachmarkPlacement[] = ['bottom', 'top', 'right', 'left'];
    const placement = [...candidates].sort((a, b) => spaces[b] - spaces[a])[0];

    let left = 0;
    let top = 0;
    let arrowLeft: number | undefined;
    let arrowTop: number | undefined;

    if (placement === 'bottom' || placement === 'top') {
      left = clamp(
        rect.left + rect.width / 2 - bubbleRect.width / 2,
        VIEWPORT_PAD,
        viewportWidth - bubbleRect.width - VIEWPORT_PAD,
      );
      top = placement === 'bottom'
        ? rect.bottom + GAP + ARROW
        : rect.top - bubbleRect.height - GAP - ARROW;
      top = clamp(top, VIEWPORT_PAD, viewportHeight - bubbleRect.height - VIEWPORT_PAD);
      arrowLeft = clamp(rect.left + rect.width / 2 - left - ARROW, 20, bubbleRect.width - 28);
    } else {
      top = clamp(
        rect.top + rect.height / 2 - bubbleRect.height / 2,
        VIEWPORT_PAD,
        viewportHeight - bubbleRect.height - VIEWPORT_PAD,
      );
      left = placement === 'right'
        ? rect.right + GAP + ARROW
        : rect.left - bubbleRect.width - GAP - ARROW;
      left = clamp(left, VIEWPORT_PAD, viewportWidth - bubbleRect.width - VIEWPORT_PAD);
      arrowTop = clamp(rect.top + rect.height / 2 - top - ARROW, 20, bubbleRect.height - 28);
    }

    setPosition({ top, left, placement, arrowLeft, arrowTop, visible: true, targetRect: rect });
  }, []);

  const calculatePosition = useCallback(() => {
    const target = targetRef.current;
    const bubble = bubbleRef.current;
    if (!target || !bubble || !isOpen) {
      setPosition((current) => ({ ...current, visible: false }));
      return;
    }

    const rect = target.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setPosition((current) => ({ ...current, visible: false }));
      return;
    }

    // Auto-scroll target into view if it's outside the viewport
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const isOutOfView =
      rect.bottom < 0 ||
      rect.top > viewportHeight ||
      rect.right < 0 ||
      rect.left > viewportWidth;

    if (isOutOfView) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      // Re-calculate after scroll finishes
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const newRect = target.getBoundingClientRect();
        if (newRect.width === 0 && newRect.height === 0) return;
        finishPosition(newRect, bubble);
      }, 400);
      return;
    }

    finishPosition(rect, bubble);
  }, [isOpen, targetRef, finishPosition]);

  useLayoutEffect(() => {
    if (!mounted || !isOpen) return;
    calculatePosition();
  }, [mounted, isOpen, calculatePosition, title, description, footer]);

  useEffect(() => {
    if (!mounted || !isOpen) return;

    const handle = () => calculatePosition();
    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, true);

    const target = targetRef.current;
    const bubble = bubbleRef.current;
    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(handle)
      : null;

    if (resizeObserver && target) resizeObserver.observe(target);
    if (resizeObserver && bubble) resizeObserver.observe(bubble);

    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, true);
      resizeObserver?.disconnect();
    };
  }, [mounted, isOpen, calculatePosition, targetRef]);

  const arrowStyle = useMemo(() => {
    const size = ARROW;
    const base = {
      position: 'absolute' as const,
      width: size * 2,
      height: size * 2,
      background: OFF_WHITE,
      border: 'none',
    };

    switch (position.placement) {
      case 'top':
        return { ...base, bottom: -size, left: position.arrowLeft, transform: 'rotate(45deg)' };
      case 'bottom':
        return { ...base, top: -size, left: position.arrowLeft, transform: 'rotate(45deg)' };
      case 'left':
        return { ...base, right: -size, top: position.arrowTop, transform: 'rotate(45deg)' };
      case 'right':
      default:
        return { ...base, left: -size, top: position.arrowTop, transform: 'rotate(45deg)' };
    }
  }, [position]);

  if (!mounted || !isOpen) return null;

  const spotlightReady = position.visible && position.targetRect;

  const spotlightRect = spotlightReady
    ? {
        top: Math.max(position.targetRect!.top - SPOTLIGHT_PAD, 0),
        left: Math.max(position.targetRect!.left - SPOTLIGHT_PAD, 0),
        width: position.targetRect!.width + SPOTLIGHT_PAD * 2,
        height: position.targetRect!.height + SPOTLIGHT_PAD * 2,
      }
    : null;

  const OVERLAY_OPACITY = 0.55;
  const SPOTLIGHT_RADIUS = 14;
  const TRANSITION_MS = animate ? '350ms' : '0ms';

  return (
    <Portal>
      {showSpotlight && spotlightRect && (
        <>
          {/* SVG overlay with mask cutout for spotlight */}
          <svg
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              zIndex: zIndex - 2,
              pointerEvents: 'auto',
            }}
          >
            <defs>
              <mask id="coachmark-spotlight-mask">
                {/* White = visible (overlay shows), Black = hidden (cutout) */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={spotlightRect.left}
                  y={spotlightRect.top}
                  width={spotlightRect.width}
                  height={spotlightRect.height}
                  rx={SPOTLIGHT_RADIUS}
                  ry={SPOTLIGHT_RADIUS}
                  fill="black"
                  style={{ transition: `x ${TRANSITION_MS} ease, y ${TRANSITION_MS} ease, width ${TRANSITION_MS} ease, height ${TRANSITION_MS} ease` }}
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`rgba(24, 18, 10, ${OVERLAY_OPACITY})`}
              mask="url(#coachmark-spotlight-mask)"
            />
            {/* Gold border around the spotlight cutout */}
            <rect
              x={spotlightRect.left}
              y={spotlightRect.top}
              width={spotlightRect.width}
              height={spotlightRect.height}
              rx={SPOTLIGHT_RADIUS}
              ry={SPOTLIGHT_RADIUS}
              fill="none"
              stroke="rgba(212,175,55,0.55)"
              strokeWidth="2"
              style={{ transition: `x ${TRANSITION_MS} ease, y ${TRANSITION_MS} ease, width ${TRANSITION_MS} ease, height ${TRANSITION_MS} ease` }}
            />
          </svg>
        </>
      )}

      <Box
        style={{
          position: 'fixed',
          inset: 0,
          zIndex,
          pointerEvents: 'none',
        }}
      >
      <Box
        ref={bubbleRef}
        style={{
          position: 'fixed',
          top: spotlightReady ? position.top : -9999,
          left: spotlightReady ? position.left : -9999,
          width: `min(${maxWidth}px, calc(100vw - ${VIEWPORT_PAD * 2}px))`,
          minWidth: Math.min(minWidth, maxWidth),
          zIndex,
          pointerEvents: 'auto',
          visibility: spotlightReady ? 'visible' : 'hidden',
          transition: animate ? `top ${TRANSITION_MS} ease, left ${TRANSITION_MS} ease` : undefined,
        }}
      >
        <Paper
          radius="xl"
          p="md"
          withBorder
          style={{
            position: 'relative',
            overflow: 'visible',
            background: OFF_WHITE,
            borderColor: 'rgba(212,175,55,0.26)',
            boxShadow: '0 24px 60px rgba(44,24,16,0.14)',
          }}
        >
          <Box style={arrowStyle} />

          <Group justify="space-between" align="flex-start" wrap="nowrap" mb="xs">
            <Box>
              <Group gap="xs" mb={4}>
                {badge && (
                  <Badge radius="xl" variant="light" color="yellow">
                    {badge}
                  </Badge>
                )}
                <Text fw={700} style={{ color: NAVY }}>
                  {title}
                </Text>
              </Group>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                {description}
              </Text>
            </Box>
            <ActionIcon variant="subtle" color="gray" onClick={dismiss} aria-label="Tutup coachmark">
              <IconX size={16} />
            </ActionIcon>
          </Group>

          {actionLabel && onAction && (
            <Button size="xs" radius="xl" color="yellow" mt="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}

          {footer}
        </Paper>
      </Box>
      </Box>
    </Portal>
  );
}

export function CoachmarkTour({
  storageKey,
  steps,
  open,
  defaultOpen = true,
  showSpotlight = true,
  onFinish,
  replayToken,
}: CoachmarkTourProps) {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [mountTick, setMountTick] = useState(0);

  useEffect(() => {
    setDismissed(getStoredFlag(storageKey));
  }, [storageKey]);

  // After mount, refs may not yet be attached — schedule a re-render
  // so that visibleSteps re-evaluates once DOM elements are available
  useEffect(() => {
    const timer = setTimeout(() => setMountTick(1), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (replayToken === undefined) return;
    setDismissed(false);
    setIndex(0);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
    // Force re-evaluation of visibleSteps after state settles
    setTimeout(() => setMountTick((v) => v + 1), 50);
  }, [replayToken, storageKey]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void mountTick; // ensure mountTick is referenced so re-render happens
  const visibleSteps = steps.filter((step) => !!step.targetRef.current);
  const isOpen = open ?? (!dismissed && defaultOpen);
  const currentStep = visibleSteps[Math.min(index, Math.max(visibleSteps.length - 1, 0))];

  useEffect(() => {
    if (index > visibleSteps.length - 1) {
      setIndex(0);
    }
  }, [index, visibleSteps.length]);

  const closeTour = useCallback(() => {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, '1');
    }
    onFinish?.();
  }, [storageKey, onFinish]);

  if (!isOpen || !currentStep) return null;

  const tourFooter = (
    <Group justify="space-between" align="center" mt="sm">
      <Text size="xs" c="dimmed">
        Langkah {Math.min(index + 1, visibleSteps.length)} / {visibleSteps.length}
      </Text>
      <Group gap="xs">
        <Button
          variant="subtle"
          size="compact-sm"
          color="gray"
          leftSection={<IconChevronLeft size={14} />}
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Kembali
        </Button>
        {index < visibleSteps.length - 1 ? (
          <Button
            size="compact-sm"
            color="yellow"
            rightSection={<IconChevronRight size={14} />}
            onClick={() => setIndex((value) => Math.min(visibleSteps.length - 1, value + 1))}
          >
            Seterusnya
          </Button>
        ) : (
          <Button
            size="compact-sm"
            color="yellow"
            onClick={closeTour}
          >
            Selesai
          </Button>
        )}
      </Group>
    </Group>
  );

  return (
    <SmartCoachmark
      targetRef={currentStep.targetRef}
      title={currentStep.title}
      description={currentStep.description}
      badge={currentStep.badge}
      actionLabel={currentStep.actionLabel}
      onAction={currentStep.onAction}
      open={isOpen}
      showSpotlight={showSpotlight}
      onClose={closeTour}
      footer={tourFooter}
      animate
    />
  );
}

export default function CoachmarkHints({
  storageKey,
  badge,
  title,
  description,
  items,
  collapsedLabel = 'Tunjuk panduan',
  tone = 'gold',
}: CoachmarkHintsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const styles = useMemo(() => TONE_STYLES[tone], [tone]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setCollapsed(window.localStorage.getItem(storageKey) === '1');
  }, [storageKey]);

  const handleCollapsedChange = (nextValue: boolean) => {
    setCollapsed(nextValue);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, nextValue ? '1' : '0');
    }
  };

  if (!items.length) return null;

  if (collapsed) {
    return (
      <Button
        variant="subtle"
        color={tone === 'gold' ? 'yellow' : tone}
        leftSection={<IconBulb size={16} />}
        onClick={() => handleCollapsedChange(false)}
        style={{ alignSelf: 'flex-start' }}
      >
        {collapsedLabel}
      </Button>
    );
  }

  return (
    <Paper
      p="md"
      radius="lg"
      withBorder
      style={{
        background: styles.surface,
        borderColor: styles.border,
        boxShadow: '0 10px 30px rgba(44,24,16,0.05)',
      }}
    >
      <Group justify="space-between" align="flex-start" mb={description ? 'xs' : 'md'} wrap="nowrap">
        <Box>
          <Group gap="xs" mb={6}>
            {badge && (
              <Badge
                radius="xl"
                variant="light"
                style={{
                  background: styles.badgeBg,
                  color: styles.badgeColor,
                  border: `1px solid ${styles.border}`,
                }}
              >
                {badge}
              </Badge>
            )}
            <Text fw={700} style={{ color: NAVY }}>
              {title}
            </Text>
          </Group>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </Box>

        <ActionIcon
          variant="subtle"
          color={tone === 'gold' ? 'yellow' : tone}
          onClick={() => handleCollapsedChange(true)}
          aria-label="Sembunyikan panduan"
        >
          <IconChevronUp size={18} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={{ base: 1, md: items.length > 1 ? 2 : 1 }} spacing="sm">
        {items.map((item) => (
          <Box
            key={item.id}
            p="sm"
            style={{
              borderRadius: 14,
              background: 'rgba(255,255,255,0.7)',
              border: `1px solid ${styles.border}`,
            }}
          >
            <Group align="flex-start" gap="sm" wrap="nowrap">
              <ThemeIcon
                size={34}
                radius="xl"
                variant="light"
                style={{
                  background: styles.iconBg,
                  color: styles.iconColor,
                  flexShrink: 0,
                }}
              >
                {item.icon || <IconBulb size={18} />}
              </ThemeIcon>
              <Box>
                <Text size="sm" fw={700} style={{ color: NAVY }} mb={4}>
                  {item.title}
                </Text>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.55 }}>
                  {item.description}
                </Text>
              </Box>
            </Group>
          </Box>
        ))}
      </SimpleGrid>

      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          Panduan ini boleh dibuka semula bila-bila masa.
        </Text>
        <Button
          variant="subtle"
          size="compact-sm"
          color={tone === 'gold' ? 'yellow' : tone}
          rightSection={<IconChevronDown size={14} />}
          onClick={() => handleCollapsedChange(true)}
        >
          Sembunyi
        </Button>
      </Group>
    </Paper>
  );
}
