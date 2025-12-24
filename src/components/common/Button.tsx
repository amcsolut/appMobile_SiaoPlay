import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { spacing, borderRadius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'destructive':
        return {
          backgroundColor: colors.destructive,
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          color: colors.primaryForeground,
          fontSize: 16,
          fontWeight: '600' as const,
        };
      case 'secondary':
        return {
          color: colors.secondaryForeground,
          fontSize: 16,
          fontWeight: '600' as const,
        };
      case 'outline':
        return {
          color: colors.foreground,
          fontSize: 16,
          fontWeight: '600' as const,
        };
      case 'destructive':
        return {
          color: colors.destructiveForeground,
          fontSize: 16,
          fontWeight: '600' as const,
        };
      default:
        return {
          color: colors.primaryForeground,
          fontSize: 16,
          fontWeight: '600' as const,
        };
    }
  };

  const buttonStyle = getButtonStyle();
  const textStyleObj = getTextStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline'
              ? colors.foreground
              : variant === 'primary'
              ? colors.primaryForeground
              : variant === 'secondary'
              ? colors.secondaryForeground
              : colors.destructiveForeground
          }
        />
      ) : (
        <Text style={[textStyleObj, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
});

