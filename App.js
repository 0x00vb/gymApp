import React from 'react';
import { View, ActivityIndicator, Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import openDatabase from './utils/db-service';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite/next'

import WorkoutSection from './screens/WorkoutsSection';
import Menubar from './components/Menubar';
import WorkoutDays from './screens/WorkoutDays';
import WorkoutLogger from './screens/WorkoutLogger';
import StatsScreen from './screens/StatsScreen';
import GymsMap from './screens/GymsMap';

const Stack = createNativeStackNavigator();

export default function App() {   
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    openDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.log(e))
  }, [])

  if(!dbLoaded)
    return(
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
        <Text>Loading Database...</Text>
      </View>
    )

  return (
    <NavigationContainer>
      <React.Suspense>
        <SQLiteProvider databaseName='database.db' useSuspense>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='Workouts' component={WorkoutSection}/>
            <Stack.Screen name='WorkoutDays' component={WorkoutDays}/>
            <Stack.Screen name='WorkoutLogger' component={WorkoutLogger}/>
            <Stack.Screen name='Stats' component={StatsScreen}/>
            <Stack.Screen name='GymsMap' component={GymsMap}/>
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
      <Menubar/>
    </NavigationContainer>
  );
}
