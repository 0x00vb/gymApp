import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WorkoutSection from './screens/WorkoutsSection';
import Menubar from './components/Menubar';
import WorkoutDays from './screens/WorkoutDays';
import WorkoutLogger from './screens/WorkoutLogger';
import StatsScreen from './screens/StatsScreen';
import { useCallback, useEffect } from 'react';
import openDatabase from './utils/db-service';


const Stack = createNativeStackNavigator();

export default function App() {   

  useEffect(() => {
    const db = openDatabase('/Users/valentinobalatti/projects/mobile/gymApp/assets/database.db');

  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Workouts' component={WorkoutSection}/>
        <Stack.Screen name='WorkoutDays' component={WorkoutDays}/>
        <Stack.Screen name='WorkoutLogger' component={WorkoutLogger}/>
        <Stack.Screen name='Stats' component={StatsScreen}/>
      </Stack.Navigator>
      <Menubar/>
    </NavigationContainer>
  );
}
