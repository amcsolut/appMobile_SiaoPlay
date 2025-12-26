import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { VideotecaScreen } from '../screens/Videoteca';
import { SeriesScreen } from '../screens/Series';
import { AudiobooksScreen } from '../screens/Audiobooks';
import { EbooksScreen } from '../screens/Ebooks';
import { MusicasScreen } from '../screens/Musicas';
import { CursosScreen } from '../screens/Cursos';
import { CustomDrawerContent } from '../components/ui/DrawerContent';
import { useTheme } from '../hooks/useTheme';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

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
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="home"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
        }}
      />
      <Tab.Screen
        name="VideotecaTab"
        component={VideotecaScreen}
        options={{
          tabBarLabel: 'Videoteca',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="movie"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SeriesTab"
        component={SeriesScreen}
        options={{
          tabBarLabel: 'Séries',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="tv"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MusicasTab"
        component={MusicasScreen}
        options={{
          tabBarLabel: 'Músicas',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="music-note"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
      <Drawer.Screen
        name="Videoteca"
        component={VideotecaScreen}
        options={{
          headerTitle: 'Videoteca',
          drawerLabel: 'Videoteca',
        }}
      />
      <Drawer.Screen
        name="Series"
        component={SeriesScreen}
        options={{
          headerTitle: 'Séries',
          drawerLabel: 'Séries',
        }}
      />
      <Drawer.Screen
        name="Cursos"
        component={CursosScreen}
        options={{
          headerTitle: 'Cursos',
          drawerLabel: 'Cursos',
        }}
      />
      <Drawer.Screen
        name="Audiobooks"
        component={AudiobooksScreen}
        options={{
          headerTitle: 'Audiobooks',
          drawerLabel: 'Audiobooks',
        }}
      />
      <Drawer.Screen
        name="Ebooks"
        component={EbooksScreen}
        options={{
          headerTitle: 'Ebooks',
          drawerLabel: 'Ebooks',
        }}
      />
      <Drawer.Screen
        name="Musicas"
        component={MusicasScreen}
        options={{
          headerTitle: 'Músicas',
          drawerLabel: 'Músicas',
        }}
      />
    </Drawer.Navigator>
  );
};

