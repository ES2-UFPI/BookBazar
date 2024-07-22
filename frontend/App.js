import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import CreateAdScreen from './screens/CreateAdScreen';
import ViewBookScreen from './screens/ViewBookScreen';

const Stack = createStackNavigator();

const BookBazar = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="lightgray" barStyle="dark-content"/>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
        />
        <Stack.Screen
          name="CreateAd"
          component={CreateAdScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: 'lightgray'
  },
  headerTintColor: 'black',
  headerTitleStyle: {
    fontWeight: "bold",
  }
};

export default BookBazar;
