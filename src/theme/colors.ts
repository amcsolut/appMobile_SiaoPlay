/**
 * Tema de cores inspirado no shadcnUI
 * Otimizado para streaming (Netflix + Spotify style)
 */
export const colors = {
  light: {
    // Cores primárias
    primary: '#000000',
    primaryForeground: '#FFFFFF',
    
    // Cores secundárias
    secondary: '#F4F4F5',
    secondaryForeground: '#18181B',
    
    // Backgrounds
    background: '#FFFFFF',
    foreground: '#09090B',
    
    // Cards (Netflix style)
    card: '#FFFFFF',
    cardForeground: '#09090B',
    
    // Borders
    border: '#E4E4E7',
    input: '#E4E4E7',
    
    // Muted
    muted: '#F4F4F5',
    mutedForeground: '#71717A',
    
    // Accent
    accent: '#F4F4F5',
    accentForeground: '#18181B',
    
    // Destructive
    destructive: '#EF4444',
    destructiveForeground: '#FAFAFA',
    
    // Ring (focus)
    ring: '#09090B',
    
    // Status colors
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // Legacy support (mantido para compatibilidade)
    surface: '#F4F4F5',
    text: '#09090B',
    textSecondary: '#71717A',
  },
  dark: {
    // Cores primárias
    primary: '#FAFAFA',
    primaryForeground: '#09090B',
    
    // Cores secundárias
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    
    // Backgrounds
    background: '#09090B',
    foreground: '#FAFAFA',
    
    // Cards (Netflix dark style)
    card: '#18181B',
    cardForeground: '#FAFAFA',
    
    // Borders
    border: '#27272A',
    input: '#27272A',
    
    // Muted
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    
    // Accent
    accent: '#27272A',
    accentForeground: '#FAFAFA',
    
    // Destructive
    destructive: '#7F1D1D',
    destructiveForeground: '#FAFAFA',
    
    // Ring (focus)
    ring: '#D4D4D8',
    
    // Status colors
    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    info: '#2563EB',
    
    // Legacy support (mantido para compatibilidade)
    surface: '#18181B',
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
  },
};

export type ColorScheme = 'light' | 'dark';

