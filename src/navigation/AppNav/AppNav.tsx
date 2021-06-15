import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../components';
import { AppNavParamList } from '../../types/navigation.types';
import HomeNav from '../HomeNav/HomeNav';
import SortNav from '../SortNav/SortNav';
import ProfileNav from '../ProfileNav/ProfileNav';
import FavoritesNav from '../FavoritesNav/FavoritesNav';
import { HomeIcon, CategoryIcon, FavoriteIcon, ProfileIcon } from '../../svg/homeNavIcons';

const AppStack = createBottomTabNavigator<AppNavParamList>();

const AppNav = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppStack.Navigator
        tabBarOptions={{
          keyboardHidesTabBar: true,
          showLabel: false,
          activeTintColor: theme.colors.primary,
          inactiveTintColor: theme.colors.lightGrey,
          inactiveBackgroundColor: theme.colors.secondary,
          activeBackgroundColor: theme.colors.secondary,
        }}>
        <AppStack.Screen
          name="Home"
          component={HomeNav}
          options={{
            tabBarIcon: ({ color }) => {
              return <HomeIcon color={color} />;
            },
            unmountOnBlur: true,
          }}
          listeners={() => ({
            tabPress: () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          })}
        />
        <AppStack.Screen
          name="Categories"
          component={SortNav}
          options={{
            tabBarIcon: ({ color }) => {
              return <CategoryIcon color={color} />;
            },
          }}
          listeners={() => ({
            tabPress: () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          })}
        />
        <AppStack.Screen
          name="Favorites"
          component={FavoritesNav}
          options={{
            tabBarIcon: ({ color }) => {
              return <FavoriteIcon color={color} />;
            },
          }}
          listeners={() => ({
            tabPress: () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          })}
        />
        <AppStack.Screen
          name="Profile"
          component={ProfileNav}
          options={{
            tabBarIcon: ({ color }) => {
              return <ProfileIcon color={color} />;
            },
            unmountOnBlur: true,
          }}
          listeners={() => ({
            tabPress: () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          })}
        />
      </AppStack.Navigator>
    </SafeAreaView>
  );
};

export default AppNav;
