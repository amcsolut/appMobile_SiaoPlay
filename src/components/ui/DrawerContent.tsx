import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing, typography, borderRadius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  onPress?: () => void;
}

const menuItems: MenuItem[] = [
  { id: '1', label: 'Videoteca', icon: '🎬', route: 'Videoteca' },
  { id: '2', label: 'Séries', icon: '📺', route: 'Series' },
  { id: '3', label: 'Cursos', icon: '📚', route: 'Cursos' },
  { id: '4', label: 'Audiobooks', icon: '🎧', route: 'Audiobooks' },
  { id: '5', label: 'Ebooks', icon: '📖', route: 'Ebooks' },
  { id: '6', label: 'Músicas', icon: '🎵', route: 'Musicas' },
];

export const DrawerContent: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handlePress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      // TODO: Navegar para a rota quando as telas estiverem criadas
      console.log('Navigate to:', item.route);
    }
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.logo, { color: colors.foreground }]}>SiaoPlay</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Streaming Platform
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          Versão 1.0.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
  },
  logo: {
    ...typography.h1,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menu: {
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    fontWeight: '500',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
  },
});

