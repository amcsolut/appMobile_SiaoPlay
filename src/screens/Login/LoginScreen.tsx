import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginController } from './useLoginController';
import { Button, Input, SocialButton } from '../../components/common';
import { spacing, typography, borderRadius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';

export const LoginScreen = () => {
  const { colors } = useTheme();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    errors,
    handleLogin,
    handleGoogleLogin,
    handleForgotPassword,
  } = useLoginController();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          padding: spacing.lg,
        },
        logoContainer: {
          alignItems: 'center',
          marginBottom: spacing.xxl,
        },
        logo: {
          width: 60,
          height: 60,
          marginBottom: spacing.md,
          // Placeholder para logo - substituir por Image quando tiver o logo
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          justifyContent: 'center',
          alignItems: 'center',
        },
        logoText: {
          ...typography.h1,
          color: colors.foreground,
          marginBottom: spacing.xs,
        },
        logoSubtext: {
          ...typography.caption,
          color: colors.mutedForeground,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          borderWidth: 1,
          borderColor: colors.border,
        },
        title: {
          ...typography.h2,
          color: colors.foreground,
          textAlign: 'center',
          marginBottom: spacing.sm,
        },
        subtitle: {
          ...typography.body,
          color: colors.mutedForeground,
          textAlign: 'center',
          marginBottom: spacing.xl,
        },
        separator: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: spacing.lg,
        },
        separatorLine: {
          flex: 1,
          height: 1,
          backgroundColor: colors.border,
        },
        separatorText: {
          ...typography.caption,
          color: colors.mutedForeground,
          paddingHorizontal: spacing.md,
        },
        forgotPasswordContainer: {
          alignItems: 'flex-start',
          marginTop: spacing.sm,
          marginBottom: spacing.lg,
        },
        forgotPasswordText: {
          ...typography.caption,
          color: colors.primary,
        },
      }),
    [colors]
  );

  // Ícones simples usando texto (substituir por ícones reais quando tiver biblioteca)
  const MailIcon = () => (
    <Text style={{ color: colors.mutedForeground, fontSize: 18 }}>✉</Text>
  );

  const LockIcon = () => (
    <Text style={{ color: colors.mutedForeground, fontSize: 18 }}>🔒</Text>
  );

  const EyeIcon = () => (
    <Text style={{ color: colors.mutedForeground, fontSize: 18 }}>
      {showPassword ? '👁️' : '👁️‍🗨️'}
    </Text>
  );

  const GoogleIcon = () => (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>G</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={{ color: colors.foreground, fontSize: 24 }}>👑</Text>
            </View>
            <Text style={styles.logoText}>SiaoPlay</Text>
            <Text style={styles.logoSubtext}>Streaming Platform</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Fazer Login</Text>
            <Text style={styles.subtitle}>
              Entre com suas credenciais ou use login social
            </Text>

            {/* Social Login Button */}
            <SocialButton
              title="Fazer login como AMC"
              subtitle="amccomunica@gmail.com"
              icon={<GoogleIcon />}
              onPress={handleGoogleLogin}
            />

            {/* Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OU</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Email Input */}
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<MailIcon />}
              error={errors.email}
            />

            {/* Password Input */}
            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              secureTextEntry={!showPassword}
              leftIcon={<LockIcon />}
              rightIcon={<EyeIcon />}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

