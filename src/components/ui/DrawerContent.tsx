import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, typography, borderRadius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface MenuItem {
  id: string;
  label: string;
  iconName: string;
  route?: string;
  onPress?: () => void;
}

const menuItems: MenuItem[] = [
  { id: '1', label: 'Videoteca', iconName: 'movie', route: 'Videoteca' },
  { id: '2', label: 'Séries', iconName: 'tv', route: 'Series' },
  { id: '3', label: 'Cursos', iconName: 'school', route: 'Cursos' },
  { id: '4', label: 'Audiobooks', iconName: 'headphones', route: 'Audiobooks' },
  { id: '5', label: 'Ebooks', iconName: 'menu-book', route: 'Ebooks' },
  { id: '6', label: 'Músicas', iconName: 'music-note', route: 'Musicas' },
];

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();

  const handlePress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
      navigation.closeDrawer();
    } else if (item.route) {
      // Usar CommonActions para garantir que a navegação funcione
      navigation.dispatch(
        CommonActions.navigate({
          name: item.route,
        })
      );
      navigation.closeDrawer();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
          />
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
              <Icon
                name={item.iconName}
                size={24}
                color={colors.foreground}
                style={styles.icon}
              />
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
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
    resizeMode: 'contain',
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

