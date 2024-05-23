import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'
import FilterScreen from './FilterScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;