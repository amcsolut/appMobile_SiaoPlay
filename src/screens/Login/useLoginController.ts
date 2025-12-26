import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userService } from '../../services/api/endpoints';
import { storageService } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';
import { ApiError } from '../../types';

export const useLoginController = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('suporte@churchplay.com.br');
  const [password, setPassword] = useState('********');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Chamada real à API de login
      const response = await userService.login({ email, password });
      
      // Log da resposta completa em desenvolvimento para debug
      if (__DEV__) {
        console.log('[Login] Resposta completa da API:', JSON.stringify(response, null, 2));
      }
      
      // A API retorna: { access_token, refresh_token, token_type, user, permission_level }
      const { access_token, refresh_token, user: userData } = response;
      
      // Salvar access_token (token principal) e dados do usuário
      if (access_token) {
        await storageService.setItem(STORAGE_KEYS.USER_TOKEN, access_token);
        if (__DEV__) {
          console.log('[Login] Access token salvo com sucesso:', access_token.substring(0, 20) + '...');
        }
      } else {
        if (__DEV__) {
          console.warn('[Login] Access token não encontrado na resposta');
        }
        throw new Error('Token não encontrado na resposta da API');
      }
      
      // Salvar refresh_token se necessário (opcional, para renovação de token)
      if (refresh_token) {
        await storageService.setItem('@siaoplay:refresh_token', refresh_token);
        if (__DEV__) {
          console.log('[Login] Refresh token salvo');
        }
      }
      
      if (userData) {
        await storageService.setItem(STORAGE_KEYS.USER_DATA, userData);
        if (__DEV__) {
          console.log('[Login] Dados do usuário salvos:', userData.name || userData.email);
        }
      }
      
      // Navegar para Home após login bem-sucedido
      navigation.replace('Home');
    } catch (error: any) {
      const apiError = error as ApiError;
      
      // Tratar erros específicos
      if (apiError.status === 401) {
        setErrors({
          email: 'Email ou senha incorretos',
          password: 'Email ou senha incorretos',
        });
        Alert.alert('Erro de Login', 'Email ou senha incorretos. Verifique suas credenciais.');
      } else if (apiError.status === 422) {
        // Erros de validação
        Alert.alert('Erro de Validação', apiError.message || 'Dados inválidos');
      } else {
        Alert.alert('Erro', apiError.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // TODO: Implementar login com Google
      // await GoogleSignin.signIn();
      
      // Simulação de login social
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
      
      // Navegar para Home após login bem-sucedido
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Senha',
      'Um email será enviado para recuperação de senha.',
      [{ text: 'OK' }]
    );
  };

  return {
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
  };
};

