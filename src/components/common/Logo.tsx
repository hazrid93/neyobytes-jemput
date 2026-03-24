import { Text, Group } from '@mantine/core';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizes = {
  sm: { font: 24, flourish: 10 },
  md: { font: 36, flourish: 14 },
  lg: { font: 52, flourish: 18 },
};

export default function Logo({ size = 'md', color = '#B08D5B' }: LogoProps) {
  const s = sizes[size];

  return (
    <Group gap={0} align="center" style={{ userSelect: 'none' }}>
      {/* Left flourish */}
      <svg
        width={s.flourish * 2.5}
        height={s.flourish * 2}
        viewBox="0 0 30 20"
        fill="none"
        style={{ marginRight: 4, opacity: 0.7 }}
      >
        <path
          d="M28 10C22 10 18 4 10 4C6 4 3 6 2 10C3 14 6 16 10 16C18 16 22 10 28 10Z"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M24 10C20 10 17 6 12 6"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      <Text
        component="span"
        fw={700}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: s.font,
          color,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        Jemput
      </Text>

      {/* Right flourish */}
      <svg
        width={s.flourish * 2.5}
        height={s.flourish * 2}
        viewBox="0 0 30 20"
        fill="none"
        style={{ marginLeft: 4, opacity: 0.7, transform: 'scaleX(-1)' }}
      >
        <path
          d="M28 10C22 10 18 4 10 4C6 4 3 6 2 10C3 14 6 16 10 16C18 16 22 10 28 10Z"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M24 10C20 10 17 6 12 6"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
    </Group>
  );
}
