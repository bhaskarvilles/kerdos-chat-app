interface ThemeCustomizerProps {
  onThemeChange: (theme: CustomTheme) => void;
}

interface CustomTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    scale: number;
  };
  spacing: {
    unit: number;
    scale: number;
  };
} 