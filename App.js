import React, { Suspense, useEffect, useState } from 'react';import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import { DatabaseProvider } from './context/DatabaseContext';
import WorkoutSection from './screens/WorkoutsSection';
import Menubar from './components/Menubar';
import WorkoutDays from './screens/WorkoutDays';
import WorkoutLogger from './screens/WorkoutLogger';
import StatsScreen from './screens/StatsScreen';
import GymsMap from './screens/GymsMap';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();
// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#228CDB" />
    <Text style={styles.loadingText}>Loading App...</Text>
  </View>
);

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('Workouts');

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        const route = navigationRef.getCurrentRoute();
        if (route?.name && route.name !== currentRoute) {
          setCurrentRoute(route.name);
        }
      }
    }, 100); // Polling every 100ms (can optimize later)

    return () => clearInterval(interval);
  }, [currentRoute]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Suspense fallback={<LoadingScreen />}>
        <DatabaseProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Workouts" component={WorkoutSection} />
            <Stack.Screen name="WorkoutDays" component={WorkoutDays} />
            <Stack.Screen name="WorkoutLogger" component={WorkoutLogger} />
            <Stack.Screen name="Stats" component={StatsScreen} />
            <Stack.Screen name="GymsMap" component={GymsMap} />
          </Stack.Navigator>
        </DatabaseProvider>
      </Suspense>
      <Menubar currentRoute={currentRoute} />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
