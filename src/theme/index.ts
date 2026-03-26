import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'navy',
  colors: {
    navy: [
      '#F1F5F9',
      '#CEDAEB',
      '#9BB5D6',
      '#6890C2',
      '#3B6DAD',
      '#1E3A5F',
      '#162B4D',
      '#0F1F3A',
      '#0A1628',
      '#060E1A',
    ],
    gold: [
      '#FBF7EB',
      '#F5EDD1',
      '#E8D48B',
      '#D4AF37',
      '#C8A951',
      '#B08D3B',
      '#8B6F2E',
      '#6B5522',
      '#4A3B18',
      '#2C2310',
    ],
  },
  fontFamily: "'DM Sans', sans-serif",
  headings: {
    fontFamily: "'Playfair Display', serif",
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});
