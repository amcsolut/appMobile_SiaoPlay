import { useColorScheme } from 'react-native';
import { colors, ColorScheme } from '../theme';

/**
 * Hook para gerenciar o tema da aplicação
 * Por padrão, utiliza o tema dark (ideal para streaming)
 */
export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  // Força o tema dark como padrão
  const theme: ColorScheme = 'dark';

  return {
    colors: colors[theme],
    theme,
    isDark: theme === 'dark',
    // Função para alternar tema (pode ser implementada no futuro)
    toggleTheme: () => {
      // Implementação futura com AsyncStorage
    },
  };
};

