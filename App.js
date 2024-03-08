import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WorkoutSection from './screens/WorkoutsSection';
import Menubar from './components/Menubar';
import WorkoutDays from './screens/WorkoutDays';
import WorkoutLogger from './screens/WorkoutLogger';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Workouts' component={WorkoutSection}/>
        <Stack.Screen name='WorkoutDays' component={WorkoutDays}/>
        <Stack.Screen name='WorkoutLogger' component={WorkoutLogger}/>
      </Stack.Navigator>
      <Menubar/>
    </NavigationContainer>
  );
}
