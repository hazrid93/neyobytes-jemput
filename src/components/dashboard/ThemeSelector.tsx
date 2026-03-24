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
import type { ThemeTemplate } from '../../types';

interface ThemeSelectorProps {
  currentTemplate: string;
  onSelect: (template: ThemeTemplate) => void;
}

export default function ThemeSelector({ currentTemplate, onSelect }: ThemeSelectorProps) {
  return (
    <Box>
      <Title order={5} mb="sm" c="#8B6F4E">
        Pilih Tema
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Pilih tema yang sesuai untuk kad jemputan anda. Warna boleh disesuaikan selepas ini.
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
              <Card
                padding="sm"
                radius="md"
                withBorder
                style={{
                  borderColor: isActive ? '#D4AF37' : '#E8D5B7',
                  borderWidth: isActive ? 2 : 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'none' : undefined,
                  background: isActive ? 'rgba(212, 175, 55, 0.04)' : undefined,
                  position: 'relative',
                  overflow: 'visible',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: '#D4AF37',
                      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.15)',
                    },
                  },
                }}
              >
                {isActive && (
                  <Badge
                    size="xs"
                    color="yellow"
                    variant="filled"
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -4,
                      zIndex: 1,
                    }}
                  >
                    Aktif
                  </Badge>
                )}

                {/* Color palette preview */}
                <Group gap={6} mb="xs" justify="center">
                  {theme.preview_colors.map((color, i) => (
                    <Box
                      key={i}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: color,
                        border: '2px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }}
                    />
                  ))}
                </Group>

                {/* Theme name in the theme's display font */}
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
                <Text ta="center" size="xs" c="dimmed" lineClamp={2}>
                  {theme.description}
                </Text>
              </Card>
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
