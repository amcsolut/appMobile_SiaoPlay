import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    try {
      // TODO: Implementar chamada à API de login
      // const response = await loginEndpoint({ email, password });
      // await AsyncStorage.setItem('token', response.token);
      
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navegar para Home após login bem-sucedido
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

