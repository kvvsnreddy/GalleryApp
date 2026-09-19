import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { ImageDetailScreen } from '../screens/Main/ImageDetailScreen';
import { RootStackParamList } from '../types/navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <LoadingSpinner message="Starting up..." />;

  if (!isAuthenticated) return <AuthNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
