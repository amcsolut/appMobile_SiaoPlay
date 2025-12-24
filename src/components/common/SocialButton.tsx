import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { spacing, borderRadius, typography } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface SocialButtonProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.foreground }, textStyle]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.iconContainer}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.arrow, { color: colors.mutedForeground }]}>▼</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    ...typography.caption,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  arrow: {
    fontSize: 12,
  },
});

