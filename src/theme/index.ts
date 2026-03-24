import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'gold',
  colors: {
    gold: [
      '#FDF8F0',
      '#F5E6D3',
      '#E8D5B7',
      '#D4C4A0',
      '#C4A97A',
      '#B08D5B',
      '#8B6F4E',
      '#6B5540',
      '#4A3B2D',
      '#2C1810',
    ],
  },
  fontFamily: 'Poppins, sans-serif',
  headings: {
    fontFamily: 'Playfair Display, serif',
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
