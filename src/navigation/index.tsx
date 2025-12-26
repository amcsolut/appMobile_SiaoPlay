import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { MainNavigator } from './MainNavigator';
import { MovieDetailScreen } from '../screens/MovieDetail';
import { SeriesDetailScreen } from '../screens/SeriesDetail';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={MainNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="SeriesDetail"
          component={SeriesDetailScreen}
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

