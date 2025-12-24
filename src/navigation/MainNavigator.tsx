import React from 'react';
import { Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { DrawerContent } from '../components/ui/DrawerContent';
import { useTheme } from '../hooks/useTheme';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens - criar depois
const VideotecaScreen = () => <HomeScreen />;
const SeriesScreen = () => <HomeScreen />;
const CursosScreen = () => <HomeScreen />;
const AudiobooksScreen = () => <HomeScreen />;
const EbooksScreen = () => <HomeScreen />;
const MusicasScreen = () => <HomeScreen />;

const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="VideotecaTab"
        component={VideotecaScreen}
        options={{
          tabBarLabel: 'Videoteca',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎬</Text>,
        }}
      />
      <Tab.Screen
        name="SeriesTab"
        component={SeriesScreen}
        options={{
          tabBarLabel: 'Séries',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📺</Text>,
        }}
      />
      <Tab.Screen
        name="MusicasTab"
        component={MusicasScreen}
        options={{
          tabBarLabel: 'Músicas',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎵</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.foreground,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.mutedForeground,
      }}>
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          headerTitle: 'SiaoPlay',
          drawerLabel: 'Início',
        }}
      />
    </Drawer.Navigator>
  );
};

