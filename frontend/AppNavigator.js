import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'
 

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;