import { useMemo } from 'react';
import {
  Box,
  Card,
  SimpleGrid,
  Text,
  Badge,
  Group,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { THEME_TEMPLATES } from '../../lib/themes';
import { getTemplateVisuals, buildThemeVars } from '../../lib/template-styles';
import type { ThemeTemplate } from '../../types';

interface ThemeSelectorProps {
  currentTemplate: string;
  onSelect: (template: ThemeTemplate) => void;
}

// ---------------------------------------------------------------------------
// Mini preview card that shows the template's actual background, pattern,
// frame hint, font pairing, and color palette.
// ---------------------------------------------------------------------------
function TemplatePreviewCard({
  theme,
  isActive,
}: {
  theme: ThemeTemplate;
  isActive: boolean;
}) {
  const visuals = useMemo(() => getTemplateVisuals(theme.id), [theme.id]);
  const vars = useMemo(() => buildThemeVars(theme.theme_config), [theme.theme_config]);

  const bgStyle = visuals.coverBackground(vars);
  const patternStyle = visuals.coverPattern(vars);
  const dividerSvg = visuals.dividerSvg(vars.secondary);

  return (
    <Card
      padding={0}
      radius="md"
      withBorder
      style={{
        borderColor: isActive ? vars.secondary : '#E0DCD5',
        borderWidth: isActive ? 2 : 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: isActive
          ? `color-mix(in srgb, ${vars.secondary} 4%, white)`
          : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: vars.secondary,
            boxShadow: `0 4px 16px color-mix(in srgb, ${vars.secondary} 20%, transparent)`,
          },
        },
      }}
    >
      {isActive && (
        <Badge
          size="xs"
          variant="filled"
          style={{
            position: 'absolute',
            top: -8,
            right: -4,
            zIndex: 10,
            background: vars.secondary,
            color: vars.bg,
          }}
        >
          Aktif
        </Badge>
      )}

      {/* Mini cover preview */}
      <Box
        style={{
          position: 'relative',
          height: 110,
          overflow: 'hidden',
          ...bgStyle,
        }}
      >
        {/* Pattern overlay */}
        <div
          style={{
            ...patternStyle,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Mini frame hint */}
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            border: `1px solid ${vars.secondary}`,
            borderRadius:
              visuals.coverFrame === 'arch-top'
                ? '40% 40% 2px 2px / 15% 15% 2px 2px'
                : visuals.coverFrame === 'botanical-frame'
                ? '4px'
                : '1px',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        />

        {/* Mini text preview */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '8px',
          }}
        >
          {/* Top ornament */}
          <span
            style={{
              color: vars.secondary,
              fontSize: '10px',
              letterSpacing: '3px',
              opacity: 0.7,
              marginBottom: '4px',
            }}
          >
            {visuals.coverTopOrnament}
          </span>

          {/* Display font sample */}
          <span
            style={{
              fontFamily: `'${theme.theme_config.font_display}', serif`,
              fontSize: '16px',
              fontWeight: 600,
              color: vars.text,
              lineHeight: 1.2,
            }}
          >
            Ahmad
          </span>
          <span
            style={{
              fontFamily: `'${theme.theme_config.font_display}', serif`,
              fontSize: '11px',
              fontStyle: 'italic',
              color: vars.secondary,
              margin: '1px 0',
            }}
          >
            &amp;
          </span>
          <span
            style={{
              fontFamily: `'${theme.theme_config.font_display}', serif`,
              fontSize: '16px',
              fontWeight: 600,
              color: vars.text,
              lineHeight: 1.2,
            }}
          >
            Siti
          </span>

          {/* Divider SVG preview */}
          <div
            dangerouslySetInnerHTML={{ __html: dividerSvg }}
            style={{ width: '80px', height: '10px', marginTop: '4px' }}
          />
        </div>
      </Box>

      {/* Bottom info section */}
      <Box p="xs" pb="sm">
        {/* Color palette dots */}
        <Group gap={4} mb={6} justify="center">
          {theme.preview_colors.map((color, i) => (
            <Box
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: color,
                border: '1.5px solid rgba(255,255,255,0.8)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            />
          ))}
        </Group>

        {/* Theme name */}
        <Text
          ta="center"
          fw={600}
          size="sm"
          mb={2}
          style={{
            fontFamily: `'${theme.theme_config.font_display}', serif`,
            color: theme.theme_config.primary_color,
          }}
        >
          {theme.name_ms}
        </Text>

        {/* Description */}
        <Text ta="center" size="xs" c="dimmed" lineClamp={2} lh={1.4}>
          {theme.description}
        </Text>

        {/* Font info */}
        <Text ta="center" size="10px" c="dimmed" mt={4} style={{ opacity: 0.6 }}>
          {theme.theme_config.font_display} / {theme.theme_config.font_body}
        </Text>
      </Box>
    </Card>
  );
}

export default function ThemeSelector({ currentTemplate, onSelect }: ThemeSelectorProps) {
  return (
    <Box>
      <Title order={5} mb="sm" c="#8B6F4E">
        Pilih Tema
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Pilih tema yang sesuai untuk kad jemputan anda. Setiap tema mempunyai corak, hiasan dan gaya tersendiri.
      </Text>

      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
        {THEME_TEMPLATES.map((theme) => {
          const isActive = currentTemplate === theme.id;
          return (
            <UnstyledButton
              key={theme.id}
              onClick={() => onSelect(theme)}
              style={{ display: 'block' }}
            >
              <TemplatePreviewCard theme={theme} isActive={isActive} />
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
